#!/bin/zsh

echo "🔍 Bil Khair Platform - Service Status Check"
echo "==========================================="

# Set proper PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
print_error() { echo -e "${RED}❌${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ️${NC} $1"; }

echo ""
print_info "=== SYSTEM REQUIREMENTS ==="

# Check PHP
if command -v php >/dev/null 2>&1; then
    PHP_VERSION=$(php --version | head -n1)
    print_status "PHP: $PHP_VERSION"
else
    print_error "PHP not found"
    echo "  Install with: brew install php"
fi

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_status "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found"
    echo "  Install with: brew install node"
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_status "npm: $NPM_VERSION"
else
    print_error "npm not found"
fi

# Check Composer
if command -v composer >/dev/null 2>&1; then
    COMPOSER_VERSION=$(composer --version --no-ansi | head -n1)
    print_status "Composer: $COMPOSER_VERSION"
else
    print_warning "Composer not found globally"
fi

echo ""
print_info "=== PORT STATUS ==="

# Check ports
PORTS=(8001 4200 4201)
for port in "${PORTS[@]}"; do
    if lsof -i :$port >/dev/null 2>&1; then
        PROCESS=$(lsof -i :$port | tail -n +2)
        print_warning "Port $port: IN USE"
        echo "  $PROCESS"
    else
        print_status "Port $port: AVAILABLE"
    fi
done

echo ""
print_info "=== BACKEND STATUS ==="

cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend

# Check Laravel setup
if [[ -f "artisan" ]]; then
    print_status "Laravel artisan found"
else
    print_error "Laravel artisan not found"
fi

if [[ -f ".env" ]]; then
    print_status "Environment file exists"
else
    print_error "Environment file missing"
fi

if [[ -d "vendor" ]]; then
    print_status "Composer dependencies installed"
else
    print_warning "Composer dependencies missing"
    echo "  Run: composer install"
fi

if [[ -f "database/database.sqlite" ]]; then
    print_status "Database file exists"
else
    print_warning "Database file missing"
fi

# Test if we can run artisan
if command -v php >/dev/null 2>&1 && [[ -f "artisan" ]]; then
    if php artisan --version >/dev/null 2>&1; then
        LARAVEL_VERSION=$(php artisan --version)
        print_status "Laravel: $LARAVEL_VERSION"
    else
        print_warning "Laravel artisan cannot run"
    fi
fi

echo ""
print_info "=== FRONTEND STATUS ==="

cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend

if [[ -f "package.json" ]]; then
    print_status "package.json found"
else
    print_error "package.json not found"
fi

if [[ -f "angular.json" ]]; then
    print_status "Angular configuration found"
else
    print_error "Angular configuration not found"
fi

if [[ -d "node_modules" ]]; then
    print_status "Node modules installed"
else
    print_warning "Node modules missing"
    echo "  Run: npm install"
fi

if [[ -d "src" ]]; then
    print_status "Source directory exists"
else
    print_error "Source directory missing"
fi

# Check if we can run Angular CLI
if command -v ng >/dev/null 2>&1; then
    print_status "Global Angular CLI available"
elif [[ -f "node_modules/.bin/ng" ]]; then
    print_status "Local Angular CLI available"
else
    print_warning "Angular CLI not found"
    echo "  Install globally: npm install -g @angular/cli"
fi

echo ""
print_info "=== NETWORK TEST ==="

# Test backend
if curl -s --connect-timeout 3 http://localhost:8001/api/health >/dev/null 2>&1; then
    print_status "Backend API responding"
else
    print_warning "Backend API not responding"
fi

# Test frontend
if curl -s --connect-timeout 3 http://localhost:4200 >/dev/null 2>&1; then
    print_status "Frontend responding"
else
    print_warning "Frontend not responding"
fi

echo ""
print_info "=== CURRENT PROCESSES ==="

# Check for running processes
PROCESSES=$(ps aux | grep -E "(php artisan serve|ng serve|npm start)" | grep -v grep)
if [[ -n "$PROCESSES" ]]; then
    print_status "Found running processes:"
    echo "$PROCESSES"
else
    print_warning "No Bil Khair services currently running"
fi

echo ""
print_info "=== RECOMMENDATIONS ==="

if ! command -v php >/dev/null 2>&1; then
    echo "1. Install PHP: brew install php"
fi

if ! command -v node >/dev/null 2>&1; then
    echo "2. Install Node.js: brew install node"
fi

if [[ ! -d "/Users/aj/Desktop/iraqi-ecommerce-lottery/backend/vendor" ]]; then
    echo "3. Install backend dependencies: cd backend && composer install"
fi

if [[ ! -d "/Users/aj/Desktop/iraqi-ecommerce-lottery/frontend/node_modules" ]]; then
    echo "4. Install frontend dependencies: cd frontend && npm install"
fi

echo ""
echo "5. Start services:"
echo "   Backend:  cd backend && php artisan serve --port=8001"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "6. Or use automated script: ./start-bil-khair.sh"

echo ""
print_info "=== SERVICE URLS ==="
echo "Frontend: http://localhost:4200"
echo "Backend:  http://localhost:8001"
echo "API:      http://localhost:8001/api/health"
echo "Admin:    admin@example.com / password"
