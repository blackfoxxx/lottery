import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class AuthComponent {
  showLogin = true;
  loading = false;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  toggleForm(): void {
    this.showLogin = !this.showLogin;
    this.clearForms();
  }

  login(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.notificationService.validationError('Please fill in all required fields');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        const user = response.user || { name: 'User' };
        this.notificationService.loginSuccess(user.name);
        this.clearForms();
        this.loading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.notificationService.loginError();
        this.loading = false;
      }
    });
  }

  register(): void {
    if (!this.registerData.name || !this.registerData.email || 
        !this.registerData.password || !this.registerData.password_confirmation) {
      this.notificationService.validationError('Please fill in all required fields');
      return;
    }

    if (this.registerData.password !== this.registerData.password_confirmation) {
      this.notificationService.validationError('Passwords do not match');
      return;
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        const user = response.user || { name: this.registerData.name };
        this.notificationService.success(
          'Registration Successful!',
          `Welcome ${user.name}! Your account has been created and you're now logged in. Start shopping to earn FREE lottery tickets!`,
          {
            duration: 8000,
            actions: [
              {
                label: 'Start Shopping',
                action: () => {
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                },
                primary: true
              }
            ]
          }
        );
        this.clearForms();
        this.loading = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        let message = 'Registration failed. Please try again.';
        if (error.error?.errors?.email) {
          message = 'This email address is already registered. Please use a different email or try logging in.';
        } else if (error.error?.errors?.password) {
          message = 'Password must be at least 8 characters long.';
        }
        this.notificationService.error('Registration Failed', message);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.success(
      'Logged out successfully!',
      'Thank you for using our platform'
    );
  }

  quickLogin(): void {
    this.loginData = {
      email: 'test@example.com',
      password: 'password'
    };
    this.login();
  }

  quickAdminLogin(): void {
    this.loginData = {
      email: 'admin@test.com',
      password: 'password'
    };
    this.login();
  }

  private clearForms(): void {
    this.loginData = { email: '', password: '' };
    this.registerData = { name: '', email: '', password: '', password_confirmation: '' };
  }
}
