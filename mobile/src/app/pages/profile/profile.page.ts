import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  goToPurchaseHistory() {
    // Navigate to purchase history page - to be created
    this.router.navigate(['/purchase-history']);
  }

  goToEditProfile() {
    // Navigate to edit profile page - to be created
    this.router.navigate(['/edit-profile']);
  }

  goToSettings() {
    // Navigate to settings page - to be created
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
