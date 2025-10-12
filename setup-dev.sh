#!/bin/bash

# Iraqi E-commerce & Lottery Platform - Local Development Setup
# This script sets up the development environment

set -e

echo "🏗️  Setting up Iraqi E-commerce & Lottery Platform for development..."

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.2+ first."
    exit 1
fi

if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ All prerequisites are installed!"

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
fi

echo "📦 Installing PHP dependencies..."
composer install

echo "🔑 Generating application key..."
php artisan key:generate

echo "🗄️  Setting up database..."
php artisan migrate --seed

echo "🏗️  Building assets..."
npm install
npm run build

cd ..

# Setup Frontend
echo "🎨 Setting up frontend..."
cd frontend

echo "📦 Installing Node.js dependencies..."
npm install

cd ..

# Setup Mobile (optional)
if [ -d "mobile" ]; then
    echo "📱 Setting up mobile app..."
    cd mobile
    npm install
    cd ..
fi

echo "✅ Development setup completed successfully!"
echo ""
echo "🚀 To start the development servers:"
echo ""
echo "Backend (in one terminal):"
echo "  cd backend && php artisan serve"
echo ""
echo "Frontend (in another terminal):"
echo "  cd frontend && npm start"
echo ""
echo "🌐 Your application will be available at:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: http://localhost:8000"
echo ""
echo "🎉 Happy coding!"
