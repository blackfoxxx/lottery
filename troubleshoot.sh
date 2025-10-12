#!/bin/zsh

echo "🔍 Bil Khair Platform Troubleshooting"
echo "===================================="

# Check system information
echo "📱 System Information:"
echo "   OS: $(uname -s) $(uname -r)"
echo "   Architecture: $(uname -m)"
echo ""

# Check if we're in the right directory
echo "📁 Current Directory: $(pwd)"
echo "📁 Project Directory Contents:"
if [ -d "/Users/aj/Desktop/iraqi-ecommerce-lottery" ]; then
    ls -la /Users/aj/Desktop/iraqi-ecommerce-lottery/
else
    echo "❌ Project directory not found!"
    exit 1
fi
echo ""

# Check required tools
echo "🛠️  Required Tools:"
tools=("php" "node" "npm" "composer")
for tool in "${tools[@]}"; do
    if command -v "$tool" >/dev/null 2>&1; then
        version=$($tool --version 2>/dev/null | head -n1)
        echo "   ✅ $tool: $version"
    else
        echo "   ❌ $tool: Not found"
    fi
done
echo ""

# Check port usage
echo "🔌 Port Status:"
if lsof -i :8001 >/dev/null 2>&1; then
    echo "   ⚠️  Port 8001 (Backend): In use"
    lsof -i :8001
else
    echo "   ✅ Port 8001 (Backend): Available"
fi

if lsof -i :4200 >/dev/null 2>&1; then
    echo "   ⚠️  Port 4200 (Frontend): In use"
    lsof -i :4200
else
    echo "   ✅ Port 4200 (Frontend): Available"
fi
echo ""

# Check backend setup
echo "🔧 Backend Status:"
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Backend directory accessible"
    if [ -f "artisan" ]; then
        echo "   ✅ Laravel artisan found"
    else
        echo "   ❌ Laravel artisan not found"
    fi
    
    if [ -f "vendor/autoload.php" ]; then
        echo "   ✅ Composer dependencies installed"
    else
        echo "   ⚠️  Composer dependencies missing (run: composer install)"
    fi
    
    if [ -f ".env" ]; then
        echo "   ✅ Environment file exists"
    else
        echo "   ⚠️  Environment file missing (copy .env.example to .env)"
    fi
    
    if [ -f "database/database.sqlite" ]; then
        echo "   ✅ Database file exists"
    else
        echo "   ⚠️  Database file missing"
    fi
else
    echo "   ❌ Backend directory not accessible"
fi
echo ""

# Check frontend setup
echo "🎨 Frontend Status:"
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend directory accessible"
    if [ -f "package.json" ]; then
        echo "   ✅ package.json found"
    else
        echo "   ❌ package.json not found"
    fi
    
    if [ -d "node_modules" ]; then
        echo "   ✅ Node modules installed"
    else
        echo "   ⚠️  Node modules missing (run: npm install)"
    fi
    
    if [ -f "angular.json" ]; then
        echo "   ✅ Angular configuration found"
    else
        echo "   ❌ Angular configuration not found"
    fi
else
    echo "   ❌ Frontend directory not accessible"
fi
echo ""

# Test network connectivity
echo "🌐 Network Test:"
if curl -s --connect-timeout 5 http://localhost:8001 >/dev/null 2>&1; then
    echo "   ✅ Backend server responding on port 8001"
else
    echo "   ❌ Backend server not responding on port 8001"
fi

if curl -s --connect-timeout 5 http://localhost:4200 >/dev/null 2>&1; then
    echo "   ✅ Frontend server responding on port 4200"
else
    echo "   ❌ Frontend server not responding on port 4200"
fi
echo ""

echo "💡 Recommended Actions:"
echo "1. If tools are missing, install them:"
echo "   - PHP: brew install php"
echo "   - Node.js: brew install node"
echo "   - Composer: brew install composer"
echo ""
echo "2. If dependencies are missing:"
echo "   - Backend: cd backend && composer install"
echo "   - Frontend: cd frontend && npm install"
echo ""
echo "3. To start servers:"
echo "   ./start-bil-khair.sh"
echo ""
echo "4. Manual startup:"
echo "   Terminal 1: cd backend && php artisan serve --port=8001"
echo "   Terminal 2: cd frontend && npm start"
