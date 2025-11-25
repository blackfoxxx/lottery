import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Update this to your backend URL
const API_BASE_URL = 'https://3000-iq33rt7vhyykz7thscpau-0526df27.manusvm.computer/api/trpc';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  preferred_language: 'ar' | 'en';
  is_active: boolean;
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  sku: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  min_stock_level: number;
  category_id: number;
  brand_id?: number;
  images: string[];
  weight?: number;
  dimensions?: string;
  lottery_tickets: number;
  lottery_category: 'bronze' | 'silver' | 'golden';
  attributes: Record<string, any>;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
}

export interface Category {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  slug: string;
  image?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  logo?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Bundle {
  id: number;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
  product_ids: number[];
  products?: Product[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
  product?: Product;
}

export interface BundleAnalytics {
  total_bundles: number;
  active_bundles: number;
  total_revenue: number;
  bundles: Array<{
    id: number;
    name: string;
    views: number;
    conversions: number;
    revenue: number;
    conversion_rate: number;
  }>;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_intent_id?: string;
  shipping_address: any;
  billing_address: any;
  notes?: string;
  total_lottery_tickets: number;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Authentication API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female';
    preferred_language?: 'ar' | 'en';
  }): Promise<ApiResponse<{ user: User; token: string; token_type: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string; token_type: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    featured?: boolean;
    in_stock?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<ApiResponse<{ product: Product; related_products: Product[] }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/products/featured');
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getCategoryProducts: async (id: number, params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get(`/categories/${id}/products`, { params });
    return response.data;
  },
};

// Lottery API
export const lotteryAPI = {
  getDraws: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/lottery/draws');
    return response.data;
  },

  getUserTickets: async (userId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/lottery/users/${userId}/tickets`);
    return response.data;
  },

  getWinners: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/lottery/winners');
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  processQiCardPayment: async (paymentData: {
    amount: number;
    order_id: number;
    customer_info: any;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/payments/qicard/process', paymentData);
    return response.data;
  },

  verifyPayment: async (transactionId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/payments/qicard/verify/${transactionId}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData: {
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
    shipping_address: any;
    billing_address?: any;
    payment_method: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

// Banners API
export const bannersAPI = {
  getBanners: async (params?: { is_active?: boolean }): Promise<ApiResponse<Banner[]>> => {
    const response = await api.get('/banners.list', { params });
    return response.data;
  },

  createBanner: async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Banner>> => {
    const response = await api.post('/banners.create', bannerData);
    return response.data;
  },

  updateBanner: async (id: number, bannerData: Partial<Banner>): Promise<ApiResponse<Banner>> => {
    const response = await api.put('/banners.update', { id, ...bannerData });
    return response.data;
  },

  deleteBanner: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/banners.delete?id=${id}`);
    return response.data;
  },

  toggleActive: async (id: number): Promise<ApiResponse<Banner>> => {
    const response = await api.post('/banners.toggleActive', { id });
    return response.data;
  },
};

// Bundles API
export const bundlesAPI = {
  getBundles: async (params?: { is_active?: boolean }): Promise<ApiResponse<Bundle[]>> => {
    const response = await api.get('/bundles.list', { params });
    return response.data;
  },

  getBundle: async (id: number): Promise<ApiResponse<Bundle>> => {
    const response = await api.get(`/bundles.getById?id=${id}`);
    return response.data;
  },

  createBundle: async (bundleData: Omit<Bundle, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Bundle>> => {
    const response = await api.post('/bundles.create', bundleData);
    return response.data;
  },

  updateBundle: async (id: number, bundleData: Partial<Bundle>): Promise<ApiResponse<Bundle>> => {
    const response = await api.put('/bundles.update', { id, ...bundleData });
    return response.data;
  },

  deleteBundle: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/bundles.delete?id=${id}`);
    return response.data;
  },

  toggleActive: async (id: number): Promise<ApiResponse<Bundle>> => {
    const response = await api.post('/bundles.toggleActive', { id });
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getReviews: async (params?: { 
    product_id?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<ApiResponse<Review[]>> => {
    const response = await api.get('/reviews.list', { params });
    return response.data;
  },

  getProductReviews: async (productId: number): Promise<ApiResponse<Review[]>> => {
    const response = await api.get(`/reviews.byProduct?product_id=${productId}`);
    return response.data;
  },

  createReview: async (reviewData: {
    product_id: number;
    rating: number;
    title?: string;
    comment?: string;
  }): Promise<ApiResponse<Review>> => {
    const response = await api.post('/reviews.create', reviewData);
    return response.data;
  },

  approveReview: async (id: number): Promise<ApiResponse<Review>> => {
    const response = await api.post('/reviews.approve', { id });
    return response.data;
  },

  rejectReview: async (id: number): Promise<ApiResponse<Review>> => {
    const response = await api.post('/reviews.reject', { id });
    return response.data;
  },

  deleteReview: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/reviews.delete?id=${id}`);
    return response.data;
  },

  bulkApprove: async (ids: number[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/reviews.bulkApprove', { ids });
    return response.data;
  },

  bulkReject: async (ids: number[]): Promise<ApiResponse<null>> => {
    const response = await api.post('/reviews.bulkReject', { ids });
    return response.data;
  },
};

// Bundle Analytics API
export const bundleAnalyticsAPI = {
  getOverview: async (params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<BundleAnalytics>> => {
    const response = await api.get('/bundleAnalytics.overview', { params });
    return response.data;
  },

  getPerformance: async (params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<BundleAnalytics['bundles']>> => {
    const response = await api.get('/bundleAnalytics.performance', { params });
    return response.data;
  },

  trackView: async (bundleId: number): Promise<ApiResponse<null>> => {
    const response = await api.post('/bundleAnalytics.trackView', { bundle_id: bundleId });
    return response.data;
  },

  trackConversion: async (bundleId: number, orderId: number): Promise<ApiResponse<null>> => {
    const response = await api.post('/bundleAnalytics.trackConversion', { 
      bundle_id: bundleId,
      order_id: orderId 
    });
    return response.data;
  },
};

// Utility functions
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

export const clearAuthData = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['auth_token', 'user_data']);
};

export const setUserData = async (user: User): Promise<void> => {
  await AsyncStorage.setItem('user_data', JSON.stringify(user));
};

export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export default api;
