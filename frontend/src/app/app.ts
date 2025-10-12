import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductList } from './components/product-list/product-list';
import { AuthComponent } from './components/auth/auth';
import { TicketsComponent } from './components/tickets/tickets';
import { AdminComponent } from './components/admin/admin';
import { NotificationsComponent } from './components/notifications/notifications';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ProductList, AuthComponent, TicketsComponent, AdminComponent, NotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bil-khair-platform');
  
  // UI state management
  currentSection = signal('home');
  showAuthModal = signal(false);
  cartItems = signal(0);
  selectedCategory = signal<string | undefined>(undefined);

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

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
  selectLotteryCategory(category: string): void {
    this.selectedCategory.set(category);
    this.navigateToSection('products');
    
    // Show notification about the selected category
    const categoryInfo = {
      golden: { emoji: '🥇', name: 'Golden', prizes: 'Premium electronics worth 1,500,000+ IQD' },
      silver: { emoji: '🥈', name: 'Silver', prizes: 'Quality products worth 500,000-1,499,999 IQD' },
      bronze: { emoji: '🥉', name: 'Bronze', prizes: 'Essential electronics worth 100,000-499,999 IQD' }
    };
    
    const info = categoryInfo[category as keyof typeof categoryInfo];
    this.notificationService.success(
      `${info.emoji} ${info.name} Lottery Selected!`,
      `Browse ${info.name.toLowerCase()} products and get 100 FREE lottery tickets with each purchase. ${info.prizes}`
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
