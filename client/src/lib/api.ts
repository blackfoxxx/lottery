const API_BASE_URL = 'https://8000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/api/v1';

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
  status: string;
  images: string[];
  lottery_tickets: number;
  lottery_category: string;
  rating: number;
  review_count: number;
  category_id: number;
  brand_id?: number;
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
}

export interface Brand {
  id: number;
  name: string;
  name_ar: string;
  logo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id?: number;
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async getProducts(params?: { category_id?: number; search?: string; page?: number }): Promise<{ success: boolean; data: { data: Product[] } }> {
    const queryParams = new URLSearchParams();
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString();
    return this.request<{ success: boolean; data: { data: Product[] } }>(
      `/products${query ? `?${query}` : ''}`
    );
  }

  async getProduct(id: number): Promise<{ success: boolean; data: Product }> {
    return this.request<{ success: boolean; data: Product }>(`/products/${id}`);
  }

  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return this.request<{ success: boolean; data: Category[] }>('/categories');
  }

  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; data: Order }> {
    return this.request<{ success: boolean; data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: number): Promise<{ success: boolean; data: Order }> {
    return this.request<{ success: boolean; data: Order }>(`/orders/${id}`);
  }
}

export const api = new APIClient(API_BASE_URL);
