import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  paginatedTickets: any[] = [];
  categories: any[] = [];
  loading = false;
  
  // Pagination properties
  currentPage: number = 1;
  ticketsPerPage: number = 10;
  totalPages: number = 1;
  
  // Filter properties
  selectedCategory: string = 'all';
  searchTerm: string = '';
  showUsedTickets: boolean = true;

  constructor(
    private api: Api,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    if (this.authService.isAuthenticated()) {
      this.loadTickets();
    }
  }

  // Load categories from API
  loadCategories(): void {
    this.api.getCategories().subscribe({
      next: (categories) => {
        // Filter only active categories and sort by sort_order
        this.categories = categories
          .filter((cat: any) => cat.is_active)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  // Filter methods
  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      // Category filter
      if (this.selectedCategory !== 'all' && ticket.category !== this.selectedCategory) {
        return false;
      }
      
      // Used/unused filter
      if (!this.showUsedTickets && ticket.is_used) {
        return false;
      }
      
      // Search term filter
      if (this.searchTerm && !ticket.ticket_number.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Reset to first page when filters change
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTickets.length / this.ticketsPerPage);
    const startIndex = (this.currentPage - 1) * this.ticketsPerPage;
    const endIndex = startIndex + this.ticketsPerPage;
    this.paginatedTickets = this.filteredTickets.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfMax);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onUsedTicketsToggle(): void {
    this.applyFilters();
  }

  // Helper methods for template calculations
  getCategoryTicketsCount(categoryName: string): number {
    return this.tickets.filter(ticket => ticket.category === categoryName).length;
  }

  getActiveTicketsCount(): number {
    return this.tickets.filter(ticket => !ticket.is_used).length;
  }

  getTotalTicketsCount(): number {
    return this.tickets.length;
  }

  getUsedTicketsCount(): number {
    return this.tickets.filter(ticket => ticket.is_used).length;
  }

  // Legacy methods for backward compatibility
  getGoldenTicketsCount(): number {
    return this.getCategoryTicketsCount('golden');
  }

  getSilverTicketsCount(): number {
    return this.getCategoryTicketsCount('silver');
  }

  getBronzeTicketsCount(): number {
    return this.getCategoryTicketsCount('bronze');
  }

  getCategoryIcon(categoryName: string): string {
    const categoryObj = this.categories.find(cat => cat.name === categoryName);
    return categoryObj ? categoryObj.icon : '🎫';
  }

  getCategoryDisplayName(categoryName: string): string {
    const categoryObj = this.categories.find(cat => cat.name === categoryName);
    return categoryObj ? categoryObj.display_name : categoryName;
  }

  loadTickets(): void {
    this.loading = true;
    this.api.getTickets().subscribe({
      next: (tickets) => {
        console.log('Loaded tickets:', tickets);
        this.tickets = tickets;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading = false;
      }
    });
  }

  getRelatedProductInfo(ticket: any): string {
    if (!ticket.product) return 'Unknown Product';
    
    const productName = ticket.product.name;
    const productPrice = this.formatPrice(ticket.product.price);
    const ticketCategory = ticket.category;
    
    return `${productName} (${productPrice} IQD) - ${ticketCategory} category`;
  }

  getProductCategoryBadge(ticket: any): { text: string, color: string, background: string } {
    const category = ticket.category;
    const categoryObj = this.categories.find(cat => cat.name === category);
    
    if (categoryObj) {
      return { 
        text: `${categoryObj.icon} ${categoryObj.display_name} Product`, 
        color: categoryObj.color, 
        background: categoryObj.color + '20' // Add transparency
      };
    }
    
    return { text: '🎟️ Product', color: '#1f2937', background: '#f9fafb' };
  }

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

  getCategoryColor(category: string): string {
    const categoryObj = this.categories.find(cat => cat.name === category);
    return categoryObj ? categoryObj.color : '#3b82f6';
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  refreshTickets(): void {
    this.loadTickets();
  }
}
