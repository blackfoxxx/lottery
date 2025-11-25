# Belkhair E-Commerce Platform - Authentication Guide

## 📋 Table of Contents
- [Sign In & Sign Up](#sign-in--sign-up)
- [Admin Access](#admin-access)
- [User Access](#user-access)
- [Demo Credentials](#demo-credentials)
- [Authentication Flow](#authentication-flow)

---

## 🔐 Sign In & Sign Up

### Sign In Page
**URL:** `/signin`
**Full URL:** `https://3000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/signin`

The sign in page provides:
- Email and password authentication
- Password visibility toggle
- Demo credentials display
- Link to sign up page
- Automatic redirection based on user role

### Sign Up Page
**URL:** `/signup`
**Full URL:** `https://3000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/signup`

The sign up page allows new users to create accounts with:
- Full name
- Email address
- Phone number (optional)
- Password with confirmation
- Link to sign in page

---

## 👨‍💼 Admin Access

### Admin Dashboard
**URL:** `/admin`
**Full URL:** `https://3000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/admin`

### Admin Credentials
```
Email: admin@belkhair.com
Password: admin123
```

### Admin Features & Routes

#### Dashboard & Analytics
- `/admin` - Main admin dashboard with overview statistics
- `/admin/analytics` - Comprehensive analytics and reports

#### Product Management
- `/admin/products` - Product listing and management
- `/admin/product-management` - Advanced product CRUD operations
- `/admin/product-categories` - Category management
- `/admin/inventory` - Stock and inventory tracking

#### Order Management
- `/admin/orders` - Order listing
- `/admin/order-management` - Advanced order processing
- `/admin/orders-management` - Order fulfillment

#### Lottery System
- `/admin/lottery-tickets` - Lottery ticket management
- `/admin/lottery-draws` - Lottery draw management
- `/admin/lottery-categories` - Lottery category settings
- `/admin/lottery-management` - Basic lottery operations
- `/admin/complete-lottery` - Complete lottery management with draw creation and winner selection

#### Customer Management
- `/admin/customers` - Customer listing and management
- `/admin/reviews` - Product review moderation
- `/admin/disputes` - Dispute resolution
- `/admin/fraud-review` - Fraud detection and review

#### Marketing & Promotions
- `/admin/promotions` - Promotional campaigns
- `/admin/banners` - Homepage banner management
- `/admin/gift-cards` - Gift card management
- `/admin/bundles` - Product bundle creation

#### System Settings
- `/admin/system-settings` - Complete system configuration (colors, typography, layout, content, email, notifications)
- `/admin/ui-settings` - UI customization
- `/admin/environment` - Environment variables
- `/admin/system` - System status and health
- `/admin/notifications` - Notification settings
- `/admin/payments` - Payment gateway configuration

---

## 👤 User Access

### User Profile
**URL:** `/profile`
**Full URL:** `https://3000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer/profile`

### Customer Credentials
```
Email: customer@belkhair.com
Password: customer123
```

### User Features
- **Profile Tab:** View and edit personal information
- **Orders Tab:** Complete order history with tracking
- **Tickets Tab:** View all lottery tickets earned from purchases
- **Settings Tab:** Notification preferences and account settings
- **Security Tab:** Password change and two-factor authentication

---

## 🔑 Demo Credentials

### Administrator Account
```
Email: admin@belkhair.com
Password: admin123
Role: admin
Access: Full system access including all admin routes
```

### Customer Account
```
Email: customer@belkhair.com
Password: customer123
Role: customer
Access: Shopping, profile, orders, lottery tickets
```

### Additional Test Users
The database contains 5 test users (IDs 1-5) with the following pattern:
```
Email: user{id}@example.com
Password: password123
Role: customer
```

---

## 🔄 Authentication Flow

### Sign In Process
1. Navigate to `/signin`
2. Enter email and password
3. Click "Sign In" button
4. System validates credentials via Laravel API (`/api/v1/auth/login`)
5. On success:
   - Auth token stored in localStorage
   - User data stored in localStorage
   - Admin users redirected to `/admin`
   - Customer users redirected to `/profile`
6. On failure: Error toast displayed

### Sign Up Process
1. Navigate to `/signup`
2. Fill in registration form (name, email, phone, password)
3. Confirm password matches
4. Click "Sign Up" button
5. System creates account via Laravel API (`/api/v1/auth/register`)
6. On success: Redirected to `/signin` to log in
7. On failure: Error toast displayed

### Protected Routes
- All `/admin/*` routes require admin role
- `/profile` route requires authentication
- Unauthenticated users should be redirected to `/signin`

---

## 🛠️ Technical Details

### Backend API Endpoints
- **POST** `/api/v1/auth/login` - User authentication
- **POST** `/api/v1/auth/register` - User registration
- **POST** `/api/v1/auth/logout` - User logout
- **GET** `/api/v1/auth/user` - Get authenticated user

### Frontend Storage
- `localStorage.auth_token` - JWT authentication token
- `localStorage.user` - Serialized user object with role information

### Laravel Backend
- **Host:** `localhost:8000`
- **API Base:** `http://localhost:8000/api/v1`
- **Authentication:** Laravel Sanctum
- **Database:** MySQL (belkhair database)

---

## 📝 Notes

1. **First Time Setup:** The demo credentials are pre-seeded in the database and ready to use immediately

2. **Admin Access:** After signing in as admin, you have full control over:
   - All products, orders, and customers
   - Lottery system configuration
   - System-wide settings and customization
   - Email and notification templates

3. **Customer Access:** Regular users can:
   - Browse and purchase products
   - Earn lottery tickets automatically
   - Track orders and view lottery tickets
   - Manage account settings

4. **Security:** In production, ensure to:
   - Change default admin credentials
   - Enable HTTPS
   - Configure proper CORS settings
   - Implement rate limiting
   - Enable two-factor authentication

---

## 🚀 Quick Start

### For Administrators:
1. Go to `/signin`
2. Use `admin@belkhair.com` / `admin123`
3. Access admin dashboard at `/admin`
4. Start managing your e-commerce platform!

### For Customers:
1. Go to `/signup` to create an account
2. Or use demo: `customer@belkhair.com` / `customer123`
3. Browse products at `/products`
4. Start shopping and earning lottery tickets!

---

**Last Updated:** November 25, 2025
**Version:** 1.0.0
