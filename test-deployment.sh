#!/bin/bash

echo "🚀 Iraqi E-commerce Lottery Platform - Deployment Test"
echo "======================================================"
echo

# Check if all containers are running
echo "📋 Checking container status..."
docker-compose ps
echo

# Test backend API health
echo "🔧 Testing backend API health..."
HEALTH_RESPONSE=$(curl -s http://localhost:8000/api/health)
echo "Direct backend: $HEALTH_RESPONSE"
echo

# Test frontend proxy to backend
echo "🔧 Testing frontend proxy to backend..."
PROXY_RESPONSE=$(curl -s http://localhost/api/health)
echo "Through proxy: $PROXY_RESPONSE"
echo

# Test frontend serving
echo "🌐 Testing frontend serving..."
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" http://localhost -o /dev/null)
echo "Frontend HTTP status: $FRONTEND_RESPONSE"
echo

# Test API endpoints
echo "📋 Testing API endpoints..."
echo "Products: $(curl -s http://localhost/api/products)"
echo "Lottery Draws: $(curl -s http://localhost/api/lottery-draws)"
echo "Prizes: $(curl -s http://localhost/api/prizes)"
echo

# Check database connection
echo "🗄️  Testing database connection..."
docker exec iraqi_ecommerce_backend php artisan db:show --counts
echo

echo "✅ Deployment test completed!"
echo
echo "🌍 Access the application:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost:8000"
echo "  API Health: http://localhost/api/health"
echo
echo "🔗 Available API Endpoints:"
echo "  GET /api/products - List products"
echo "  GET /api/lottery-draws - List lottery draws"
echo "  GET /api/prizes - List prizes"
echo "  POST /api/register - User registration"
echo "  POST /api/login - User login"
echo "  GET /api/user - Get user profile (authenticated)"
