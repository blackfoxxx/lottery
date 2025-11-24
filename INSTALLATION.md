# Belkhair E-Commerce Platform - Installation Guide

Complete installation guide for setting up the Belkhair E-Commerce Platform with lottery integration.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Manual Installation](#manual-installation)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Mobile App Setup](#mobile-app-setup)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Frontend (React)
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **RAM**: Minimum 4GB
- **Disk Space**: 500MB free space

### Backend (Laravel)
- **PHP**: 8.1 or higher
- **Composer**: 2.x
- **MySQL**: 8.0 or higher (or MariaDB 10.3+)
- **RAM**: Minimum 2GB
- **Disk Space**: 1GB free space

### Mobile App (React Native)
- **Node.js**: 18.x or higher
- **Expo CLI**: Latest version
- **Android Studio** (for Android) or **Xcode** (for iOS)

---

## Quick Installation

### Using the Installation Script

```bash
# Clone the repository
git clone https://github.com/blackfoxxx/lottery.git
cd lottery

# Run the installation script
chmod +x install.sh
./install.sh
```

The script will:
1. Check system requirements
2. Install dependencies
3. Create environment configuration
4. Build the frontend
5. Provide next steps

---

## Manual Installation

### Frontend Setup

#### 1. Install Dependencies

```bash
cd client
npm install
```

#### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Application
VITE_APP_TITLE=Belkhair E-Commerce Platform
VITE_APP_LOGO=/logo.png

# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_LOTTERY=true
VITE_ENABLE_GIFT_CARDS=true
VITE_ENABLE_BUNDLES=true
VITE_ENABLE_SOCIAL_PROOF=true
```

#### 3. Start Development Server

```bash
npm run dev
```

Access the application at `http://localhost:3000`

#### 4. Build for Production

```bash
npm run build
```

The production build will be in `client/dist/`

---

## Backend Setup (Laravel)

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belkhair
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Database Migrations

```bash
php artisan migrate
```

### 5. Seed Database (Optional)

```bash
php artisan db:seed
```

### 6. Start Development Server

```bash
php artisan serve
```

Backend API will be available at `http://localhost:8000`

---

## Mobile App Setup

### 1. Install Dependencies

```bash
cd NewMobile
npm install
```

### 2. Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
```

### 3. Start Development Server

```bash
npx expo start
```

### 4. Run on Device/Emulator

- **iOS**: Press `i` to open iOS simulator
- **Android**: Press `a` to open Android emulator
- **Physical Device**: Scan QR code with Expo Go app

---

## Configuration

### Admin Dashboard Configuration

1. **Access Admin Dashboard**
   - Navigate to `http://localhost:3000/admin`
   - Default credentials (if seeded):
     - Email: `admin@belkhair.com`
     - Password: `admin123`

2. **Environment Settings**
   - Go to Admin > System > Environment Settings
   - Configure the following:

#### Payment Gateway
```
Stripe Public Key: pk_test_...
Stripe Secret Key: sk_test_...
PayPal Client ID: ...
```

#### Email Service
```
SendGrid API Key: SG...
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: your-email@gmail.com
SMTP Password: your-app-password
```

#### SMS Service
```
Twilio Account SID: AC...
Twilio Auth Token: ...
Twilio Phone Number: +1...
```

#### Cloud Storage
```
AWS S3 Bucket: belkhair-uploads
AWS Region: us-east-1
AWS Access Key: AKIA...
AWS Secret Key: ...
```

3. **Test Connections**
   - Click "Test Connection" for each service
   - Verify all services are working

### Feature Configuration

#### Lottery System
- Configure draw schedules in Admin > Lottery
- Set ticket prices and prize amounts
- Enable/disable lottery feature

#### Gift Cards
- Set available denominations
- Configure expiration periods
- Enable email delivery

#### Product Bundles
- Create bundle combinations
- Set discount percentages
- Configure bundle rules

---

## Deployment

### Frontend Deployment

#### Using Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel
```

#### Using Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd client
npm run build
netlify deploy --prod --dir=dist
```

### Backend Deployment

#### Using Laravel Forge
1. Connect your server to Forge
2. Deploy repository
3. Configure environment variables
4. Run migrations

#### Manual Deployment
```bash
# On your server
git clone https://github.com/blackfoxxx/lottery.git
cd lottery/backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

#### Database Connection Failed

**Problem**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**:
1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check database credentials in `.env`
3. Ensure database exists: `mysql -u root -p -e "CREATE DATABASE belkhair;"`

#### Module Not Found

**Problem**: `Error: Cannot find module '@/components/...'`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails

**Problem**: `Build failed with errors`

**Solution**:
```bash
# Clear build cache
rm -rf client/dist client/.vite

# Rebuild
cd client
npm run build
```

### Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our Discord server
- **Email**: support@belkhair.com

---

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Update `JWT_SECRET` and `SESSION_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure backup automation
- [ ] Set up monitoring and alerts
- [ ] Review and update `.env` file
- [ ] Enable two-factor authentication for admin
- [ ] Configure Content Security Policy
- [ ] Set up database backups

---

## Performance Optimization

### Frontend
- Enable production build optimizations
- Configure CDN for static assets
- Enable gzip compression
- Implement lazy loading
- Use image optimization

### Backend
- Enable OPcache
- Configure Redis for caching
- Optimize database queries
- Use queue workers for background jobs
- Enable database indexing

---

## Maintenance

### Regular Tasks

**Daily**:
- Monitor error logs
- Check system health
- Review backup status

**Weekly**:
- Update dependencies
- Review security alerts
- Analyze performance metrics

**Monthly**:
- Database optimization
- Clear old logs
- Review and update documentation

---

## Additional Resources

- **API Documentation**: `/docs/api.md`
- **Database Schema**: `/docs/database.md`
- **Component Library**: `/docs/components.md`
- **Admin Guide**: `/docs/admin-guide.md`
- **User Guide**: `/docs/user-guide.md`

---

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Email: support@belkhair.com
- GitHub Issues: https://github.com/blackfoxxx/lottery/issues
- Documentation: https://docs.belkhair.com

---

**Last Updated**: December 2024  
**Version**: 1.0.0
