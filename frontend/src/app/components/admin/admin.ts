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
  categories: any[] = [];
  
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

  // Product management
  editingProduct: any = null;
  showProductForm = false;
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  // User management
  userForm = {
    name: '',
    email: '',
    password: '',
    is_admin: false
  };
  
  editingUser: any = null;
  showUserForm = false;
  userModalTitle = 'Create New User';
  
  // Category management
  categoryForm = {
    name: '',
    display_name: '',
    description: '',
    ticket_amount: 1,
    color: '#2563eb',
    icon: '🎟️',
    prize_pool: 0,
    is_active: true
  };
  
  editingCategory: any = null;
  showCategoryForm = false;
  categoryModalTitle = 'Create New Category';
  selectedLogoFile: File | null = null;
  logoPreview: string | null = null;
  
  // Lottery Draw management
  lotteryDrawForm = {
    category_id: '',
    name: '',
    description: '',
    draw_date: '',
    total_tickets: 1000,
    prize_pool: 1000000,
    status: 'upcoming'
  };
  
  editingLotteryDraw: any = null;
  showLotteryDrawForm = false;
  
  // Lottery configuration
  lotteryConfig = {
    maxTicketsPerUser: 100,
    defaultDrawFrequency: 'weekly',
    defaultDrawTime: '20:00',
    autoCreateDraws: true
  };
  
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
    footerText: '© 2025 Bil Khair Platform. All rights reserved.',
    logoUrl: ''
  };

  // UI Settings
  selectedPlatformLogoFile: File | null = null;
  platformLogoPreview: string | null = null;

  constructor(
    private api: Api,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.getCurrentUser()?.is_admin) {
      this.loadDashboard();
      this.loadSystemSettings();
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

  loadSystemSettings(): void {
    this.api.getSystemSettings().subscribe({
      next: (settings) => {
        this.systemSettings = { ...this.systemSettings, ...settings };
        this.applyUISettings();
        this.applyPlatformSettings();
      },
      error: (error) => {
        console.error('Error loading system settings:', error);
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
    
    // Also load categories for the ticket category dropdown
    this.loadCategories();
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
        this.notificationService.error(
          'Failed to Load Users',
          'Unable to fetch users from the server. Please refresh the page.'
        );
      }
    });
  }

  showCreateUserForm(): void {
    this.editingUser = null;
    this.userForm = {
      name: '',
      email: '',
      password: '',
      is_admin: false
    };
    this.userModalTitle = 'Create New User';
    this.showUserForm = true;
  }

  editUser(user: any): void {
    this.editingUser = user;
    this.userForm = {
      name: user.name,
      email: user.email,
      password: '',
      is_admin: user.is_admin || false
    };
    this.userModalTitle = 'Edit User';
    this.showUserForm = true;
  }

  saveUser(): void {
    if (this.editingUser) {
      // Update existing user
      const updateData: any = {
        name: this.userForm.name,
        email: this.userForm.email,
        is_admin: this.userForm.is_admin
      };
      
      // Only include password if it's provided
      if (this.userForm.password.trim()) {
        updateData.password = this.userForm.password;
      }

      this.api.updateAdminUser(this.editingUser.id, updateData).subscribe({
        next: () => {
          this.loadUsers();
          this.showUserForm = false;
          this.notificationService.success(
            'User Updated',
            `${this.userForm.name} has been updated successfully!`
          );
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.notificationService.error(
            'Update Failed',
            'Failed to update user. Please check your data and try again.'
          );
        }
      });
    } else {
      // Create new user
      this.api.createAdminUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.showUserForm = false;
          this.notificationService.success(
            'User Created',
            `${this.userForm.name} has been created successfully!`
          );
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.notificationService.error(
            'Creation Failed',
            'Failed to create user. Please check your data and try again.'
          );
        }
      });
    }
  }

  deleteUser(user: any): void {
    // Prevent admin from deleting themselves
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      this.notificationService.error(
        'Cannot Delete Self',
        'You cannot delete your own account while logged in.'
      );
      return;
    }

    this.notificationService.warning(
      'Confirm User Deletion',
      `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      {
        persistent: true,
        actions: [
          {
            label: 'Delete User',
            action: () => this.confirmDeleteUser(user),
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

  private confirmDeleteUser(user: any): void {
    this.api.deleteAdminUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        this.notificationService.success(
          'User Deleted',
          `${user.name} has been deleted successfully.`
        );
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.notificationService.error(
          'Deletion Failed',
          'Failed to delete user. Please try again.'
        );
      }
    });
  }

  toggleUserAdminStatus(user: any): void {
    const newStatus = !user.is_admin;
    const updateData = {
      name: user.name,
      email: user.email,
      is_admin: newStatus
    };

    this.api.updateAdminUser(user.id, updateData).subscribe({
      next: () => {
        user.is_admin = newStatus;
        this.notificationService.success(
          'User Updated',
          `${user.name} is now ${newStatus ? 'an admin' : 'a regular user'}.`
        );
      },
      error: (error) => {
        console.error('Error updating user admin status:', error);
        this.notificationService.error(
          'Update Failed',
          'Failed to update user admin status. Please try again.'
        );
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

  // Helper methods for category management
  getCategoryByName(categoryName: string): any {
    return this.categories.find(cat => cat.name === categoryName);
  }

  getCategoryDisplay(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category ? `${category.icon} ${category.display_name}` : `🎟️ ${categoryName}`;
  }

  getCategoryColor(categoryName: string): string {
    const category = this.getCategoryByName(categoryName);
    return category ? category.color : '#6b7280';
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

  updateLotteryConfiguration(): void {
    // Update category prize pools
    const categoryUpdates = this.categories.map(category => ({
      id: category.id,
      prize_pool: category.prize_pool
    }));

    // Save lottery configuration
    const configData = {
      categories: categoryUpdates,
      globalSettings: this.lotteryConfig
    };

    this.api.updateLotteryConfiguration(configData).subscribe({
      next: (response) => {
        this.notificationService.success(
          'Lottery Configuration Updated',
          'Prize pools and lottery settings have been saved successfully.'
        );
      },
      error: (error) => {
        console.error('Error updating lottery configuration:', error);
        this.notificationService.error(
          'Update Failed',
          'Failed to save lottery configuration. Please try again.'
        );
      }
    });
  }

  syncCategoryPrizePools(): void {
    this.categories.forEach(category => {
      this.api.updateAdminCategory(category.id, { prize_pool: category.prize_pool }).subscribe({
        next: () => {
          console.log(`Updated ${category.name} prize pool to ${category.prize_pool}`);
        },
        error: (error) => {
          console.error(`Error updating ${category.name} prize pool:`, error);
        }
      });
    });
    
    this.notificationService.success(
      'Prize Pools Synced',
      'All category prize pools have been synchronized successfully.'
    );
  }

  createWeeklyDrawsForAllCategories(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(20, 0, 0, 0); // Set to 8 PM
    
    const drawPromises = this.categories.map(category => {
      const drawData = {
        category_id: category.id,
        name: `${category.display_name} Weekly Draw`,
        description: `Weekly lottery draw for ${category.display_name} members`,
        draw_date: nextWeek.toISOString().slice(0, 16),
        total_tickets: Math.floor(category.prize_pool / 10000), // Tickets based on prize pool
        prize_pool: category.prize_pool,
        status: 'upcoming'
      };
      
      return this.api.createAdminLotteryDraw(drawData).toPromise();
    });

    Promise.all(drawPromises).then(() => {
      this.loadLotteryDraws();
      this.notificationService.success(
        'Weekly Draws Created',
        `Created weekly draws for all ${this.categories.length} categories.`
      );
    }).catch((error) => {
      console.error('Error creating weekly draws:', error);
      this.notificationService.error(
        'Creation Failed',
        'Failed to create weekly draws. Some may have been created successfully.'
      );
    });
  }

  viewLotteryStatistics(): void {
    this.notificationService.info(
      'Lottery Statistics',
      `📊 System Overview:
      
      🏷️ Active Categories: ${this.categories.filter(c => c.is_active).length}
      🎲 Total Lottery Draws: ${this.lotteryDraws.length}
      🎯 Active Draws: ${this.lotteryDraws.filter(d => d.status === 'active').length}
      💰 Total Prize Pool: ${this.categories.reduce((sum, c) => sum + parseFloat(c.prize_pool || 0), 0).toLocaleString()} IQD
      
      Use the quick actions above to manage your lottery system efficiently.`,
      { persistent: true }
    );
  }

  updateLotterySettings(): void {
    this.updateLotteryConfiguration();
  }

  updateUISettings(): void {
    const formData = new FormData();
    
    // Add all settings as form data
    Object.keys(this.systemSettings).forEach(key => {
      formData.append(key, this.systemSettings[key as keyof typeof this.systemSettings].toString());
    });
    
    // Add logo file if selected
    if (this.selectedPlatformLogoFile) {
      formData.append('logo', this.selectedPlatformLogoFile);
    }

    this.api.updateSystemSettings(formData).subscribe({
      next: (response) => {
        // Update systemSettings with response
        this.systemSettings = { ...this.systemSettings, ...response };
        
        this.notificationService.success(
          'UI Settings Updated',
          'Theme colors, logo, and interface settings have been saved successfully.'
        );
        
        // Force apply the new settings immediately
        this.applyUISettings();
        this.applyPlatformSettings();
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
    // Remove previous dynamic styles
    const existingStyle = document.getElementById('dynamic-ui-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Apply color scheme through CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', this.systemSettings.primaryColor);
    root.style.setProperty('--secondary-color', this.systemSettings.secondaryColor);
    
    // Create comprehensive dynamic styles
    const style = document.createElement('style');
    style.id = 'dynamic-ui-styles';
    style.textContent = `
      :root {
        --primary-color: ${this.systemSettings.primaryColor};
        --secondary-color: ${this.systemSettings.secondaryColor};
      }
      
      /* Button styles */
      .btn-primary, 
      button[style*="background: #2563eb"],
      button[style*="background:#2563eb"] { 
        background-color: ${this.systemSettings.primaryColor} !important; 
      }
      
      /* Navigation active states */
      button[style*="background-color"][style*="#2563eb"] {
        background-color: ${this.systemSettings.primaryColor} !important;
      }
      
      /* Category-specific colors */
      .bg-iraqi-green { background-color: ${this.systemSettings.primaryColor} !important; }
      .bg-iraqi-red { background-color: ${this.systemSettings.secondaryColor} !important; }
      .text-iraqi-green { color: ${this.systemSettings.primaryColor} !important; }
      .text-iraqi-red { color: ${this.systemSettings.secondaryColor} !important; }
      
      /* Admin panel navigation */
      .admin-dashboard button[style*="background-color: #2563eb"] {
        background-color: ${this.systemSettings.primaryColor} !important;
      }
      
      /* Links and interactive elements */
      a, .link { color: ${this.systemSettings.primaryColor} !important; }
      
      /* Form focus states */
      input:focus, select:focus, textarea:focus {
        border-color: ${this.systemSettings.primaryColor} !important;
        outline-color: ${this.systemSettings.primaryColor} !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Update logo if available
    if (this.systemSettings.logoUrl) {
      const logoElements = document.querySelectorAll('.platform-logo img');
      logoElements.forEach(img => {
        (img as HTMLImageElement).src = this.getPlatformLogoUrl(this.systemSettings.logoUrl);
      });
    }
    
    console.log('UI Settings Applied:', {
      primaryColor: this.systemSettings.primaryColor,
      secondaryColor: this.systemSettings.secondaryColor
    });
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
      case 'categories':
        this.loadCategories();
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

  // Categories Management
  loadCategories(): void {
    this.api.getAdminCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error(
          'Failed to Load Categories',
          'Unable to fetch categories from the server. Please refresh the page.'
        );
      }
    });
  }

  showCreateCategoryForm(): void {
    this.editingCategory = null;
    this.categoryForm = {
      name: '',
      display_name: '',
      description: '',
      ticket_amount: 1,
      color: '#2563eb',
      icon: '🎟️',
      prize_pool: 0,
      is_active: true
    };
    this.selectedLogoFile = null;
    this.logoPreview = null;
    this.categoryModalTitle = 'Create New Category';
    this.showCategoryForm = true;
  }

  editCategory(category: any): void {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      display_name: category.display_name,
      description: category.description || '',
      ticket_amount: category.ticket_amount,
      color: category.color,
      icon: category.icon,
      prize_pool: category.prize_pool,
      is_active: category.is_active
    };
    this.selectedLogoFile = null;
    this.logoPreview = null;
    this.categoryModalTitle = 'Edit Category';
    this.showCategoryForm = true;
  }

  saveCategory(): void {
    // Frontend validation
    if (!this.categoryForm.name || !this.categoryForm.display_name || !this.categoryForm.ticket_amount) {
      this.notificationService.error(
        'Missing Required Fields',
        'Please fill in all required fields (Name, Display Name, Ticket Amount).'
      );
      return;
    }

    if (this.categoryForm.ticket_amount < 1) {
      this.notificationService.error(
        'Invalid Ticket Amount',
        'Ticket amount must be at least 1.'
      );
      return;
    }

    if (!this.categoryForm.color.match(/^#[0-9A-Fa-f]{6}$/)) {
      this.notificationService.error(
        'Invalid Color Format',
        'Color must be in hex format (e.g., #ff5722).'
      );
      return;
    }

    const formData = new FormData();
    
    // Add form fields
    formData.append('name', this.categoryForm.name.trim());
    formData.append('display_name', this.categoryForm.display_name.trim());
    formData.append('description', this.categoryForm.description || '');
    formData.append('ticket_amount', this.categoryForm.ticket_amount.toString());
    formData.append('color', this.categoryForm.color);
    formData.append('icon', this.categoryForm.icon);
    formData.append('prize_pool', this.categoryForm.prize_pool.toString());
    formData.append('is_active', this.categoryForm.is_active.toString());
    
    // Add logo file if selected
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }

    console.log('Sending category creation request with data:', {
      name: this.categoryForm.name,
      display_name: this.categoryForm.display_name,
      ticket_amount: this.categoryForm.ticket_amount,
      color: this.categoryForm.color,
      icon: this.categoryForm.icon,
      prize_pool: this.categoryForm.prize_pool,
      is_active: this.categoryForm.is_active,
      has_logo: !!this.selectedLogoFile
    });
    formData.append('color', this.categoryForm.color);
    formData.append('icon', this.categoryForm.icon);
    formData.append('prize_pool', this.categoryForm.prize_pool.toString());
    formData.append('is_active', this.categoryForm.is_active.toString());
    
    // Add logo file if selected
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }

    if (this.editingCategory) {
      // Update existing category
      this.api.updateAdminCategoryWithLogo(this.editingCategory.id, formData).subscribe({
        next: () => {
          this.loadCategories();
          this.showCategoryForm = false;
          this.notificationService.success(
            'Category Updated',
            `${this.categoryForm.display_name} has been updated successfully!`
          );
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.notificationService.error(
            'Update Failed',
            `Failed to update category. ${error.error?.message || 'Please check your data and try again.'}`
          );
        }
      });
    } else {
      // Create new category
      this.api.createAdminCategoryWithLogo(formData).subscribe({
        next: (response) => {
          console.log('Category created successfully:', response);
          this.loadCategories();
          this.showCategoryForm = false;
          this.notificationService.success(
            'Category Created',
            `${this.categoryForm.display_name} has been created successfully!`
          );
        },
        error: (error) => {
          console.error('Error creating category:', error);
          const errorMessage = error.error?.message || 'Failed to create category. Please check your data and try again.';
          const validationErrors = error.error?.errors;
          
          if (validationErrors) {
            const errorList = Object.values(validationErrors).flat().join(', ');
            this.notificationService.error(
              'Validation Failed',
              `Please fix the following errors: ${errorList}`
            );
          } else {
            this.notificationService.error(
              'Creation Failed',
              errorMessage
            );
          }
        }
      });
    }
  }

  deleteCategory(category: any): void {
    this.notificationService.warning(
      'Confirm Category Deletion',
      `Are you sure you want to delete "${category.display_name}"? This action cannot be undone and may affect existing products and tickets.`,
      {
        persistent: true,
        actions: [
          {
            label: 'Delete Category',
            action: () => this.confirmDeleteCategory(category),
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

  private confirmDeleteCategory(category: any): void {
    this.api.deleteAdminCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
        this.notificationService.success(
          'Category Deleted',
          `${category.display_name} has been deleted successfully.`
        );
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        const message = error.error?.message || 'Failed to delete category. Please try again.';
        this.notificationService.error('Deletion Failed', message);
      }
    });
  }

  // Logo upload handling methods
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogoFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getCategoryLogoUrl(logoUrl: string): string {
    if (!logoUrl) return '';
    if (logoUrl.startsWith('http')) return logoUrl;
    return this.api.getBaseUrl().replace('/api', '') + '/' + logoUrl;
  }

  getPlatformLogoUrl(logoUrl: string): string {
    if (!logoUrl) return '';
    if (logoUrl.startsWith('http')) return logoUrl;
    return this.api.getBaseUrl().replace('/api', '') + '/' + logoUrl;
  }

  // Platform logo upload handling
  onPlatformLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPlatformLogoFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.platformLogoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Lottery Draw Management
  showCreateLotteryDrawForm(): void {
    this.editingLotteryDraw = null;
    this.lotteryDrawForm = {
      category_id: '',
      name: '',
      description: '',
      draw_date: '',
      total_tickets: 1000,
      prize_pool: 1000000,
      status: 'upcoming'
    };
    this.showLotteryDrawForm = true;
  }

  editLotteryDraw(draw: any): void {
    this.editingLotteryDraw = draw;
    this.lotteryDrawForm = {
      category_id: draw.category_id,
      name: draw.name,
      description: draw.description,
      draw_date: draw.draw_date.slice(0, 16), // Format for datetime-local input
      total_tickets: draw.total_tickets,
      prize_pool: draw.prize_pool,
      status: draw.status
    };
    this.showLotteryDrawForm = true;
  }

  saveLotteryDraw(): void {
    if (!this.lotteryDrawForm.category_id || !this.lotteryDrawForm.name || !this.lotteryDrawForm.draw_date) {
      this.notificationService.error(
        'Missing Information',
        'Please fill in all required fields (Category, Name, Draw Date).'
      );
      return;
    }

    const drawData = { ...this.lotteryDrawForm };
    
    if (this.editingLotteryDraw) {
      // Update existing lottery draw
      this.api.updateAdminLotteryDraw(this.editingLotteryDraw.id, drawData).subscribe({
        next: () => {
          this.showLotteryDrawForm = false;
          this.loadLotteryDraws();
          this.notificationService.success(
            'Lottery Draw Updated',
            `${drawData.name} has been updated successfully.`
          );
        },
        error: (error) => {
          console.error('Error updating lottery draw:', error);
          this.notificationService.error(
            'Update Failed',
            'Failed to update lottery draw. Please try again.'
          );
        }
      });
    } else {
      // Create new lottery draw
      this.api.createAdminLotteryDraw(drawData).subscribe({
        next: () => {
          this.showLotteryDrawForm = false;
          this.loadLotteryDraws();
          this.notificationService.success(
            'Lottery Draw Created',
            `${drawData.name} has been created successfully!`
          );
        },
        error: (error) => {
          console.error('Error creating lottery draw:', error);
          this.notificationService.error(
            'Creation Failed',
            'Failed to create lottery draw. Please try again.'
          );
        }
      });
    }
  }

  cancelLotteryDrawForm(): void {
    this.showLotteryDrawForm = false;
    this.editingLotteryDraw = null;
  }

  deleteLotteryDraw(draw: any): void {
    this.notificationService.warning(
      'Confirm Delete',
      `Are you sure you want to delete "${draw.name}"? This action cannot be undone.`,
      {
        persistent: true,
        actions: [
          {
            label: '🗑️ Delete',
            action: () => this.confirmDeleteLotteryDraw(draw),
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

  private confirmDeleteLotteryDraw(draw: any): void {
    this.api.deleteAdminLotteryDraw(draw.id).subscribe({
      next: () => {
        this.loadLotteryDraws();
        this.notificationService.success(
          'Lottery Draw Deleted',
          `${draw.name} has been deleted successfully.`
        );
      },
      error: (error) => {
        console.error('Error deleting lottery draw:', error);
        this.notificationService.error(
          'Delete Failed',
          'Failed to delete lottery draw. Please try again.'
        );
      }
    });
  }

  // Test methods for debugging
  testBackendConnection(): void {
    console.log('Testing backend connection...');
    this.api.getAdminCategories().subscribe({
      next: (categories) => {
        console.log('Backend connection successful. Categories:', categories);
        this.notificationService.success(
          'Backend Connection Test',
          `Successfully connected! Found ${categories.length} categories.`
        );
      },
      error: (error) => {
        console.error('Backend connection failed:', error);
        this.notificationService.error(
          'Backend Connection Failed',
          `Error: ${error.status} - ${error.message}`
        );
      }
    });
  }

  testCategoryCreation(): void {
    console.log('Testing category creation with minimal data...');
    const testData = new FormData();
    testData.append('name', 'test_frontend_' + Date.now());
    testData.append('display_name', 'Frontend Test Category');
    testData.append('ticket_amount', '1');
    testData.append('color', '#ff5722');
    testData.append('icon', '🧪');
    testData.append('prize_pool', '1000000');
    testData.append('is_active', 'true');

    this.api.createAdminCategoryWithLogo(testData).subscribe({
      next: (response) => {
        console.log('Category creation test successful:', response);
        this.notificationService.success(
          'Category Creation Test',
          'Successfully created test category!'
        );
        this.loadCategories();
      },
      error: (error) => {
        console.error('Category creation test failed:', error);
        this.notificationService.error(
          'Category Creation Test Failed',
          `Error: ${error.status} - ${error.error?.message || error.message}`
        );
      }
    });
  }
}
