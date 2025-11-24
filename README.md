# 🎰 Belkhair E-Commerce Platform

> A modern, full-featured e-commerce platform with integrated lottery system, gift cards, product bundles, and comprehensive admin dashboard.

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PHP](https://img.shields.io/badge/php-%3E%3D8.1-purple.svg)](https://php.net/)
[![React](https://img.shields.io/badge/react-19.0-blue.svg)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/laravel-10.x-red.svg)](https://laravel.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Docker Setup](#-docker-setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ E-Commerce Core
- **Product Management**: Complete CRUD operations with categories, variants, and inventory tracking
- **Shopping Cart**: Persistent cart with real-time updates and quantity management
- **Checkout System**: Multi-step checkout with address validation and order confirmation
- **Order Tracking**: Real-time order status updates and tracking history
- **Payment Integration**: Stripe and PayPal support with secure payment processing
- **Wishlist**: Save products for later with easy cart conversion
- **Product Comparison**: Side-by-side product comparison tool
- **Reviews & Ratings**: Customer reviews with star ratings and verification badges

### 🎲 Lottery System
- **Golden Draw**: Integrated lottery system with countdown timers
- **Ticket Purchase**: Buy lottery tickets with every product purchase
- **My Tickets**: View all purchased tickets with status tracking
- **Draw Results**: Automatic winner selection and prize distribution
- **Ticket Validation**: Check winning tickets against draw results
- **Prize Management**: Configurable prize amounts and draw schedules

### 🎁 Gift Cards
- **Purchase Gift Cards**: Buy digital gift cards with custom amounts
- **Email Delivery**: Automatic email delivery with personalized messages
- **Balance Checker**: Real-time gift card balance verification
- **Redemption**: Easy redemption at checkout with code validation
- **Admin Management**: Create, activate, and deactivate gift cards

### 📦 Product Bundles
- **Bundle Creation**: Group products together with automatic discounts
- **Savings Calculator**: Show total savings on bundle purchases
- **Frequently Bought Together**: AI-powered product recommendations
- **Bulk Add to Cart**: Add all bundle items with one click

### 📊 Admin Dashboard
- **Analytics**: Real-time sales, revenue, and customer analytics
- **Product Management**: Add, edit, and manage products and categories
- **Order Management**: Process orders, update status, handle refunds
- **Customer Management**: View customer profiles and purchase history
- **Inventory Tracking**: Stock management with low-stock alerts
- **Payment Disputes**: Handle payment disputes and chargebacks
- **Promotions**: Create and manage discount codes and promotions
- **Reviews Moderation**: Approve, reject, or respond to customer reviews
- **Environment Settings**: Configure API keys and service credentials
- **System Management**: Webhooks, backups, audit logs, health monitoring

### 🔔 Notifications
- **Push Notifications**: Real-time notifications for mobile app (React Native)
- **Email Notifications**: Order confirmations, shipping updates, promotions
- **SMS Notifications**: Order status updates via Twilio integration
- **Alert System**: Service failure alerts and monitoring

### 🌐 Multi-Platform
- **Web Application**: Responsive React frontend with modern UI
- **Mobile App**: React Native app for iOS and Android
- **Admin Panel**: Comprehensive admin dashboard
- **REST API**: Laravel backend with complete API documentation

### 🔒 Security & Performance
- **Authentication**: JWT-based authentication with OAuth support
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Encrypted sensitive data storage
- **CORS Protection**: Configurable CORS policies
- **Performance Optimization**: Caching, lazy loading, code splitting
- **Backup Automation**: Scheduled database backups with retention policies
- **Health Monitoring**: Real-time service health checks

### 🎨 Social Proof
- **Live Activity**: "X people viewing this product" badges
- **Recent Purchases**: "Recently purchased" notifications
- **Stock Urgency**: "Only X left in stock" indicators
- **Trending Products**: Popular and trending product badges

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Build Tool**: Vite
- **Icons**: Lucide React

### Backend
- **Framework**: Laravel 10.x
- **Language**: PHP 8.1+
- **Database**: MySQL 8.0 / MariaDB 10.3+
- **Authentication**: Laravel Sanctum + JWT
- **Queue**: Laravel Queue (Database/Redis)
- **Cache**: Redis / File
- **Storage**: AWS S3 / Local

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **UI**: React Native Paper
- **Icons**: Ionicons
- **State**: Context API

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (optional)
- **Deployment**: Vercel (Frontend), Laravel Forge (Backend)
- **Monitoring**: Custom health monitoring dashboard

### Third-Party Services
- **Payments**: Stripe, PayPal
- **Email**: SendGrid, SMTP
- **SMS**: Twilio
- **Storage**: AWS S3
- **Analytics**: Custom analytics system

---

## 📸 Screenshots

### Web Application

**Homepage with Lottery Banner**
![Homepage](docs/screenshots/homepage.png)

**Product Listing**
![Products](docs/screenshots/products.png)

**Admin Dashboard**
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

**Environment Settings**
![Environment Settings](docs/screenshots/environment-settings.png)

### Mobile Application

**Home Screen**
![Mobile Home](docs/screenshots/mobile-home.png)

**Lottery Purchase**
![Lottery Purchase](docs/screenshots/mobile-lottery.png)

**My Tickets**
![My Tickets](docs/screenshots/mobile-tickets.png)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PHP 8.1+ and Composer
- MySQL 8.0+
- Git

### Installation (Automated)

```bash
# Clone the repository
git clone https://github.com/blackfoxxx/lottery.git
cd lottery

# Run installation script
chmod +x install.sh
./install.sh

# Start development server
cd client
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 📦 Installation

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Mobile App Setup

```bash
cd NewMobile
npm install
npx expo start
```

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

---

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

For detailed Docker setup, see [DOCKER.md](DOCKER.md).

---

## 📚 API Documentation

Interactive API documentation is available at:

- **Swagger UI**: http://localhost:8000/api/documentation
- **OpenAPI Spec**: http://localhost:8000/api/documentation.json

### Key Endpoints

#### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/user
```

#### Products
```
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

#### Lottery
```
GET    /api/v1/lottery/draws
POST   /api/v1/lottery/purchase
GET    /api/v1/lottery/my-tickets
GET    /api/v1/lottery/results
```

For complete API documentation, see [API.md](docs/API.md).

---

## 📁 Project Structure

```
lottery/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── package.json
├── backend/               # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── composer.json
├── NewMobile/             # React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── contexts/
│   └── package.json
├── docs/                  # Documentation
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── screenshots/
├── docker/                # Docker configuration
│   ├── frontend/
│   ├── backend/
│   └── nginx/
├── install.sh             # Installation script
├── docker-compose.yml     # Docker Compose config
├── INSTALLATION.md        # Installation guide
├── BACKEND_INSTALLATION.md
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: PSR-12 coding standard
- **Commits**: Conventional Commits

---

## 📄 License

This project is proprietary software. All rights reserved.

Copyright © 2024 Belkhair E-Commerce Platform

---

## 👥 Team

- **Developer**: Belkhair Development Team
- **Repository**: [github.com/blackfoxxx/lottery](https://github.com/blackfoxxx/lottery)

---

## 📞 Support

- **Email**: support@belkhair.com
- **Documentation**: [docs.belkhair.com](https://docs.belkhair.com)
- **Issues**: [GitHub Issues](https://github.com/blackfoxxx/lottery/issues)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Laravel](https://laravel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Expo](https://expo.dev/)

---

**Made with ❤️ by the Belkhair Team**
