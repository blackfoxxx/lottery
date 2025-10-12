import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class LoginPage implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  
  loading = false;
  showPassword = false;
  rememberMe = false;
  isProduction = false; // Set to true in production

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  async login(): Promise<void> {
    if (!this.loginData.email || !this.loginData.password) {
      this.notificationService.warning('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    this.loading = true;

    try {
      const response = await this.authService.login(this.loginData).toPromise();
      
      console.log('Login response:', response);
      
      this.notificationService.success(
        'تم تسجيل الدخول بنجاح',
        `مرحباً ${response.user?.name || 'بك'}`
      );
      
      // Navigate to home page
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'فشل في تسجيل الدخول';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.notificationService.error('خطأ في تسجيل الدخول', errorMessage);
    } finally {
      this.loading = false;
    }
  }

  quickLogin(): void {
    // For testing purposes - pre-fill with test credentials
    this.loginData.email = 'test@example.com';
    this.loginData.password = 'password';
    this.login();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
