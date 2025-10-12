import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl: string;
  
  constructor(private http: HttpClient) {
    const loc = window?.location;
    // Use local backend when running Angular dev server (any port), otherwise use Nginx proxy path
    if (loc && (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') && loc.port) {
      // Development mode - point to local backend
      this.baseUrl = 'http://localhost:8000/api';
    } else {
      // In Docker/production, Nginx proxies /api to backend
      this.baseUrl = '/api';
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Auth methods
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers });
  }

  // Product methods
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }

  createProduct(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/products`, data, { headers });
  }

  updateProduct(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/products/${id}`, data, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers });
  }

  // Order methods (automatically generates FREE lottery tickets)
  getOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/orders`, { headers });
  }

  purchaseProduct(data: { product_id: number, quantity: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/orders`, data, { headers });
  }

  purchaseProductWithPayment(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/orders/with-payment`, data, { headers });
  }

  // Ticket methods (view only - tickets are generated with product purchases)
  getTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/tickets`, { headers });
  }

  // Prize methods
  getPrizes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/prizes`);
  }

  // Lottery draw methods
  getLotteryDraws(): Observable<any> {
    return this.http.get(`${this.baseUrl}/lottery-draws`);
  }

  getLotteryDrawCountdown(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lottery-draws/${id}/countdown`);
  }

  // Category methods
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  // Admin methods
  getAdminDashboard(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/dashboard`, { headers });
  }

  // Admin Products
  getAdminProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/products`, { headers });
  }

  createAdminProduct(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/products`, data, { headers });
  }

  updateAdminProduct(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/products/${id}`, data, { headers });
  }

  deleteAdminProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/products/${id}`, { headers });
  }

  // Admin Products with Image Upload
  createAdminProductWithImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set Content-Type for FormData, let the browser set it
    });
    return this.http.post(`${this.baseUrl}/admin/products`, formData, { headers });
  }

  updateAdminProductWithImage(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set Content-Type for FormData, let the browser set it
    });
    return this.http.post(`${this.baseUrl}/admin/products/${id}?_method=PUT`, formData, { headers });
  }

  // Admin Users
  getAdminUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/users`, { headers });
  }

  createAdminUser(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/users`, data, { headers });
  }

  updateAdminUser(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/users/${id}`, data, { headers });
  }

  deleteAdminUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`, { headers });
  }

  // Admin Orders
  getAdminOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/orders`, { headers });
  }

  updateAdminOrder(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/orders/${id}`, data, { headers });
  }

  // Admin Tickets
  getAdminTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/tickets`, { headers });
  }

  markTicketAsUsed(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/tickets/${id}/mark-used`, {}, { headers });
  }

  getTicketDetails(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/tickets/${id}`, { headers });
  }

  // Admin Lottery Draws
  getAdminLotteryDraws(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/lottery-draws`, { headers });
  }

  createAdminLotteryDraw(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/lottery-draws`, data, { headers });
  }

  updateAdminLotteryDraw(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/lottery-draws/${id}`, data, { headers });
  }

  deleteAdminLotteryDraw(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/lottery-draws/${id}`, { headers });
  }

  performDraw(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/lottery-draws/${id}/draw`, {}, { headers });
  }

  // Admin Categories
  getAdminCategories(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/categories`, { headers });
  }

  createAdminCategory(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/categories`, data, { headers });
  }

  createAdminCategoryWithLogo(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set Content-Type for FormData, let the browser set it
    });
    return this.http.post(`${this.baseUrl}/admin/categories`, formData, { headers });
  }

  updateAdminCategory(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/categories/${id}`, data, { headers });
  }

  updateAdminCategoryWithLogo(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set Content-Type for FormData, let the browser set it
    });
    return this.http.post(`${this.baseUrl}/admin/categories/${id}?_method=PUT`, formData, { headers });
  }

  deleteAdminCategory(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/categories/${id}`, { headers });
  }

  // System Settings
  getSystemSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/settings`, { headers });
  }

  updateSystemSettings(settings: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/settings`, settings, { headers });
  }

  updateLotteryConfiguration(config: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/lottery-config`, config, { headers });
  }

  resetSystemSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/settings/reset`, {}, { headers });
  }

  exportSystemSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/settings/export`, { headers });
  }

  importSystemSettings(settings: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/settings/import`, { settings }, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }
}
