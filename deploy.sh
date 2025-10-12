#!/bin/bash

# Iraqi E-commerce & Lottery Platform Deployment Script
# This script deploys the application using Docker

set -e

echo "🚀 Starting deployment of Iraqi E-commerce & Lottery Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Detect Docker Compose v2 or v1
if command -v docker compose &> /dev/null; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  echo "❌ Docker Compose is not installed. Please install Docker Compose (v2 preferred)."
  exit 1
fi

# Create production environment file for backend
ENV_FILE=backend/.env.production
if [ ! -f "$ENV_FILE" ]; then
  echo "📝 Creating production environment configuration..."
  cp backend/.env.example "$ENV_FILE"
else
  echo "ℹ️  Using existing $ENV_FILE"
fi

# Update environment variables for production
sed -i.bak 's/APP_ENV=local/APP_ENV=production/' backend/.env.production
sed -i.bak 's/APP_DEBUG=true/APP_DEBUG=false/' backend/.env.production
sed -i.bak 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' backend/.env.production
sed -i.bak 's/# DB_HOST=127.0.0.1/DB_HOST=mysql/' backend/.env.production
sed -i.bak 's/# DB_PORT=3306/DB_PORT=3306/' backend/.env.production
sed -i.bak 's/# DB_DATABASE=laravel/DB_DATABASE=iraqi_ecommerce/' backend/.env.production
sed -i.bak 's/# DB_USERNAME=root/DB_USERNAME=laravel/' backend/.env.production
sed -i.bak 's/# DB_PASSWORD=/DB_PASSWORD=laravelpassword/' backend/.env.production

echo "🏗️  Building Docker images..."
$COMPOSE_CMD build --no-cache

echo "🗑️  Cleaning up old containers..."
$COMPOSE_CMD down

echo "🚀 Starting services..."
$COMPOSE_CMD up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔧 Setting up database..."
$COMPOSE_CMD exec -T backend php artisan migrate --force --seed

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
