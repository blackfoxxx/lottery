import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class TicketsPage implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  paginatedTickets: any[] = [];
  loading = false;
  
  // Pagination properties (10 per page as requested)
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

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadTickets();
    }
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
  getActiveTicketsCount(): number {
    return this.tickets.filter(t => !t.is_used).length;
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  getGoldenTicketsCount(): number {
    return this.tickets.filter(t => t.category === 'golden').length;
  }

  getSilverTicketsCount(): number {
    return this.tickets.filter(t => t.category === 'silver').length;
  }

  getBronzeTicketsCount(): number {
    return this.tickets.filter(t => t.category === 'bronze').length;
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ar-IQ').format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshTickets(): void {
    this.loadTickets();
  }
}
