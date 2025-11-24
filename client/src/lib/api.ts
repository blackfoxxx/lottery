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
  sale_end_date?: string;
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
  lottery_tickets?: number;
  tracking_number?: string;
  shipment_status?: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shipped_at?: string;
  delivered_at?: string;
  carrier?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface LotteryDraw {
  id: number;
  name: string;
  category: 'bronze' | 'silver' | 'golden';
  draw_date: string;
  prize_amount: number;
  prize_description?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  total_tickets: number;
  winner_ticket?: string;
  winner_user_id?: number;
  drawn_at?: string;
}

export interface LotteryTicket {
  id: number;
  ticket_number: string;
  user_id: number;
  order_id: number;
  category: 'bronze' | 'silver' | 'golden';
  product_name: string;
  status: 'active' | 'winner' | 'expired';
  draw_id?: number;
  created_at: string;
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

  async getOrders(): Promise<{ success: boolean; data: Order[] }> {
    return this.request<{ success: boolean; data: Order[] }>('/orders');
  }

  async login(email: string, password: string): Promise<{ success: boolean; data: AuthResponse }> {
    return this.request<{ success: boolean; data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; data: AuthResponse }> {
    return this.request<{ success: boolean; data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Lottery API methods
  async getLotteryDraws(category?: string, status?: string): Promise<{ success: boolean; data: LotteryDraw[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    const query = params.toString();
    return this.request<{ success: boolean; data: LotteryDraw[] }>(
      `/lottery/draws${query ? `?${query}` : ''}`
    );
  }

  async createLotteryDraw(drawData: Partial<LotteryDraw>): Promise<{ success: boolean; data: LotteryDraw }> {
    return this.request<{ success: boolean; data: LotteryDraw }>('/lottery/draws', {
      method: 'POST',
      body: JSON.stringify(drawData),
    });
  }

  async updateLotteryDraw(id: number, drawData: Partial<LotteryDraw>): Promise<{ success: boolean; data: LotteryDraw }> {
    return this.request<{ success: boolean; data: LotteryDraw }>(`/lottery/draws/${id}`, {
      method: 'PUT',
      body: JSON.stringify(drawData),
    });
  }

  async performLotteryDraw(id: number): Promise<{ success: boolean; data: { draw: LotteryDraw; winning_ticket: LotteryTicket } }> {
    return this.request<{ success: boolean; data: { draw: LotteryDraw; winning_ticket: LotteryTicket } }>(
      `/lottery/draws/${id}/perform`,
      { method: 'POST' }
    );
  }

  async generateLotteryTickets(ticketData: any): Promise<{ success: boolean; data: LotteryTicket[] }> {
    return this.request<{ success: boolean; data: LotteryTicket[] }>('/lottery/tickets/generate', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async getUserLotteryTickets(userId: number): Promise<{ success: boolean; data: { tickets: LotteryTicket[]; stats: any } }> {
    return this.request<{ success: boolean; data: { tickets: LotteryTicket[]; stats: any } }>(
      `/lottery/users/${userId}/tickets`
    );
  }

  async getLotteryWinners(category?: string): Promise<{ success: boolean; data: LotteryDraw[] }> {
    const query = category ? `?category=${category}` : '';
    return this.request<{ success: boolean; data: LotteryDraw[] }>(`/lottery/winners${query}`);
  }
}

export const api = new APIClient(API_BASE_URL);
