import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  loading = false;
  selectedCategoryName: string = '';
  quantities: { [key: number]: number } = {};
  purchasing: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Get category from route params if navigated from home
    this.route.queryParams.subscribe(params => {
      if (params['categoryName']) {
        this.selectedCategoryName = params['categoryName'];
      }
    });
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.api.getProducts().subscribe({
      next: (products) => {
        console.log('Loaded products:', products);
        this.products = products;
        
        // Initialize quantities for each product
        this.products.forEach(product => {
          this.quantities[product.id] = 1;
          this.purchasing[product.id] = false;
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.error('خطأ', 'فشل في تحميل المنتجات');
        this.loading = false;
      }
    });
  }

  async purchaseProduct(product: any): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning('تسجيل الدخول مطلوب', 'يجب تسجيل الدخول أولاً للشراء');
      return;
    }

    const quantity = this.quantities[product.id] || 1;
    this.purchasing[product.id] = true;

    try {
      const response = await this.api.purchaseProduct({
        product_id: product.id,
        quantity: quantity
      }).toPromise();

      console.log('Purchase response:', response);

      // Success notification
      const ticketsCount = response.tickets?.length || response.tickets_generated || quantity * (product.tickets_per_purchase || 1);
      
      this.notificationService.success(
        'تم الشراء بنجاح!',
        `تم شراء ${product.name} وحصلت على ${ticketsCount} تذكرة يانصيب مجانية!`
      );

      // Reset quantity
      this.quantities[product.id] = 1;

    } catch (error: any) {
      console.error('Purchase error:', error);
      
      let errorMessage = 'حدث خطأ أثناء عملية الشراء';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.notificationService.error('فشل الشراء', errorMessage);
    } finally {
      this.purchasing[product.id] = false;
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'golden': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🎫';
    }
  }

  getCategoryText(category: string): string {
    switch (category) {
      case 'golden': return 'ذهبي';
      case 'silver': return 'فضي';
      case 'bronze': return 'برونزي';
      default: return 'عادي';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'golden': return 'warning';
      case 'silver': return 'medium';
      case 'bronze': return 'danger';
      default: return 'primary';
    }
  }

  getCategoryExpiry(category: string): string {
    switch (category) {
      case 'golden': return 'سنة واحدة';
      case 'silver': return '6 أشهر';
      case 'bronze': return '3 أشهر';
      default: return 'شهر واحد';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ar-IQ').format(price);
  }

  refreshProducts(): void {
    this.loadProducts();
  }
}
