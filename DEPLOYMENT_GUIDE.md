# 🚀 Iraqi E-commerce & Lottery Platform - Deployment Guide

This guide provides multiple deployment options for the Iraqi E-commerce and Lottery Platform.

## 📋 Prerequisites

### For Docker Deployment (Recommended)
- Docker and Docker Compose installed
- At least 4GB RAM
- 10GB free disk space

### For Manual Deployment
- PHP 8.2+ with extensions: pdo_mysql, mbstring, bcmath, gd
- Composer
- Node.js 18+ and npm
- MySQL 8.0+ or MariaDB 10.3+
- Web server (Apache/Nginx)

## 🐳 Option 1: Docker Deployment (Recommended)

### Quick Start
```bash
# Clone and enter the project directory
cd iraqi-ecommerce-lottery

# Run the deployment script
./deploy.sh
```

### Manual Docker Setup
```bash
# Build and start all services
docker-compose up -d --build

# Wait for services to start, then setup database
docker-compose exec backend php artisan migrate --force --seed

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000
```

### Docker Services
- **Frontend**: Angular app served by Nginx (Port 80)
- **Backend**: Laravel API with Apache (Port 8000)
- **Database**: MySQL 8.0 (Port 3306)
- **Cache**: Redis (Port 6379)

## 🔧 Option 2: Manual Deployment

### Backend Setup
```bash
cd backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate key and setup database
php artisan key:generate
php artisan migrate --seed

# Build assets
npm install
npm run build

# Start server (development)
php artisan serve --host=0.0.0.0 --port=8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in dist/iraqi-lottery-frontend/
# Deploy these files to your web server
```

### Production Web Server Setup

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist/iraqi-lottery-frontend;
    index index.html;

    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Laravel backend
    location /api {
        proxy_pass http://your-backend-server:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Apache Configuration (Laravel Backend)
```apache
<VirtualHost *:8000>
    DocumentRoot /path/to/backend/public
    
    <Directory /path/to/backend/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## ☁️ Option 3: Cloud Deployment

### AWS Deployment
1. **Frontend**: Deploy to S3 + CloudFront
2. **Backend**: Deploy to EC2 or Elastic Beanstalk
3. **Database**: Use RDS MySQL
4. **Cache**: Use ElastiCache Redis

### DigitalOcean Deployment
1. Create a Droplet (Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Clone repository and run `./deploy.sh`

### Heroku Deployment
```bash
# Frontend (Static site)
cd frontend
npm run build
# Deploy dist/ folder to Netlify/Vercel

# Backend
cd backend
# Add Heroku PostgreSQL addon
# Deploy using git push heroku main
```

## 🔒 Production Considerations

### Security Checklist
- [ ] Change default database passwords
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Enable Laravel's rate limiting
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging

### Environment Variables (Backend)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=iraqi_ecommerce
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=your-redis-host
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Check Docker services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database backup
docker-compose exec mysql mysqldump -u laravel -p iraqi_ecommerce > backup.sql
```

### Performance Optimization
```bash
# Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Database optimization
php artisan queue:work --daemon
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if MySQL is running
docker-compose exec mysql mysql -u laravel -p

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed
```

**Frontend Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Docker Issues**
```bash
# Clean Docker system
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

## 📱 Mobile App Deployment

The mobile app is built with Ionic and can be deployed to:

### Android
```bash
cd mobile
npm install
ionic capacitor add android
ionic capacitor build android
```

### iOS
```bash
cd mobile
npm install
ionic capacitor add ios
ionic capacitor build ios
```

## 🔄 CI/CD Pipeline

For automated deployment, use GitHub Actions, GitLab CI, or Jenkins with the provided Docker configuration.

Example GitHub Actions workflow is available in `.github/workflows/deploy.yml`.

---

## 📞 Support

For deployment support or issues:
- Check the logs: `docker-compose logs`
- Review the troubleshooting section above
- Open an issue in the project repository

**Deployment completed! 🎉**

Your Iraqi E-commerce & Lottery Platform is now ready for production use.
