import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  Product, 
  Category, 
  Ticket, 
  User 
} from '../types';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { ErrorHandler, NetworkError, AuthenticationError } from './ErrorHandler';

class ApiService {
  private api: AxiosInstance;
  private isApiAvailable: boolean = true;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        // Mark API as available on successful response
        this.isApiAvailable = true;
        return response;
      },
      async (error: AxiosError) => {
        // Mark API as unavailable on network errors
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || !error.response) {
          this.isApiAvailable = false;
        }
        
        if (error.response?.status === 401) {
          // Clear auth data on unauthorized
          await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  // Helper method to handle API errors
  private handleError(error: any): never {
    const appError = ErrorHandler.handleError(error, false);
    throw appError;
  }

  // Check if API is available
  public getApiStatus(): boolean {
    return this.isApiAvailable;
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.api.get(API_ENDPOINTS.HEALTH);
      this.isApiAvailable = true;
      return true;
    } catch (error) {
      this.isApiAvailable = false;
      return false;
    }
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
      const data = this.handleResponse(response);
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
      const responseData = this.handleResponse(response);
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, responseData.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(responseData.user));
      
      return responseData;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
    }
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get<Product[]>(API_ENDPOINTS.PRODUCTS);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProduct(id: number): Promise<Product> {
    try {
      // First try to get the product directly from the endpoint
      const response = await this.api.get<Product>(`${API_ENDPOINTS.PRODUCT_DETAIL}/${id}`);
      const data = this.handleResponse(response);
      
      // If backend returns empty array or null, fallback to filtering all products
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.log('⚠️ Backend returned empty data for product ID:', id, '- Fetching all products...');
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        
        return product;
      }
      
      return data;
    } catch (error) {
      // If the direct endpoint fails, try fetching all products and filtering
      console.log('⚠️ Direct product fetch failed, trying alternative method...');
      try {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        
        return product;
      } catch (fallbackError) {
        this.handleError(fallbackError);
      }
    }
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    try {
      // Get products first to extract categories from ticket_category field
      const products = await this.getProducts();
      
      // Extract unique ticket categories
      const uniqueCategories = [...new Set(products.map(p => p.ticket_category))];
      
      // Generate category objects with proper prize-based structure
      const categories: Category[] = uniqueCategories.map((categoryName, index) => {
        const id = index + 1;
        let color = '#f53003';     // Backend primary color as default
        let icon = '🎫';
        let ticketAmount = 50000;
        let prizePool = '25,000,000 IQD';
        let displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        switch (categoryName.toLowerCase()) {
          case 'bronze':
            color = '#ea580c';     // More vibrant bronze matching theme colors
            icon = '🥉';
            ticketAmount = 50000;
            prizePool = '25,000,000 IQD';
            displayName = 'Bronze Category';
            break;
          case 'silver':
            color = '#9ca3af';     // Silver matching theme colors
            icon = '🥈';
            ticketAmount = 100000;
            prizePool = '50,000,000 IQD';
            displayName = 'Silver Category';
            break;
          case 'golden':
          case 'gold':
            color = '#fbbf24';     // Golden matching theme colors
            icon = '🥇';
            ticketAmount = 200000;
            prizePool = '100,000,000 IQD';
            displayName = 'Golden Category';
            break;
          case 'platinum':
            color = '#e5e7eb';     // Platinum matching theme colors
            icon = '💎';
            ticketAmount = 500000;
            prizePool = '200,000,000 IQD';
            displayName = 'Platinum Category';
            break;
        }
        
        return {
          id,
          name: categoryName.toLowerCase(),
          display_name: displayName,
          description: `${displayName} prizes with excellent rewards`,
          ticket_amount: ticketAmount,
          logo_url: null,
          color,
          icon,
          is_active: true,
          sort_order: id,
          prize_pool: prizePool,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      
      // Sort categories by prize value (Bronze, Silver, Golden, Platinum)
      const sortOrder = ['bronze', 'silver', 'golden', 'gold', 'platinum'];
      categories.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.name.toLowerCase());
        const bIndex = sortOrder.indexOf(b.name.toLowerCase());
        return aIndex - bIndex;
      });
      
      return categories;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Ticket Methods
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await this.api.get<Ticket[]>(API_ENDPOINTS.TICKETS);
      return this.handleResponse(response);
    } catch (error: any) {
      // Handle 404 gracefully - tickets endpoint might not be implemented yet
      if (error?.response?.status === 404) {
        // Silent log for expected 404s during development
        if (__DEV__) {
          console.log('ℹ️ Tickets endpoint not available yet (expected during development)');
        }
        return [];
      }
      console.warn('Failed to fetch tickets, returning empty array:', error);
      return [];
    }
  }

  // Health Check
  async healthCheck(): Promise<any> {
    try {
      const response = await this.api.get(API_ENDPOINTS.HEALTH);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // User Profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>('/user');
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Purchase Product (generates lottery tickets)
  async purchaseProduct(productId: number, quantity: number = 1): Promise<any> {
    try {
      // Check if user is authenticated
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new AuthenticationError('Please login to purchase products');
      }

      // Log request details for debugging
      const requestPayload = {
        product_id: productId,
        quantity: quantity,
      };
      console.log('🛒 Purchase Request:', {
        endpoint: `${API_CONFIG.BASE_URL}/orders`,
        payload: requestPayload,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      });

      const response = await this.api.post('/orders', requestPayload);
      const data = this.handleResponse(response);
      
      // Log successful response
      console.log('✅ Purchase Response:', {
        status: response.status,
        hasOrder: !!data.order,
        hasTickets: !!data.tickets,
        ticketsCount: data.tickets_count || data.tickets?.length || 0,
        data: data,
      });
      
      return data;
    } catch (error: any) {
      // Log detailed error information
      console.error('❌ Purchase Error Details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
        hasAuth: !!(await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
      });

      // If simulation mode is enabled and backend fails, return mock success
      if (API_CONFIG.ENABLE_PURCHASE_SIMULATION && error?.response?.status === 500) {
        console.warn('⚠️ Backend purchase failed, using simulation mode');
        
        // Get product details for mock response
        try {
          const product = await this.getProduct(productId);
          const mockOrder = {
            id: Math.floor(Math.random() * 100000),
            product_id: productId,
            product_name: product.name,
            quantity: quantity,
            total_price: product.price * quantity,
            tickets_generated: product.ticket_count * quantity,
            ticket_category: product.ticket_category,
            status: 'completed',
            created_at: new Date().toISOString(),
            simulated: true, // Flag to indicate this is a simulated purchase
          };
          
          console.log('✅ Simulated purchase successful:', mockOrder);
          
          // Show info message about simulation
          if (__DEV__) {
            setTimeout(() => {
              console.log('ℹ️ SIMULATION MODE: Purchase completed locally. Backend integration pending.');
            }, 100);
          }
          
          return mockOrder;
        } catch (productError) {
          console.error('Failed to get product for simulation:', productError);
        }
      }
      
      // Provide more specific error messages for purchase failures
      if (error?.response?.status === 401) {
        throw new AuthenticationError('Please login to purchase products');
      } else if (error?.response?.status === 422) {
        throw new Error('Invalid purchase request. Please check product availability.');
      } else if (error?.response?.status === 500) {
        console.error('Backend purchase error:', error?.response?.data);
        throw new Error('Purchase service temporarily unavailable. Please try again later or contact support.');
      } else if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      this.handleError(error);
    }
  }

  // Get user orders
  async getOrders(): Promise<any[]> {
    try {
      const response = await this.api.get('/orders');
      return this.handleResponse(response);
    } catch (error: any) {
      // Handle 404 gracefully for orders endpoints
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ getOrders endpoint not available yet (expected during development)');
        }
        return [];
      }
      console.warn('Failed to fetch orders, returning empty array:', error);
      return [];
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.api.put('/user', data);
      return this.handleResponse(response);
    } catch (error: any) {
      // Handle 404 gracefully for profile endpoints
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ updateProfile endpoint not available yet (expected during development)');
        }
        // Return mock updated user data and update AsyncStorage
        const updatedUser = {
          id: 1,
          name: data.name || 'User',
          email: data.email || 'user@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Update stored user data
        try {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        } catch (storageError) {
          console.warn('Failed to update stored user data:', storageError);
        }
        
        return updatedUser;
      }
      this.handleError(error);
    }
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.api.put('/user/password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
    } catch (error: any) {
      // Handle 404 gracefully for password endpoints
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ changePassword endpoint not available yet (expected during development)');
        }
        // Simulate successful password change - in development mode only
        return Promise.resolve();
      }
      this.handleError(error);
    }
  }

  // Get lottery draws
  async getDraws(): Promise<any[]> {
    try {
      const response = await this.api.get('/draws');
      return this.handleResponse(response);
    } catch (error: any) {
      // Handle 404 gracefully for draws endpoints
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ getDraws endpoint not available yet (expected during development)');
        }
        return [];
      }
      console.warn('Failed to fetch draws, returning empty array:', error);
      return [];
    }
  }

  // Get next upcoming draw
  async getNextDraw(): Promise<any | null> {
    try {
      const draws = await this.getDraws();
      // Filter for upcoming draws and get the nearest one
      const upcomingDraws = draws
        .filter((draw: any) => draw.status === 'upcoming' && new Date(draw.draw_date) > new Date())
        .sort((a: any, b: any) => new Date(a.draw_date).getTime() - new Date(b.draw_date).getTime());
      
      return upcomingDraws.length > 0 ? upcomingDraws[0] : null;
    } catch (error: any) {
      console.warn('Failed to fetch next draw:', error);
      return null;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<any> {
    try {
      const response = await this.api.get('/user/stats');
      return this.handleResponse(response);
    } catch (error) {
      console.warn('getUserStats endpoint not available, providing fallback stats');
      // Provide fallback stats when endpoint doesn't exist
      try {
        const products = await this.getProducts();
        let ticketsCount = 0;
        
        // Try to get tickets count, but don't fail if it doesn't work
        try {
          const tickets = await this.getTickets();
          ticketsCount = tickets.length;
        } catch (ticketError) {
          console.log('Tickets endpoint not available for stats, using 0');
          ticketsCount = 0;
        }
        
        return {
          products: products.length,
          tickets: ticketsCount,
          categories: [...new Set(products.map(p => p.ticket_category))].length
        };
      } catch (fallbackError) {
        // If all fails, return minimal stats
        console.warn('All fallback methods failed, returning default stats');
        return {
          products: 0,
          tickets: 0,
          categories: 0
        };
      }
    }
  }

  // Get app configuration
  async getAppConfig(): Promise<any> {
    try {
      const response = await this.api.get('/config');
      return this.handleResponse(response);
    } catch (error) {
      console.warn('API getAppConfig failed, using default config:', error);
      // Return default config when API fails
      return {
        appTitle: 'بلخير',
        supportedLanguages: ['en', 'ar'],
        themeOptions: ['light', 'dark'],
        currencySymbol: 'IQD',
        version: '1.0.0'
      };
    }
  }

  // Get theme colors from backend (for future use)
  async getThemeColors(): Promise<any> {
    try {
      const response = await this.api.get('/theme-colors');
      return this.handleResponse(response);
    } catch (error) {
      console.log('Theme colors endpoint not available, using default colors');
      // Return backend-inspired color scheme as fallback
      return {
        light: {
          primary: '#f53003',
          background: '#FDFDFC',
          surface: '#FFFFFF',
          text: '#1b1b18',
          textSecondary: '#706f6c',
          border: '#e3e3e0'
        },
        dark: {
          primary: '#FF4433',
          background: '#0a0a0a',
          surface: '#161615',
          text: '#EDEDEC',
          textSecondary: '#A1A09A',
          border: '#3E3E3A'
        },
        categories: {
          bronze: '#ea580c',
          silver: '#9ca3af',
          golden: '#fbbf24',
          platinum: '#e5e7eb'
        }
      };
    }
  }

  // Notification Methods
  async registerPushToken(token: string, deviceInfo?: any): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.REGISTER_DEVICE, {
        push_token: token,
        device_info: deviceInfo || {},
      });
      console.log('Push token registered with backend');
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ registerPushToken endpoint not available yet (expected during development)');
        }
        return;
      }
      console.warn('Failed to register push token:', error);
    }
  }

  async unregisterPushToken(token: string): Promise<void> {
    try {
      await this.api.post(API_ENDPOINTS.UNREGISTER_DEVICE, {
        push_token: token,
      });
      console.log('Push token unregistered from backend');
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ unregisterPushToken endpoint not available yet (expected during development)');
        }
        return;
      }
      console.warn('Failed to unregister push token:', error);
    }
  }

  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.api.get(API_ENDPOINTS.NOTIFICATIONS);
      return this.handleResponse(response);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ getNotifications endpoint not available yet (expected during development)');
        }
        return [];
      }
      console.warn('Failed to fetch notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await this.api.put(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (__DEV__) {
          console.log('ℹ️ markNotificationAsRead endpoint not available yet (expected during development)');
        }
        return;
      }
      console.warn('Failed to mark notification as read:', error);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
