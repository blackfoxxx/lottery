# Backend Installation Guide - Laravel API

Complete guide for setting up the Laravel backend for Belkhair E-Commerce Platform.

## Prerequisites

- PHP 8.1 or higher
- Composer 2.x
- MySQL 8.0+ or MariaDB 10.3+
- Node.js 18+ (for asset compilation)
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/blackfoxxx/lottery.git
cd lottery/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# Then run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start development server
php artisan serve
```

## Detailed Installation

### 1. Install PHP Dependencies

```bash
composer install
```

If you encounter memory issues:
```bash
php -d memory_limit=-1 /usr/local/bin/composer install
```

### 2. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Update the following variables:

```env
APP_NAME="Belkhair E-Commerce"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belkhair
DB_USERNAME=root
DB_PASSWORD=your_password

# Queue
QUEUE_CONNECTION=database

# Cache
CACHE_DRIVER=file
SESSION_DRIVER=file

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@belkhair.com"
MAIL_FROM_NAME="${APP_NAME}"

# Payment Gateways
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# SMS
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=

# JWT
JWT_SECRET=
JWT_TTL=60

# CORS
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Database Setup

#### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE belkhair CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Run Migrations

```bash
php artisan migrate
```

#### Seed Database (Optional)

```bash
# Seed all data
php artisan db:seed

# Or seed specific seeders
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProductSeeder
php artisan db:seed --class=LotterySeeder
```

### 5. Storage Setup

```bash
# Create symbolic link for storage
php artisan storage:link

# Set permissions
chmod -R 775 storage bootstrap/cache
```

### 6. Queue Worker (Optional)

For background jobs:

```bash
# Start queue worker
php artisan queue:work

# Or use supervisor for production
```

### 7. Task Scheduler (Optional)

Add to crontab:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/user` - Get authenticated user

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/{id}` - Update product (admin)
- `DELETE /api/v1/products/{id}` - Delete product (admin)

### Orders
- `GET /api/v1/orders` - List user orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{id}` - Get order details

### Lottery
- `GET /api/v1/lottery/draws` - List lottery draws
- `POST /api/v1/lottery/purchase` - Purchase tickets
- `GET /api/v1/lottery/my-tickets` - Get user tickets
- `GET /api/v1/lottery/results` - Get draw results

### Gift Cards
- `GET /api/v1/gift-cards` - List gift cards
- `POST /api/v1/gift-cards/purchase` - Purchase gift card
- `POST /api/v1/gift-cards/redeem` - Redeem gift card
- `GET /api/v1/gift-cards/balance` - Check balance

### Bundles
- `GET /api/v1/bundles` - List product bundles
- `GET /api/v1/bundles/{id}` - Get bundle details

### Social Proof
- `POST /api/v1/social-proof/track` - Track product view
- `GET /api/v1/social-proof/activity/{product_id}` - Get product activity

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/users` - List users
- `GET /api/v1/admin/analytics` - Analytics data
- `POST /api/v1/admin/settings` - Update settings

## Testing

### Run Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=ProductTest

# Run with coverage
php artisan test --coverage
```

### API Testing

Use Postman or curl:

```bash
# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get products (with auth token)
curl -X GET http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Deployment

### 1. Optimize Application

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 2. Set Environment

Update `.env`:

```env
APP_ENV=production
APP_DEBUG=false
```

### 3. Web Server Configuration

#### Apache

Create `.htaccess` in public directory:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name api.belkhair.com;
    root /var/www/belkhair/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. SSL Certificate

```bash
# Using Let's Encrypt
sudo certbot --nginx -d api.belkhair.com
```

### 5. Supervisor (Queue Worker)

Create `/etc/supervisor/conf.d/belkhair-worker.conf`:

```ini
[program:belkhair-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/belkhair/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/var/www/belkhair/storage/logs/worker.log
stopwaitsecs=3600
```

Restart supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start belkhair-worker:*
```

## Maintenance

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Database Backup

```bash
# Manual backup
mysqldump -u root -p belkhair > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p belkhair < backup_20241225.sql
```

### Log Management

```bash
# View logs
tail -f storage/logs/laravel.log

# Clear old logs
php artisan log:clear
```

## Troubleshooting

### Common Issues

#### 1. Permission Denied

```bash
sudo chown -R www-data:www-data /var/www/belkhair
sudo chmod -R 775 storage bootstrap/cache
```

#### 2. Database Connection Error

- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env`
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

#### 3. 500 Internal Server Error

- Check logs: `tail -f storage/logs/laravel.log`
- Enable debug: Set `APP_DEBUG=true` in `.env`
- Clear cache: `php artisan cache:clear`

#### 4. Queue Jobs Not Processing

- Check queue worker is running: `ps aux | grep queue:work`
- Restart queue: `php artisan queue:restart`
- Check failed jobs: `php artisan queue:failed`

## Security Best Practices

1. **Never commit `.env` file**
2. **Use strong passwords and secrets**
3. **Enable HTTPS in production**
4. **Keep dependencies updated**: `composer update`
5. **Use rate limiting for API endpoints**
6. **Implement CSRF protection**
7. **Sanitize user inputs**
8. **Use prepared statements (Laravel does this by default)**
9. **Enable firewall rules**
10. **Regular security audits**

## Performance Optimization

1. **Enable OPcache** in `php.ini`
2. **Use Redis for caching and sessions**
3. **Optimize database queries** (use eager loading)
4. **Enable query caching**
5. **Use CDN for static assets**
6. **Implement API response caching**
7. **Use queue workers for heavy tasks**
8. **Database indexing**

## Support

For issues or questions:
- GitHub Issues: https://github.com/blackfoxxx/lottery/issues
- Email: support@belkhair.com
- Documentation: https://docs.belkhair.com

---

**Last Updated**: December 2024  
**Version**: 1.0.0
