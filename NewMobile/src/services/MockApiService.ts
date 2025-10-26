import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  Product, 
  Category, 
  Ticket, 
  User 
} from '../types';
import { mockProducts, mockCategories, mockTickets, mockUserStats } from '../utils/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * MockApiService - Provides mock API responses for development and testing
 * This service should only be used when the real API is unavailable or for testing purposes
 */
class MockApiService {
  private isEnabled: boolean = false;

  constructor(enabled: boolean = false) {
    this.isEnabled = enabled;
  }

  public enable(): void {
    this.isEnabled = true;
    console.warn('🧪 MockApiService enabled - Using mock data instead of real API');
  }

  public disable(): void {
    this.isEnabled = false;
    console.log('✅ MockApiService disabled - Will use real API');
  }

  public isActive(): boolean {
    return this.isEnabled;
  }

  // Mock delay to simulate network requests
  private async mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    
    const mockAuthResponse: AuthResponse = {
      token: 'mock-token-' + Date.now(),
      user: {
        id: 1,
        name: 'Mock User',
        email: credentials.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    
    // Store mock auth data
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAuthResponse.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockAuthResponse.user));
    
    return mockAuthResponse;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    
    const mockAuthResponse: AuthResponse = {
      token: 'mock-token-' + Date.now(),
      user: {
        id: 1,
        name: data.name,
        email: data.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    
    // Store mock auth data
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAuthResponse.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockAuthResponse.user));
    
    return mockAuthResponse;
  }

  async logout(): Promise<void> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay(200);
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    return mockProducts;
  }

  async getProduct(id: number): Promise<Product> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    
    // Get products first to extract categories from ticket_category field (same as real API)
    const products = await this.getProducts();
    
    // Extract unique ticket categories
    const uniqueCategories = [...new Set(products.map(p => p.ticket_category))];
    
    // Generate category objects with proper prize-based structure
    const categories: Category[] = uniqueCategories.map((categoryName, index) => {
      const id = index + 1;
      let color = '#007AFF';
      let icon = '🎫';
      let ticketAmount = 50000;
      let prizePool = '25,000,000 IQD';
      let displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      
      switch (categoryName.toLowerCase()) {
        case 'bronze':
          color = '#CD7F32';
          icon = '🥉';
          ticketAmount = 50000;
          prizePool = '25,000,000 IQD';
          displayName = 'Bronze Category';
          break;
        case 'silver':
          color = '#C0C0C0';
          icon = '🥈';
          ticketAmount = 100000;
          prizePool = '50,000,000 IQD';
          displayName = 'Silver Category';
          break;
        case 'golden':
        case 'gold':
          color = '#FFD700';
          icon = '🥇';
          ticketAmount = 200000;
          prizePool = '100,000,000 IQD';
          displayName = 'Golden Category';
          break;
        case 'platinum':
          color = '#E5E4E2';
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
  }

  // Ticket Methods
  async getTickets(): Promise<Ticket[]> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    return mockTickets;
  }

  // User Statistics
  async getUserStats(): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    return mockUserStats;
  }

  // Mock purchase functionality
  async purchaseProduct(productId: number, quantity: number = 1): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay(1000); // Longer delay for purchase simulation
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Generate mock tickets
    const tickets = [];
    
    // Get categories to find the category_id for this product
    const categories = await this.getCategories();
    const productCategory = categories.find(cat => 
      cat.name.toLowerCase() === product.ticket_category?.toLowerCase()
    );
    
    for (let i = 0; i < quantity; i++) {
      tickets.push({
        id: Date.now() + i,
        user_id: 1,
        product_id: productId,
        category_id: productCategory?.id, // Optional field
        ticket_number: `IQT-${Date.now()}-${i + 1}`,
        is_winner: false,
        prize_amount: null,
        drawn_at: null,
        purchase_amount: product.price || 0,
        status: 'active',
        draw_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return {
      order_id: Date.now(),
      product: product,
      quantity: quantity,
      total_amount: (product.price || 0) * quantity,
      tickets: tickets,
      created_at: new Date().toISOString(),
    };
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) {
      throw new Error('No user data found');
    }
    return JSON.parse(userData);
  }

  // App configuration
  async getAppConfig(): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay();
    return {
      appTitle: 'Iraqi E-commerce Lottery (Mock Mode)',
      supportedLanguages: ['en', 'ar'],
      themeOptions: ['light', 'dark'],
      currencySymbol: 'IQD',
      version: '1.0.0-mock',
      isTestMode: true,
    };
  }

  // Health check
  async healthCheck(): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('MockApiService is not enabled');
    }

    await this.mockDelay(100);
    return {
      status: 'ok',
      service: 'mock',
      timestamp: new Date().toISOString(),
      version: '1.0.0-mock',
    };
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();
export default mockApiService;
