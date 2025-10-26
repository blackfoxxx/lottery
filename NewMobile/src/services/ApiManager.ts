import { apiService } from './ApiService';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  Product, 
  Category, 
  Ticket, 
  User 
} from '../types';

export enum ApiMode {
  REAL_API_ONLY = 'real_only',
}

/**
 * ApiManager - Real-time API connection manager
 */
class ApiManager {
  private currentMode: ApiMode = ApiMode.REAL_API_ONLY;

  constructor() {
    // Always use real API for real-time data
    this.currentMode = ApiMode.REAL_API_ONLY;
  }

  public setMode(mode: ApiMode): void {
    this.currentMode = mode;
    console.log(`🔄 API Manager mode set to: ${mode}`);
  }

  public getMode(): ApiMode {
    return this.currentMode;
  }

  private async executeRealTimeApi<T>(
    realApiCall: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      console.log(`🌐 Real-time API call: ${operationName}`);
      return await realApiCall();
    } catch (error) {
      console.error(`❌ Real-time API failed for ${operationName}:`, error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.executeRealTimeApi(
      () => apiService.login(credentials),
      'login'
    );
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.executeRealTimeApi(
      () => apiService.register(data),
      'register'
    );
  }

  async logout(): Promise<void> {
    return this.executeRealTimeApi(
      () => apiService.logout(),
      'logout'
    );
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    return this.executeRealTimeApi(
      () => apiService.getProducts(),
      'getProducts'
    );
  }

  async getProduct(id: number): Promise<Product> {
    return this.executeRealTimeApi(
      () => apiService.getProduct(id),
      'getProduct'
    );
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    return this.executeRealTimeApi(
      () => apiService.getCategories(),
      'getCategories'
    );
  }

  // Ticket Methods
  async getTickets(): Promise<Ticket[]> {
    return this.executeRealTimeApi(
      () => apiService.getTickets(),
      'getTickets'
    );
  }

  // User Methods
  async getCurrentUser(): Promise<User> {
    return this.executeRealTimeApi(
      () => apiService.getCurrentUser(),
      'getCurrentUser'
    );
  }

  async getUserStats(): Promise<any> {
    return this.executeRealTimeApi(
      () => apiService.getUserStats(),
      'getUserStats'
    );
  }

  // Purchase Methods
  async purchaseProduct(productId: number, quantity: number = 1): Promise<any> {
    return this.executeRealTimeApi(
      () => apiService.purchaseProduct(productId, quantity),
      'purchaseProduct'
    );
  }

  // Configuration Methods
  async getAppConfig(): Promise<any> {
    return this.executeRealTimeApi(
      () => apiService.getAppConfig(),
      'getAppConfig'
    );
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.executeRealTimeApi(
      () => apiService.healthCheck(),
      'healthCheck'
    );
  }

  // Additional real API methods
  async updateProfile(data: Partial<User>): Promise<User> {
    return this.executeRealTimeApi(
      () => apiService.updateProfile(data),
      'updateProfile'
    );
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.executeRealTimeApi(
      () => apiService.changePassword(oldPassword, newPassword),
      'changePassword'
    );
  }

  async getOrders(): Promise<any[]> {
    return this.executeRealTimeApi(
      () => apiService.getOrders(),
      'getOrders'
    );
  }

  async getDraws(): Promise<any[]> {
    return this.executeRealTimeApi(
      () => apiService.getDraws(),
      'getDraws'
    );
  }

  async getNextDraw(): Promise<any | null> {
    return this.executeRealTimeApi(
      () => apiService.getNextDraw(),
      'getNextDraw'
    );
  }

  // Theme Methods
  async getThemeColors(): Promise<any> {
    return this.executeRealTimeApi(
      () => apiService.getThemeColors(),
      'getThemeColors'
    );
  }

  // Utility Methods
  public getApiStatus(): { mode: ApiMode; realApiAvailable: boolean } {
    return {
      mode: this.currentMode,
      realApiAvailable: apiService.getApiStatus(),
    };
  }

  public async testConnectivity(): Promise<{
    realApi: boolean;
    recommendation: string;
  }> {
    const realApiTest = await apiService.testConnection();

    let recommendation = '';
    if (realApiTest) {
      recommendation = 'Real-time API is connected and operational';
    } else {
      recommendation = 'Real-time API is unavailable - check network connection';
    }

    return {
      realApi: realApiTest,
      recommendation,
    };
  }
}

// Export singleton instance
export const apiManager = new ApiManager();
export default apiManager;
