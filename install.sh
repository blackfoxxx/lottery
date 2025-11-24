#!/bin/bash

# Belkhair E-Commerce Platform - Installation Script
# This script automates the installation and setup process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main installation
print_header "Belkhair E-Commerce Platform Installation"

# Step 1: Check system requirements
print_header "Step 1: Checking System Requirements"

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    print_info "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

if command_exists git; then
    GIT_VERSION=$(git --version)
    print_success "Git is installed: $GIT_VERSION"
else
    print_warning "Git is not installed (optional but recommended)"
fi

# Step 2: Install dependencies
print_header "Step 2: Installing Dependencies"

print_info "Installing frontend dependencies..."
cd client
npm install
print_success "Frontend dependencies installed"

cd ..

# Step 3: Environment configuration
print_header "Step 3: Environment Configuration"

if [ ! -f ".env" ]; then
    print_info "Creating .env file from template..."
    cat > .env << 'EOF'
# Belkhair E-Commerce Platform - Environment Variables

# Application
VITE_APP_TITLE=Belkhair E-Commerce Platform
VITE_APP_LOGO=/logo.png

# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Frontend Configuration
VITE_FRONTEND_URL=http://localhost:3000

# Analytics (Optional)
VITE_ANALYTICS_ENABLED=false
VITE_ANALYTICS_WEBSITE_ID=
VITE_ANALYTICS_ENDPOINT=

# Feature Flags
VITE_ENABLE_LOTTERY=true
VITE_ENABLE_GIFT_CARDS=true
VITE_ENABLE_BUNDLES=true
VITE_ENABLE_SOCIAL_PROOF=true

# Payment Gateway (Configure in admin dashboard)
STRIPE_PUBLIC_KEY=
PAYPAL_CLIENT_ID=

# Storage (Configure in admin dashboard)
AWS_S3_BUCKET=
AWS_REGION=

# Email Service (Configure in admin dashboard)
SENDGRID_API_KEY=
SMTP_HOST=
SMTP_PORT=

# SMS Service (Configure in admin dashboard)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Database (Backend - Laravel)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belkhair
DB_USERNAME=root
DB_PASSWORD=

# Security
JWT_SECRET=
SESSION_SECRET=

# OAuth (Optional)
OAUTH_SERVER_URL=
OAUTH_PORTAL_URL=

# Notification Settings
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
EOF
    print_success ".env file created"
    print_warning "Please update .env file with your configuration"
else
    print_info ".env file already exists"
fi

# Step 4: Build frontend
print_header "Step 4: Building Frontend"

print_info "Building production bundle..."
cd client
npm run build
print_success "Frontend built successfully"
cd ..

# Step 5: Setup instructions
print_header "Installation Complete!"

echo ""
print_success "Frontend installation completed successfully!"
echo ""
print_info "Next Steps:"
echo ""
echo "1. Update the .env file with your configuration:"
echo "   - Database credentials"
echo "   - API keys (Stripe, PayPal, SendGrid, etc.)"
echo "   - Application settings"
echo ""
echo "2. Start the development server:"
echo "   ${GREEN}cd client && npm run dev${NC}"
echo ""
echo "3. Access the application:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "4. Admin Dashboard:"
echo "   ${GREEN}http://localhost:3000/admin${NC}"
echo ""
echo "5. Configure environment settings in admin dashboard:"
echo "   - Navigate to Admin > Environment Settings"
echo "   - Add API keys and service credentials"
echo "   - Test connections"
echo ""
print_info "For backend (Laravel) installation, see BACKEND_INSTALLATION.md"
echo ""
print_warning "Important: Update all API keys and secrets before deploying to production!"
echo ""
print_success "Happy selling! 🚀"
echo ""
