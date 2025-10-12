import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductList } from './components/product-list/product-list';
import { AuthComponent } from './components/auth/auth';
import { TicketsComponent } from './components/tickets/tickets';
import { AdminComponent } from './components/admin/admin';
import { NotificationsComponent } from './components/notifications/notifications';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { Api } from './services/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ProductList, AuthComponent, TicketsComponent, AdminComponent, NotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('bil-khair-platform');
  
  // UI state management
  currentSection = signal('home');
  showAuthModal = signal(false);
  cartItems = signal(0);
  selectedCategory = signal<string | undefined>(undefined);
  categories = signal<any[]>([]);

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private api: Api
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load categories from API
  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (categories) => {
        // Filter only active categories and sort by sort_order
        const activeCategories = categories
          .filter((cat: any) => cat.is_active)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        this.categories.set(activeCategories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error(
          'Failed to load lottery categories',
          'Please refresh the page to try again'
        );
      }
    });
  }

  // Navigation methods
  navigateToSection(section: string): void {
    this.currentSection.set(section);
    // Scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Header button actions
  showAuth(): void {
    this.showAuthModal.set(true);
    this.navigateToSection('auth');
  }

  showCart(): void {
    if (this.cartItems() === 0) {
      this.notificationService.info(
        'Your cart is empty',
        'Add some products first to start earning FREE lottery tickets!'
      );
      return;
    }
    // Navigate to cart (could be expanded to show cart modal)
    this.navigateToSection('products');
  }

  // Hero section actions
  shopNow(): void {
    this.navigateToSection('products');
  }

  playLottery(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.error(
        'Please login first to view your lottery tickets',
        'Login Required'
      );
      this.showAuth();
      return;
    }
    this.navigateToSection('products');
  }

  // Lottery category selection
  selectLotteryCategory(category: any): void {
    this.selectedCategory.set(category.name);
    this.navigateToSection('products');
    
    // Show notification about the selected category
    this.notificationService.success(
      `${category.icon} ${category.display_name} Selected!`,
      `Browse ${category.display_name.toLowerCase()} products and get ${category.ticket_amount} FREE lottery tickets with each purchase. Prize pool: ${parseFloat(category.prize_pool).toLocaleString()} IQD`
    );
  }

  clearCategorySelection(): void {
    this.selectedCategory.set(undefined);
    this.navigateToSection('home');
    this.notificationService.info(
      'Category selection cleared',
      'Choose a lottery category to start shopping!'
    );
  }

  // Helper method to check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  // Get user display name
  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : 'User';
  }

  // Logout action
  logout(): void {
    this.authService.logout();
    this.currentSection.set('home');
    this.notificationService.success(
      'Logged out successfully!',
      'Thank you for using our platform. Come back soon!'
    );
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && user.is_admin);
  }

  // Utility method for template
  parseFloat(value: string): number {
    return parseFloat(value);
  }

  // Footer link handlers
  showTermsOfService(): void {
    this.notificationService.info(
      'Terms of Service',
      'Feature coming soon! We are preparing comprehensive terms of service for our platform.',
      { duration: 5000 }
    );
  }

  showPrivacyPolicy(): void {
    this.notificationService.info(
      'Privacy Policy',
      'Feature coming soon! We are committed to protecting your privacy and will publish our policy soon.',
      { duration: 5000 }
    );
  }

  showLotteryRules(): void {
    this.notificationService.info(
      'Lottery Rules',
      'Feature coming soon! Complete lottery rules and regulations will be available shortly.',
      { duration: 5000 }
    );
  }
}
