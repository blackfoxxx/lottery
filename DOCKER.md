# Docker Setup Guide

Complete guide for running Belkhair E-Commerce Platform using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB free disk space

## Quick Start

```bash
# Clone the repository
git clone https://github.com/blackfoxxx/lottery.git
cd lottery

# Copy environment file
cp .env.docker .env

# Update .env with your configuration
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Services

The Docker Compose setup includes the following services:

### 1. MySQL Database
- **Container**: `belkhair-mysql`
- **Port**: 3306
- **Image**: mysql:8.0
- **Volume**: `mysql_data`

### 2. Redis Cache
- **Container**: `belkhair-redis`
- **Port**: 6379
- **Image**: redis:7-alpine
- **Volume**: `redis_data`

### 3. Laravel Backend
- **Container**: `belkhair-backend`
- **Port**: 8000
- **Build**: `./backend/Dockerfile`
- **Volume**: `backend_storage`

### 4. React Frontend
- **Container**: `belkhair-frontend`
- **Port**: 3000
- **Build**: `./client/Dockerfile`

### 5. Queue Worker
- **Container**: `belkhair-queue`
- **Purpose**: Process background jobs

### 6. Scheduler
- **Container**: `belkhair-scheduler`
- **Purpose**: Run scheduled tasks (cron)

## Configuration

### Environment Variables

Create `.env` file from `.env.docker`:

```env
# Database
DB_ROOT_PASSWORD=your_secure_password
DB_DATABASE=belkhair
DB_USERNAME=belkhair
DB_PASSWORD=your_secure_password

# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8000

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=3306
REDIS_PORT=6379
```

## Docker Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend

# Start with rebuild
docker-compose up -d --build
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop frontend
```

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 frontend
```

### Execute Commands

```bash
# Run Laravel migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Clear cache
docker-compose exec backend php artisan cache:clear

# Access MySQL
docker-compose exec mysql mysql -u belkhair -p belkhair

# Access Redis CLI
docker-compose exec redis redis-cli

# Access container shell
docker-compose exec backend sh
```

### Manage Containers

```bash
# List running containers
docker-compose ps

# Restart service
docker-compose restart backend

# View resource usage
docker stats

# Remove stopped containers
docker-compose rm
```

## Database Setup

### Initial Setup

```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Create admin user
docker-compose exec backend php artisan make:admin
```

### Backup Database

```bash
# Backup
docker-compose exec mysql mysqldump -u belkhair -pbelkhair belkhair > backup.sql

# Restore
docker-compose exec -T mysql mysql -u belkhair -pbelkhair belkhair < backup.sql
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Change port in .env
FRONTEND_PORT=3001
```

### Container Won't Start

```bash
# View logs
docker-compose logs backend

# Rebuild container
docker-compose up -d --build backend

# Remove and recreate
docker-compose rm -f backend
docker-compose up -d backend
```

### Database Connection Error

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify connection
docker-compose exec backend php artisan tinker
>>> DB::connection()->getPdo();
```

### Permission Issues

```bash
# Fix storage permissions
docker-compose exec backend chmod -R 775 storage bootstrap/cache
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Clear All Data

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## Production Deployment

### Optimize for Production

1. **Update environment**:
```env
APP_ENV=production
APP_DEBUG=false
```

2. **Optimize Laravel**:
```bash
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache
docker-compose exec backend composer install --optimize-autoloader --no-dev
```

3. **Enable HTTPS**:
- Use reverse proxy (Nginx/Traefik)
- Configure SSL certificates
- Update APP_URL to https://

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Health Checks

All services include health checks. Monitor with:

```bash
docker-compose ps
```

Healthy services show `(healthy)` status.

## Scaling

### Scale Queue Workers

```bash
# Scale to 3 workers
docker-compose up -d --scale queue-worker=3

# View workers
docker-compose ps queue-worker
```

### Load Balancing

Use Nginx or Traefik for load balancing multiple frontend instances:

```bash
docker-compose up -d --scale frontend=3
```

## Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats belkhair-backend
```

### Container Logs

```bash
# Follow logs
docker-compose logs -f

# Export logs
docker-compose logs > logs.txt
```

## Maintenance

### Update Images

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Clean everything
docker system prune -a --volumes
```

## Security Best Practices

1. **Change default passwords** in `.env`
2. **Use secrets** for sensitive data
3. **Enable firewall** rules
4. **Regular updates** of base images
5. **Scan images** for vulnerabilities
6. **Use non-root users** in containers
7. **Enable SELinux/AppArmor**
8. **Limit container resources**

## Advanced Configuration

### Custom Networks

```yaml
networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true
```

### Named Volumes

```yaml
volumes:
  mysql_data:
    driver: local
    driver_opts:
      type: none
      device: /data/mysql
      o: bind
```

### Environment Files

```bash
# Use different env files
docker-compose --env-file .env.staging up -d
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/blackfoxxx/lottery/issues
- Email: support@belkhair.com
- Documentation: https://docs.belkhair.com

---

**Last Updated**: December 2024  
**Version**: 1.0.0
