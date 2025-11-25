#!/bin/bash

# Belkhair E-Commerce Platform - Mobile App Installation Script
# This script will install all dependencies and set up the development environment

set -e  # Exit on error

echo "================================================"
echo "Belkhair Mobile App - Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Belkhair Mobile App - Environment Variables

# API Configuration
API_URL=http://localhost:3001/api/v1

# App Configuration
APP_NAME=Belkhair
APP_VERSION=1.0.0

# Feature Flags
ENABLE_LOTTERY=true
ENABLE_GIFT_CARDS=true
ENABLE_BUNDLES=true

# Analytics (optional)
# ANALYTICS_ENABLED=false

# Other configurations
# Add your custom environment variables here
EOF
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "ℹ️  .env file already exists. Skipping creation."
fi

echo ""
echo "================================================"
echo "✅ Installation Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Install Expo Go on your mobile device:"
echo "   - iOS: https://apps.apple.com/app/expo-go/id982107779"
echo "   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "2. Start the development server:"
echo "   npm start"
echo ""
echo "3. Scan the QR code with Expo Go app"
echo ""
echo "For production build:"
echo "   - iOS: eas build --platform ios"
echo "   - Android: eas build --platform android"
echo ""
echo "Happy coding! 🚀"
echo ""
