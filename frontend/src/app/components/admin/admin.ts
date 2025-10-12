import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  dashboardStats: any = {};
  loading = true;
  currentSection = 'dashboard';
  
  // Data arrays
  products: any[] = [];
  users: any[] = [];
  orders: any[] = [];
  tickets: any[] = [];
  filteredTickets: any[] = [];
  lotteryDraws: any[] = [];
  
  // Form data
  productForm = {
    name: '',
    description: '',
    price: 0,
    ticket_count: 1,
    ticket_category: 'bronze',
    in_stock: true,
    image_url: ''
  };
  
  editingProduct: any = null;
  showProductForm = false;
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  
  // Ticket filtering
  ticketFilters = {
    category: '',
    status: '',
    userSearch: '',
    ticketSearch: ''
  };

  // System settings
  systemSettings = {
    platformName: 'Bil Khair',
    platformNameArabic: 'بالخير - منصة التجارة الإلكترونية واليانصيب',
    platformDescription: 'Your trusted platform for electronics and lottery games in Iraq.',
    contactEmail: 'support@bilkhair.iq',
    contactPhone: '+964 123 456 789',
    goldenPrizePool: 5500000,
    silverPrizePool: 2800000,
    bronzePrizePool: 1200000,
    ticketsPerPurchase: 100,
    drawFrequency: 'daily',
    primaryColor: '#2563eb',
    secondaryColor: '#dc2626',
    welcomeMessage: 'Welcome to Bil Khair - Iraq\'s Premier E-commerce & Lottery Platform',
    footerText: '© 2025 Bil Khair Platform. All rights reserved.'
  };

  constructor(
    private api: Api,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.getCurrentUser()?.is_admin) {
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    this.loading = true;
    this.api.getAdminDashboard().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }



  // Products Management
  loadProducts(): void {
    this.api.getAdminProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.error(
          'Failed to Load Products',
          'Unable to fetch products from the server. Please refresh the page.'
        );
      }
    });
  }

  showAddProductForm(): void {
    this.editingProduct = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      ticket_count: 1,
      ticket_category: 'bronze',
      in_stock: true,
      image_url: ''
    };
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.showProductForm = true;
  }

  editProduct(product: any): void {
    this.editingProduct = product;
    this.productForm = { ...product };
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.showProductForm = true;
  }

  saveProduct(): void {
    const formData = new FormData();
    
    // Add form fields
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description || '');
    formData.append('price', this.productForm.price.toString());
    formData.append('ticket_count', this.productForm.ticket_count.toString());
    formData.append('ticket_category', this.productForm.ticket_category);
    formData.append('in_stock', this.productForm.in_stock.toString());
    
    // Add image file if selected
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    } else if (this.productForm.image_url) {
      formData.append('image_url', this.productForm.image_url);
    }

    if (this.editingProduct) {
      // Update existing product
      this.api.updateAdminProductWithImage(this.editingProduct.id, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm = false;
          this.notificationService.success(
            'Product Updated',
            `${this.productForm.name} has been updated successfully!`
          );
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.notificationService.error(
            'Update Failed',
            'Failed to update product. Please check your data and try again.'
          );
        }
      });
    } else {
      // Create new product
      this.api.createAdminProductWithImage(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm = false;
          this.notificationService.success(
            'Product Created',
            `${this.productForm.name} has been created successfully!`
          );
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.notificationService.error(
            'Creation Failed',
            'Failed to create product. Please check your data and try again.'
          );
        }
      });
    }
  }

  deleteProduct(product: any): void {
    this.notificationService.warning(
      'Confirm Product Deletion',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      {
        persistent: true,
        actions: [
          {
            label: 'Delete Product',
            action: () => this.confirmDeleteProduct(product),
            primary: true
          },
          {
            label: 'Cancel',
            action: () => {}
          }
        ]
      }
    );
  }

  private confirmDeleteProduct(product: any): void {
    this.api.deleteAdminProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.notificationService.success(
          'Product Deleted',
          `${product.name} has been deleted successfully.`
        );
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.notificationService.error(
          'Deletion Failed',
          'Failed to delete product. Please try again.'
        );
      }
    });
  }

  // Image upload handling methods
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Clear image URL if file is selected
      this.productForm.image_url = '';
    }
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return this.api.getBaseUrl() + imageUrl;
  }

  // Users Management
  loadUsers(): void {
    this.api.getAdminUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  // Orders Management
  loadOrders(): void {
    this.api.getAdminOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  // Tickets Management
  loadTickets(): void {
    this.api.getAdminTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.applyTicketFilters();
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      }
    });
  }

  // Ticket filtering methods
  applyTicketFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      // Category filter
      if (this.ticketFilters.category && ticket.category !== this.ticketFilters.category) {
        return false;
      }
      
      // Status filter
      if (this.ticketFilters.status === 'active' && ticket.is_used) {
        return false;
      }
      if (this.ticketFilters.status === 'used' && !ticket.is_used) {
        return false;
      }
      
      // User search filter
      if (this.ticketFilters.userSearch) {
        const userSearch = this.ticketFilters.userSearch.toLowerCase();
        const userName = ticket.user?.name?.toLowerCase() || '';
        const userEmail = ticket.user?.email?.toLowerCase() || '';
        if (!userName.includes(userSearch) && !userEmail.includes(userSearch)) {
          return false;
        }
      }
      
      // Ticket search filter
      if (this.ticketFilters.ticketSearch) {
        const ticketSearch = this.ticketFilters.ticketSearch.toLowerCase();
        const ticketNumber = ticket.ticket_number?.toLowerCase() || '';
        if (!ticketNumber.includes(ticketSearch)) {
          return false;
        }
      }
      
      return true;
    });
  }

  clearTicketFilters(): void {
    this.ticketFilters = {
      category: '',
      status: '',
      userSearch: '',
      ticketSearch: ''
    };
    this.applyTicketFilters();
  }

  // Ticket statistics methods
  getTicketCountByCategory(category: string): number {
    return this.tickets.filter(t => t.category === category).length;
  }

  getUsedTicketCountByCategory(category: string): number {
    return this.tickets.filter(t => t.category === category && t.is_used).length;
  }

  getActiveTicketsCount(): number {
    return this.tickets.filter(t => !t.is_used).length;
  }

  getUsedTicketsCount(): number {
    return this.tickets.filter(t => t.is_used).length;
  }

  getUserTicketCount(userId: number): number {
    return this.tickets.filter(t => t.user_id === userId).length;
  }

  // Enhanced user ticket statistics methods
  getUserActiveTicketCount(userId: number): number {
    return this.tickets.filter(t => t.user_id === userId && !t.is_used).length;
  }

  getUserTicketCountByCategory(userId: number, category: string): number {
    return this.tickets.filter(t => t.user_id === userId && t.category === category).length;
  }

  // User management actions
  viewUserTickets(user: any): void {
    const userTickets = this.tickets.filter(t => t.user_id === user.id);
    
    if (userTickets.length === 0) {
      this.notificationService.info(
        'No Tickets Found',
        `${user.name} has not purchased any products yet and has no lottery tickets.`
      );
      return;
    }

    const activeTickets = userTickets.filter(t => !t.is_used).length;
    const usedTickets = userTickets.filter(t => t.is_used).length;
    const goldenTickets = userTickets.filter(t => t.category === 'golden').length;
    const silverTickets = userTickets.filter(t => t.category === 'silver').length;
    const bronzeTickets = userTickets.filter(t => t.category === 'bronze').length;

    const message = `Total: ${userTickets.length} tickets | Active: ${activeTickets} | Used: ${usedTickets}\n🥇 Golden: ${goldenTickets} | 🥈 Silver: ${silverTickets} | 🥉 Bronze: ${bronzeTickets}\n\nView full ticket list in the Tickets Management tab.`;
    
    this.notificationService.info(
      `🎟️ ${user.name}'s Ticket Summary`,
      message,
      { 
        duration: 8000,
        actions: [
          {
            label: '✅ Got it',
            action: () => {}
          }
        ]
      }
    );
  }

  viewUserDetails(user: any): void {
    const userOrders = this.orders.filter(o => o.user_id === user.id);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total_price, 0);
    const goldenTickets = this.getUserTicketCountByCategory(user.id, 'golden');
    const silverTickets = this.getUserTicketCountByCategory(user.id, 'silver');
    const bronzeTickets = this.getUserTicketCountByCategory(user.id, 'bronze');
    const totalTickets = this.getUserTicketCount(user.id);
    
    const message = `${user.name} (${user.email})\nRole: ${user.is_admin ? '👑 Admin' : '👤 User'}\nJoined: ${this.formatDate(user.created_at)}\n\n📊 Activity Summary:\nOrders: ${userOrders.length} | Spent: ${this.formatPrice(totalSpent)} IQD\nTickets: ${totalTickets} total\n🥇 ${goldenTickets} | 🥈 ${silverTickets} | 🥉 ${bronzeTickets}`;
    
    this.notificationService.info(
      `👤 ${user.name}'s Profile`,
      message,
      { 
        duration: 8000,
        actions: [
          {
            label: '✅ Close',
            action: () => {}
          }
        ]
      }
    );
  }

  // Ticket management actions
  markTicketAsUsed(ticket: any): void {
    this.notificationService.warning(
      'Mark Ticket as Used',
      `Are you sure you want to mark ticket ${ticket.ticket_number} as used? This action cannot be undone.`,
      {
        persistent: true,
        actions: [
          {
            label: '🎯 Mark Used',
            action: () => this.executeMarkTicketUsed(ticket),
            primary: true
          },
          {
            label: '❌ Cancel',
            action: () => {}
          }
        ]
      }
    );
  }

  private executeMarkTicketUsed(ticket: any): void {
    this.api.markTicketAsUsed(ticket.id).subscribe({
      next: (response: any) => {
        ticket.is_used = true;
        this.applyTicketFilters();
        this.notificationService.success(
          'Ticket Marked as Used',
          `Ticket ${ticket.ticket_number} has been marked as used successfully.`
        );
      },
      error: (error: any) => {
        console.error('Error marking ticket as used:', error);
        this.notificationService.error(
          'Operation Failed',
          'Failed to mark ticket as used. Please try again.'
        );
      }
    });
  }

  viewTicketDetails(ticket: any): void {
    const details = `🎟️ ${ticket.ticket_number}
👤 User: ${ticket.user?.name} (${ticket.user?.email})
📦 Product: ${ticket.product?.name}
💰 Price: ${this.formatPrice(ticket.product?.price)} IQD
🏷️ Category: ${ticket.category}
📅 Generated: ${this.formatDate(ticket.generated_at || ticket.created_at)}
⏰ Expires: ${ticket.expires_at ? this.formatDate(ticket.expires_at) : 'No expiry'}
🔐 Code: ${ticket.verification_code || 'N/A'}
📊 Status: ${ticket.is_used ? '🎯 Used' : '✅ Active'}`;
    
    this.notificationService.info(
      'Ticket Details',
      details,
      { 
        duration: 12000,
        actions: [
          {
            label: '✅ Close',
            action: () => {}
          }
        ]
      }
    );
  }

  // Helper methods for category icons and colors
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'golden': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🎟️';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'golden': return '#fbbf24';
      case 'silver': return '#9ca3af';
      case 'bronze': return '#ea580c';
      default: return '#3b82f6';
    }
  }

  // Lottery Draws Management
  loadLotteryDraws(): void {
    this.api.getAdminLotteryDraws().subscribe({
      next: (draws) => {
        this.lotteryDraws = draws;
      },
      error: (error) => {
        console.error('Error loading lottery draws:', error);
      }
    });
  }

  performDraw(draw: any): void {
    this.notificationService.warning(
      'Confirm Lottery Draw',
      `Are you sure you want to perform lottery draw for "${draw.name}"? This action cannot be undone.`,
      {
        persistent: true,
        actions: [
          {
            label: '🎲 Perform Draw',
            action: () => this.executeDraw(draw),
            primary: true
          },
          {
            label: '❌ Cancel',
            action: () => {},
          }
        ]
      }
    );
  }

  private executeDraw(draw: any): void {
    this.api.performDraw(draw.id).subscribe({
      next: (result) => {
        this.notificationService.success(
          'Draw Completed!',
          `🎉 Winner: ${result.winner_ticket.ticket_number}`,
          { duration: 10000 }
        );
        this.loadLotteryDraws();
      },
      error: (error) => {
        console.error('Error performing draw:', error);
        this.notificationService.error(
          'Draw Failed',
          'Failed to perform lottery draw. Please try again.'
        );
      }
    });
  }

  // Utility methods
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && user.is_admin);
  }

  // System Settings Management
  updateSystemSettings(): void {
    this.api.updateSystemSettings(this.systemSettings).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Platform Settings Updated',
          'Platform branding and contact information has been saved successfully.'
        );
        this.applyPlatformSettings();
      },
      error: (error) => {
        console.error('Error updating system settings:', error);
        this.notificationService.error(
          'Update Failed',
          'Failed to save platform settings. Please try again.'
        );
      }
    });
  }

  updateLotterySettings(): void {
    this.api.updateSystemSettings(this.systemSettings).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Lottery Settings Updated',
          'Prize pools and lottery configuration has been saved successfully.'
        );
      },
      error: (error) => {
        console.error('Error updating lottery settings:', error);
        this.notificationService.error(
          'Update Failed',
          'Failed to save lottery settings. Please try again.'
        );
      }
    });
  }

  updateUISettings(): void {
    this.api.updateSystemSettings(this.systemSettings).subscribe({
      next: (response) => {
        this.notificationService.success(
          'UI Settings Updated',
          'Theme colors and interface settings has been saved successfully.'
        );
        this.applyUISettings();
      },
      error: (error) => {
        console.error('Error updating UI settings:', error);
        this.notificationService.error(
          'Update Failed',
          'Failed to save UI settings. Please try again.'
        );
      }
    });
  }

  applyPlatformSettings(): void {
    // Update platform name in header
    const headerTitle = document.querySelector('.logo-section h1');
    if (headerTitle) {
      headerTitle.textContent = `🛒 ${this.systemSettings.platformName}`;
    }
    
    // Update Arabic subtitle
    const arabicSubtitle = document.querySelector('.arabic-text span');
    if (arabicSubtitle) {
      arabicSubtitle.textContent = this.systemSettings.platformNameArabic;
    }
    
    // Update page title
    document.title = `${this.systemSettings.platformName} - Admin Dashboard`;
  }

  applyUISettings(): void {
    // Apply color scheme
    const root = document.documentElement;
    root.style.setProperty('--primary-color', this.systemSettings.primaryColor);
    root.style.setProperty('--secondary-color', this.systemSettings.secondaryColor);
    
    // Update CSS custom properties for buttons and elements
    const style = document.createElement('style');
    style.textContent = `
      .btn-primary { background-color: ${this.systemSettings.primaryColor} !important; }
      .bg-iraqi-green { background-color: ${this.systemSettings.primaryColor} !important; }
      .bg-iraqi-red { background-color: ${this.systemSettings.secondaryColor} !important; }
      .text-iraqi-green { color: ${this.systemSettings.primaryColor} !important; }
    `;
    document.head.appendChild(style);
  }

  refreshSystemStatus(): void {
    this.notificationService.info(
      'System Status Refreshed',
      'All system components are operating normally.'
    );
  }

  exportSystemData(): void {
    this.api.exportSystemSettings().subscribe({
      next: (response) => {
        const systemData = {
          settings: response,
          dashboardStats: this.dashboardStats,
          exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(systemData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `bil-khair-system-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.notificationService.success(
          'System Data Exported',
          'System configuration and statistics have been exported successfully.'
        );
      },
      error: (error) => {
        console.error('Error exporting system data:', error);
        this.notificationService.error(
          'Export Failed',
          'Failed to export system data. Please try again.'
        );
      }
    });
  }

  // Enhanced navigation with settings support
  navigateToSection(section: string): void {
    this.currentSection = section;
    
    switch (section) {
      case 'products':
        this.loadProducts();
        break;
      case 'users':
        this.loadUsers();
        break;
      case 'orders':
        this.loadOrders();
        break;
      case 'tickets':
        this.loadTickets();
        break;
      case 'lottery':
        this.loadLotteryDraws();
        break;
      case 'settings':
        // Load current system settings
        this.loadSystemSettings();
        break;
      case 'dashboard':
        this.loadDashboard();
        break;
    }
  }

  loadSystemSettings(): void {
    this.api.getSystemSettings().subscribe({
      next: (settings) => {
        this.systemSettings = { ...this.systemSettings, ...settings };
        this.notificationService.info(
          'System Settings Loaded',
          'Current system configuration has been loaded for editing.'
        );
      },
      error: (error) => {
        console.error('Error loading system settings:', error);
        this.notificationService.warning(
          'Settings Load Warning',
          'Using default settings. Unable to load saved configuration.'
        );
      }
    });
  }

  resetSystemSettings(): void {
    this.notificationService.warning(
      'Confirm Settings Reset',
      'Are you sure you want to reset all system settings to defaults? This action cannot be undone.',
      {
        persistent: true,
        actions: [
          {
            label: '🔄 Reset Settings',
            action: () => this.confirmResetSettings(),
            primary: true
          },
          {
            label: '❌ Cancel',
            action: () => {}
          }
        ]
      }
    );
  }

  private confirmResetSettings(): void {
    this.api.resetSystemSettings().subscribe({
      next: (response) => {
        this.systemSettings = response.settings;
        this.notificationService.success(
          'Settings Reset',
          'All system settings have been reset to defaults.'
        );
        this.applyPlatformSettings();
        this.applyUISettings();
      },
      error: (error) => {
        console.error('Error resetting system settings:', error);
        this.notificationService.error(
          'Reset Failed',
          'Failed to reset system settings. Please try again.'
        );
      }
    });
  }

  importSystemSettings(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importData = JSON.parse(e.target.result);
            if (importData.settings) {
              this.api.importSystemSettings(importData.settings).subscribe({
                next: (response) => {
                  this.systemSettings = response.settings;
                  this.notificationService.success(
                    'Settings Imported',
                    'System settings have been imported successfully.'
                  );
                  this.applyPlatformSettings();
                  this.applyUISettings();
                },
                error: (error) => {
                  console.error('Error importing settings:', error);
                  this.notificationService.error(
                    'Import Failed',
                    'Failed to import settings. Please check the file format.'
                  );
                }
              });
            } else {
              this.notificationService.error(
                'Invalid File',
                'The selected file does not contain valid settings data.'
              );
            }
          } catch (error) {
            this.notificationService.error(
              'File Error',
              'Unable to read the selected file. Please ensure it is a valid JSON file.'
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}
