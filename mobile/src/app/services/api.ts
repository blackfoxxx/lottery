import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:8001/api';

  constructor(private http: HttpClient) { }

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

  // Admin Tickets
  getAdminTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/tickets`, { headers });
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

  // Admin Lottery Draws
  getAdminLotteryDraws(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/lottery-draws`, { headers });
  }

  createLotteryDraw(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/lottery-draws`, data, { headers });
  }

  updateLotteryDraw(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/lottery-draws/${id}`, data, { headers });
  }

  deleteLotteryDraw(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/lottery-draws/${id}`, { headers });
  }

  performDraw(drawId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/lottery-draws/${drawId}/draw`, {}, { headers });
  }

  // Admin Prizes
  getAdminPrizes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/prizes`, { headers });
  }

  createAdminPrize(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/admin/prizes`, data, { headers });
  }

  updateAdminPrize(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/prizes/${id}`, data, { headers });
  }

  deleteAdminPrize(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/admin/prizes/${id}`, { headers });
  }

  // System status
  getSystemStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system/status`);
  }

  // Utility method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Settings methods
  getSettings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/settings`, { headers });
  }

  updateSettings(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/admin/settings`, data, { headers });
  }

  // Export methods
  exportUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/export/users`, { headers });
  }

  exportTickets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/export/tickets`, { headers });
  }

  exportProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/admin/export/products`, { headers });
  }
}
