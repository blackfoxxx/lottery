import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private api: Api) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        this.logout();
      }
    }
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string }): Observable<any> {
    return new Observable(observer => {
      this.api.register(data).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          this.handleAuthResponse(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Registration error:', error);
          observer.error(error);
        }
      });
    });
  }

  login(data: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.api.login(data).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          this.handleAuthResponse(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('Login error:', error);
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.clearAuthData();
      },
      error: () => {
        // Clear anyway if API call fails
        this.clearAuthData();
      }
    });
  }

  private handleAuthResponse(response: any): void {
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.tokenSubject.next(response.token);
      this.currentUserSubject.next(response.user);
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
