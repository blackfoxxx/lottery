import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Api } from '../services/api';
import { NotificationService } from '../services/notification';

interface LotteryCategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
  hasActiveDrawing: boolean;
}

interface Ticket {
  id: string;
  productName: string;
  purchaseDate: string;
  status: 'pending' | 'won' | 'lost';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  isLoggedIn = false;
  totalProducts = 0;
  totalTickets = 0;
  lotteryCategories: LotteryCategory[] = [];
  recentTickets: Ticket[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: Api,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.loadDashboardData();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loadUserData();
    }
  }

  async loadDashboardData() {
    try {
      // Load lottery categories
      this.lotteryCategories = [
        {
          id: '1',
          name: 'يانصيب كرة القدم',
          description: 'جوائز رياضية وتذاكر مباريات',
          productCount: 12,
          hasActiveDrawing: true
        },
        {
          id: '2',
          name: 'يانصيب التكنولوجيا',
          description: 'أجهزة إلكترونية وهواتف ذكية',
          productCount: 8,
          hasActiveDrawing: false
        },
        {
          id: '3',
          name: 'يانصيب السيارات',
          description: 'سيارات وإكسسوارات',
          productCount: 5,
          hasActiveDrawing: true
        },
        {
          id: '4',
          name: 'يانصيب الذهب',
          description: 'مجوهرات ذهبية وفضية',
          productCount: 15,
          hasActiveDrawing: false
        }
      ];

      // Calculate total products
      this.totalProducts = this.lotteryCategories.reduce((sum, cat) => sum + cat.productCount, 0);

      // Load products from API if available
      const products = await this.api.getProducts().toPromise();
      if (products && products.length > 0) {
        this.totalProducts = products.length;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async loadUserData() {
    try {
      // Load user's tickets
      const tickets = await this.api.getTickets().toPromise();
      if (tickets) {
        this.totalTickets = tickets.length;
        this.recentTickets = tickets.slice(0, 3); // Show only recent 3
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  navigateToProducts(category: LotteryCategory) {
    this.router.navigate(['/products'], { 
      queryParams: { category: category.id, categoryName: category.name } 
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.totalTickets = 0;
    this.recentTickets = [];
    this.notificationService.success('تم تسجيل الخروج', 'تم تسجيل خروجك بنجاح');
  }

  getTicketStatusColor(status: string): string {
    switch (status) {
      case 'won':
        return 'success';
      case 'lost':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getTicketStatusText(status: string): string {
    switch (status) {
      case 'won':
        return 'فائز';
      case 'lost':
        return 'خاسر';
      default:
        return 'انتظار';
    }
  }
}
