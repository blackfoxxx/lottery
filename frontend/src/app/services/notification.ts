import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  // Clear any existing notifications on service initialization
  constructor() {
    console.log('NotificationService constructor called - clearing any lingering notifications');
    
    // Clear any lingering notifications
    this.notifications$.next([]);
    
    // Clear any localStorage notification data that might persist
    try {
      localStorage.removeItem('notifications');
      sessionStorage.removeItem('notifications');
    } catch (e) {
      console.warn('Could not clear notification storage:', e);
    }
  }
  
  get notifications() {
    return this.notifications$.asObservable();
  }

  show(notification: Omit<Notification, 'id'>): string {
    // Validate notification content
    if (!notification.title || !notification.message) {
      console.warn('NotificationService.show() called with empty title or message:', notification);
      return '';
    }

    // Validate that title and message are strings
    if (typeof notification.title !== 'string' || typeof notification.message !== 'string') {
      console.warn('NotificationService.show() called with non-string title or message:', notification);
      return '';
    }

    const id = this.generateId();
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, newNotification]);

    // Auto-remove after duration (if not persistent)
    if (!newNotification.persistent && newNotification.duration! > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'error',
      title,
      message,
      persistent: true, // Errors should be persistent by default
      ...options
    });
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: 7000, // Longer duration for warnings
      ...options
    });
  }

  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  remove(id: string): void {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications$.next([]);
  }

  // Specific methods for common use cases
  purchaseSuccess(productName: string, ticketsCount: number): void {
    this.success(
      'Purchase Successful!',
      `You have successfully purchased ${productName} and received ${ticketsCount} FREE lottery tickets!`,
      {
        duration: 8000,
        actions: [
          {
            label: 'View Tickets',
            action: () => {
              // Navigate to tickets page
              window.location.hash = '#tickets';
            },
            primary: true
          }
        ]
      }
    );
  }

  ticketGenerated(ticketNumber: string, category: string): void {
    this.success(
      'Lottery Ticket Generated!',
      `Your ${category} ticket ${ticketNumber} has been generated successfully.`,
      { duration: 6000 }
    );
  }

  loginSuccess(userName: string): void {
    this.success(
      'Welcome Back!',
      `Hello ${userName}, you have been logged in successfully.`,
      { duration: 4000 }
    );
  }

  loginError(): void {
    this.error(
      'Login Failed',
      'Invalid email or password. Please check your credentials and try again.'
    );
  }

  networkError(): void {
    this.error(
      'Network Error',
      'Unable to connect to the server. Please check your internet connection and try again.'
    );
  }

  validationError(message: string): void {
    this.warning(
      'Validation Error',
      message
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
