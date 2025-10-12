#!/bin/bash

# Simple deployment test script
# This will test the Docker deployment locally

set -e

echo "🧪 Testing Docker deployment for Iraqi E-commerce Platform..."

# Stop any running development servers
echo "🛑 Stopping development servers..."
pkill -f "php artisan serve" 2>/dev/null || true
pkill -f "ng serve" 2>/dev/null || true

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker compose down 2>/dev/null || true

# Create production environment file
echo "📝 Setting up production environment..."
cp backend/.env.example backend/.env.production

# Update key environment variables
sed -i.bak 's/APP_ENV=local/APP_ENV=production/' backend/.env.production
sed -i.bak 's/APP_DEBUG=true/APP_DEBUG=false/' backend/.env.production
sed -i.bak 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' backend/.env.production

# Test building the frontend first
echo "🏗️  Testing frontend build..."
cd frontend
npm install --silent
npm run build
cd ..

echo "✅ Frontend build successful!"

# Build and start services
echo "🐳 Building and starting Docker services..."
docker compose up -d --build

echo "⏳ Waiting for services to initialize..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker compose ps

# Test backend API endpoint
echo "🔧 Testing backend API..."
sleep 10
if curl -f http://localhost:8000/api 2>/dev/null; then
    echo "✅ Backend API is responding!"
else
    echo "⚠️  Backend API test failed, checking logs..."
    docker compose logs backend
fi

# Test frontend
echo "🎨 Testing frontend..."
if curl -f http://localhost 2>/dev/null; then
    echo "✅ Frontend is responding!"
else
    echo "⚠️  Frontend test failed, checking logs..."
    docker compose logs frontend
fi

echo ""
echo "🎉 Deployment test completed!"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📊 To view logs: docker compose logs -f"
echo "🛑 To stop: docker compose down"
