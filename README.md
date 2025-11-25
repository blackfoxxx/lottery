# Belkhair E-Commerce Platform - Laravel Backend API

A comprehensive RESTful API backend for the Belkhair E-Commerce Platform, built with Laravel 11 and JWT authentication.

## 🌟 Features

- **JWT Authentication** - Secure token-based authentication
- **Products API** - Complete product management
- **Orders API** - Order processing and tracking
- **Lottery System** - Lottery draws and ticket management
- **Payment Processing** - Payment methods and transactions
- **Address Management** - Shipping and billing addresses
- **Gift Cards** - Gift card purchase and redemption
- **Product Bundles** - Bundle management

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- Composer
- MySQL 8.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone -b backend https://github.com/blackfoxxx/lottery.git belkhair-backend
   cd belkhair-backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure database**
   
   Update `.env` file with your database credentials

4. **Run migrations**
   ```bash
   php artisan migrate
   ```

5. **Start server**
   ```bash
   php artisan serve
   ```

   API available at `http://localhost:8000/api/v1`

## 📁 Structure

- **Models**: `app/Models/` - Eloquent models
- **Controllers**: `app/Http/Controllers/Api/` - API controllers
- **Migrations**: `database/migrations/` - Database schema
- **Routes**: `routes/api.php` - API endpoints

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get user

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

### Orders, Lottery, Payments, Addresses
- Full CRUD operations for all resources

## 🔐 Authentication

JWT token-based authentication. Include token in Authorization header:

```
Authorization: Bearer {token}
```

## 📄 License

MIT License

---

**Made with ❤️ by the Belkhair Team**
