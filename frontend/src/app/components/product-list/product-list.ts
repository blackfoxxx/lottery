import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { PaymentFormComponent } from '../payment-form';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, PaymentFormComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  @Input() filterCategory?: string;
  @Input() showDebug: boolean = false;
  
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  selectedCategoryFilter: string = 'all';
  
  // Payment form properties
  showPaymentForm = false;
  selectedProduct: any = null;

  constructor(
    private api: Api,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  getApiUrl(): string {
    return this.api.getBaseUrl();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    console.log('ProductList component initialized');
    console.log('Is authenticated:', this.isAuthenticated());
    console.log('Filter category:', this.filterCategory);
    this.loadCategories();
    this.loadProducts();
  }

  // Load categories from API
  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (categories) => {
        // Filter only active categories and sort by sort_order
        this.categories = categories
          .filter((cat: any) => cat.is_active)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    console.log('Loading products...');
    this.loading = true;
    this.error = null;
    
    this.api.getProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please check if the backend is running.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    // Use the advanced filter method for consistency
    this.applyAdvancedFilter();
  }

  getDisplayProducts(): any[] {
    return this.filteredProducts;
  }

  buyProduct(product: any): void {
    console.log('Buy product clicked:', product);
    if (!product.in_stock) return;
    
    if (!this.isAuthenticated()) {
      this.notificationService.error(
        'Login Required',
        'Please login first to purchase products!'
      );
      this.showLoginPrompt();
      return;
    }

    // Show payment form
    this.selectedProduct = product;
    this.showPaymentForm = true;
  }

  onPaymentSubmitted(paymentData: any): void {
    console.log('Payment submitted:', paymentData);
    this.processPurchaseWithPayment(paymentData);
  }

  private processPurchaseWithPayment(paymentData: any): void {
    // Show processing notification
    this.notificationService.info(
      'Processing Payment...',
      'Please wait while we process your payment and create your order.',
      { duration: 3000 }
    );

    this.api.purchaseProductWithPayment(paymentData).subscribe({
      next: (response: any) => {
        console.log('Product purchase with payment response:', response);
        
        this.notificationService.success(
          'Purchase Completed Successfully!',
          `Your order for ${this.selectedProduct.name} has been placed successfully! You've received ${response.tickets?.length || response.tickets_generated || 0} FREE lottery tickets. Order confirmation has been sent to your email.`,
          {
            duration: 10000,
            actions: [
              {
                label: 'View My Tickets',
                action: () => {
                  // Navigate to tickets section or refresh the page to show tickets
                  window.location.reload();
                },
                primary: true
              }
            ]
          }
        );
      },
      error: (error: any) => {
        console.error('Error processing payment:', error);
        
        if (error.status === 400) {
          this.notificationService.error(
            'Payment Failed',
            error.error?.message || 'There was an issue processing your payment. Please check your card details and try again.'
          );
        } else if (error.status === 422) {
          this.notificationService.error(
            'Invalid Payment Data',
            'Please check your payment information and try again.'
          );
        } else {
          this.notificationService.error(
            'Payment Processing Error',
            'We encountered an issue processing your payment. Please try again or contact support.'
          );
        }
        
        // Reopen payment form for retry
        this.showPaymentForm = true;
      }
    });
  }

  private showLoginPrompt(): void {
    this.notificationService.info(
      'Quick Account Setup',
      'Would you like to create a test account to start purchasing products and earning FREE lottery tickets?',
      {
        persistent: true,
        actions: [
          {
            label: 'Create Test Account',
            action: () => this.createTestAccount(),
            primary: true
          },
          {
            label: 'Maybe Later',
            action: () => {},
          }
        ]
      }
    );
  }

  private createTestAccount(): void {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    
    const registrationData = {
      name: 'Test User',
      email: email,
      password: password,
      password_confirmation: password
    };

    console.log('Creating test account:', registrationData);
    
    // Show loading notification
    this.notificationService.info(
      'Creating Account...',
      'Setting up your test account. Please wait...',
      { duration: 2000 }
    );
    
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        console.log('Test account created:', response);
        this.notificationService.success(
          'Account Created Successfully!',
          `Welcome! Your test account has been created and you're now logged in. You can start purchasing products to earn FREE lottery tickets!`,
          {
            duration: 8000,
            actions: [
              {
                label: 'Start Shopping',
                action: () => {
                  // Scroll to products section
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                },
                primary: true
              }
            ]
          }
        );
      },
      error: (error) => {
        console.error('Error creating test account:', error);
        this.notificationService.error(
          'Account Creation Failed',
          'Unable to create test account. Please try again or contact support.'
        );
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price);
  }

  calculateTicketPrice(product: any): number {
    return Math.floor(product.price / product.ticket_count);
  }

  getProductIcon(productName: string): string {
    const name = productName.toLowerCase();
    
    if (name.includes('iphone') || name.includes('galaxy') || name.includes('phone')) {
      return 'phone';
    } else if (name.includes('macbook') || name.includes('laptop')) {
      return 'laptop';
    } else if (name.includes('playstation') || name.includes('xbox') || name.includes('console')) {
      return 'console';
    } else if (name.includes('watch')) {
      return 'watch';
    } else if (name.includes('airpods') || name.includes('earbuds') || name.includes('headphones')) {
      return 'earbuds';
    } else if (name.includes('ipad') || name.includes('tablet')) {
      return 'tablet';
    } else if (name.includes('monitor')) {
      return 'monitor';
    } else {
      return 'phone';
    }
  }

  // Category filtering methods
  setCategoryFilter(categoryName: string): void {
    this.selectedCategoryFilter = categoryName;
    this.applyAdvancedFilter();
  }

  clearCategoryFilter(): void {
    this.selectedCategoryFilter = 'all';
    this.applyAdvancedFilter();
  }

  applyAdvancedFilter(): void {
    let filtered = this.products;

    // Apply category filter from input property (from main app)
    if (this.filterCategory) {
      filtered = filtered.filter(product => 
        product.ticket_category === this.filterCategory
      );
    }

    // Apply UI category filter
    if (this.selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.ticket_category === this.selectedCategoryFilter
      );
    }

    this.filteredProducts = filtered;
    console.log(`Filtered products (${this.selectedCategoryFilter}):`, this.filteredProducts);
  }

  getCategoryByName(categoryName: string): any {
    return this.categories.find(cat => cat.name === categoryName);
  }

  getCategoryIcon(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category ? category.icon : '🎟️';
  }

  getCategoryDisplayName(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category ? category.display_name : categoryName;
  }

  getCategoryColor(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category ? category.color : '#6b7280';
  }
}
