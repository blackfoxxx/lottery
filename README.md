# 🛒🎰 Iraqi E-commerce and Lottery Platform (Enhanced v3.3)

A comprehensive full-stack e-commerce platform with **automatic FREE lottery system**, specifically designed for the Iraqi market. Built with modern web technologies, global lottery standards, and professional notification system.

## 🎯 Latest Updates (v3.3)

### ✅ Recent Fixes (January 2025)
- **Lottery Draw System**: Fixed API endpoint consistency, added prize categorization, resolved database schema issues
- **Admin Dashboard**: Fixed login authentication with correct API configuration and credentials
- **Notification System**: Implemented proper plain-text notifications with improved UX
- **Database Schema**: Added `prize_id` to lottery_draws and `category` field to prizes tables
- **Status Management**: Corrected lottery draw status flow (active → completed)

### 🎨 UI/UX Enhancements
- Consistent header gradient and improved contrast for better readability
- Accessible buttons with focus-visible outlines and disabled states
- Product cards now have subtle hover elevation and improved spacing
- Cleaned product list by hiding developer debug panel (enable via [showDebug]="true")
- Standardized Buy button styling using shared .btn-primary class

## ✨ Features

### 🛍️ E-commerce Platform
- 📦 Database-driven product catalog with categories and search
- 🛒 Streamlined purchase system with automatic order completion
- 📋 Comprehensive order management and tracking
- 👤 User authentication and profile management
- 💳 Secure payment processing (ready for Iraqi payment gateways)
- 📊 Real-time inventory management and analytics

### 🎁 Automatic FREE Lottery System
- 🎟️ **FREE lottery tickets automatically generated with every product purchase**
- 🌍 **Global lottery standards compliance** (ISO 8601, Luhn algorithm)
- 🔢 **Professional ticket numbering**: `GLT-20251006-ABC123-7`
- 🎲 Daily lottery draws with automated scheduling
- 🏆 Prize management and distribution system
- 🎯 Advanced random winner selection algorithm
- 📈 Comprehensive lottery history and statistics
- 🔐 Enhanced security with verification codes and expiry dates

### 🔔 Professional Notification System
- 📱 **Modern pop-up notifications** (no JavaScript alerts)
- ✨ **Smart notifications** with auto-dismiss and actions
- 🎨 **Professional UI/UX** with smooth animations
- 🌍 **RTL Arabic support** for Iraqi market
- 📊 **Contextual feedback** for all user actions

### 🛠️ Comprehensive Admin Dashboard
- 📊 Real-time dashboard with detailed analytics
- 🏷️ Full CRUD operations for products and categories
- 📦 Advanced order processing and fulfillment
- 🎰 Complete lottery administration and draw management
- 👥 User management with role-based access control
- 📈 Detailed reports and business insights
- 🔐 Protected admin routes with middleware authentication
- 🎫 Advanced ticket statistics and batch tracking

## 🚀 Tech Stack

### Backend
- **Framework**: Laravel 11 (PHP 8.2+)
- **Database**: MySQL 8.0+ / SQLite (development)
- **Authentication**: Laravel Sanctum
- **API**: RESTful API with comprehensive endpoints
- **Cache**: Redis for sessions and caching
- **Queue**: Redis for background job processing

### Frontend
- **Framework**: Angular 18 with TypeScript
- **Styling**: Tailwind CSS for modern UI
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **State Management**: RxJS for reactive programming

### Mobile App
- **Framework**: Ionic 7 with Angular
- **Native Features**: Capacitor for device integration
- **Platforms**: iOS and Android support
- **Push Notifications**: Firebase Cloud Messaging

### DevOps & Deployment
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions workflow
- **Web Server**: Nginx (frontend) + Apache (backend)
- **Database**: MySQL 8.0 with Redis caching

## 📁 Project Structure

```
iraqi-ecommerce-lottery/
├── 📂 backend/              # Laravel API server
│   ├── app/                 # Application logic
│   ├── database/            # Migrations and seeders
│   ├── routes/              # API routes
│   └── docker/              # Docker configuration
├── 📂 frontend/             # Angular web application
│   ├── src/                 # Source code
│   ├── dist/                # Built files
│   └── nginx.conf           # Nginx configuration
├── 📂 mobile/               # Ionic mobile app
│   ├── src/                 # Mobile app source
│   └── capacitor.config.ts  # Mobile configuration
├── 📂 .github/              # CI/CD workflows
├── 🐳 docker-compose.yml    # Multi-service setup
├── 🚀 deploy.sh             # Production deployment script
├── 🛠️ setup-dev.sh          # Development setup script
├── 📖 DEPLOYMENT_GUIDE.md   # Comprehensive deployment guide
└── 📋 DEPLOYMENT.md         # Quick deployment reference
```

## ⚡ Quick Start

### 🔧 Development Setup (Automated)
```bash
# Clone the repository
git clone <repository-url>
cd iraqi-ecommerce-lottery

# Run the development setup script
./setup-dev.sh

# Start development servers
# Terminal 1: Backend
cd backend && php artisan serve

# Terminal 2: Frontend  
cd frontend && npm start

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
```

### 🐳 Production Deployment (Docker)
```bash
# Quick deployment with Docker
./deploy.sh

# Or manual Docker setup
docker-compose up -d --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000
```

## 🛠️ Manual Installation

### Prerequisites
- **PHP**: 8.2+ with extensions (mbstring, bcmath, gd, pdo_mysql)
- **Composer**: Latest version
- **Node.js**: 18+ and npm
- **Database**: MySQL 8.0+ or MariaDB 10.3+
- **Cache**: Redis (recommended for production)

### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Generate application key
php artisan key:generate

# Database setup
php artisan migrate --seed

# Build assets
npm install && npm run build

# Start development server
php artisan serve
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build
```

### Mobile App Setup
```bash
cd mobile

# Install dependencies
npm install

# Development server
ionic serve

# Build for platforms
ionic capacitor build android
ionic capacitor build ios
```

### Mobile: About (Version Info)
- The mobile app includes an About page to view the current app version and build.
- Access it from the Home footer link “حول التطبيق” or navigate to /about within the Ionic app.
- The page supports RTL Arabic and provides a one-tap copy of the version for support.

## 🔑 Admin Access

**Default Admin Credentials**:
- Email: `admin@test.com`
- Password: `password`

**Quick Login**: Use the "Quick Admin Login" button on the auth page for instant access.

## 🚀 Deployment Status

✅ **Local Development**: Running successfully
- Backend: http://localhost:8001/api
- Frontend: http://localhost:4200
- Mobile: http://localhost:8100

✅ **Production Ready**: Docker configuration complete
- Multi-container setup with MySQL, Redis
- Automated deployment scripts
- CI/CD pipeline configured

✅ **System Status**: All components tested and operational
- ✅ User authentication and authorization
- ✅ Product catalog and e-commerce features
- ✅ Lottery draw system with prize distribution
- ✅ Admin dashboard with full management capabilities
- ✅ Notification system with proper content display

## 📚 Documentation

- 📖 [Deployment Guide](DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- 🚀 [Quick Deployment](DEPLOYMENT.md) - Quick reference for deployment
- 🔧 [API Documentation](docs/api.md) - REST API endpoints
- 📱 [Mobile Setup](mobile/README.md) - Mobile app configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software developed for the Iraqi market.

---

## 🆘 Support

For deployment support or technical issues:
- 📖 Check the [Deployment Guide](DEPLOYMENT_GUIDE.md)
- 🔍 Review application logs
- 📧 Contact the development team

**🎉 Your Iraqi E-commerce & Lottery Platform is now deployed and ready!**
