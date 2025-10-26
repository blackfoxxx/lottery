import { NavigatorScreenParams } from '@react-navigation/native';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
  error?: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id?: number;
  ticket_category: string;
  ticket_count: number;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string;
  ticket_amount: number;
  logo_url: string | null;
  color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  prize_pool: string;
  created_at: string;
  updated_at: string;
}

// Ticket Types
export interface Ticket {
  id: number;
  user_id: number;
  product_id: number;
  category_id?: number; // Optional since we can derive from product
  ticket_number: string;
  is_winner: boolean;
  prize_amount: number | null;
  drawn_at: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  category?: Category;
}

// Draw Types
export interface Draw {
  id: number;
  category_id: number;
  category_name: string;
  draw_date: string;
  prize_amount: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  winning_ticket_id?: number | null;
  total_tickets: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Products: NavigatorScreenParams<ProductStackParamList> | undefined;
  Tickets: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  PaymentMethods: undefined;
  PurchaseHistory: undefined;
  NotificationSettings: undefined;
};

export type ProductStackParamList = {
  ProductList: { categoryId?: number; categoryName?: string } | undefined;
  ProductDetail: { productId: number };
  Checkout: { product: Product };
};

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
}
