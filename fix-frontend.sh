#!/bin/zsh

echo "🔍 Frontend Troubleshooting - Port 4200 Issues"
echo "=============================================="

cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend

# 1. Check if port 4200 is in use
echo "1. 🔌 Checking port 4200..."
if lsof -i :4200 >/dev/null 2>&1; then
    echo "   ⚠️  Port 4200 is in use by:"
    lsof -i :4200
    echo ""
    echo "   💡 To free the port, run: lsof -ti:4200 | xargs kill -9"
else
    echo "   ✅ Port 4200 is available"
fi
echo ""

# 2. Check Node.js and npm
echo "2. 🛠️  Checking Node.js environment..."
if command -v node >/dev/null 2>&1; then
    echo "   ✅ Node.js: $(node --version)"
else
    echo "   ❌ Node.js not found"
    echo "   💡 Install with: brew install node"
fi

if command -v npm >/dev/null 2>&1; then
    echo "   ✅ npm: $(npm --version)"
else
    echo "   ❌ npm not found"
fi
echo ""

# 3. Check project structure
echo "3. 📁 Checking project structure..."
if [ -f "angular.json" ]; then
    echo "   ✅ angular.json found"
else
    echo "   ❌ angular.json not found"
fi

if [ -f "package.json" ]; then
    echo "   ✅ package.json found"
else
    echo "   ❌ package.json not found"
fi

if [ -d "node_modules" ]; then
    echo "   ✅ node_modules directory exists"
else
    echo "   ⚠️  node_modules directory missing"
    echo "   💡 Run: npm install"
fi

if [ -d "src" ]; then
    echo "   ✅ src directory exists"
else
    echo "   ❌ src directory not found"
fi
echo ""

# 4. Check Angular CLI
echo "4. 🅰️  Checking Angular CLI..."
if command -v ng >/dev/null 2>&1; then
    echo "   ✅ Global Angular CLI found"
    ng version --skip-git 2>/dev/null | head -n5
else
    echo "   ⚠️  Global Angular CLI not found"
    echo "   💡 Install with: npm install -g @angular/cli"
    echo "   (Or use local version with: npm run start)"
fi
echo ""

# 5. Check dependencies
echo "5. 📦 Checking key dependencies..."
if [ -f "package.json" ]; then
    if grep -q "@angular/core" package.json; then
        echo "   ✅ Angular core dependency found"
    else
        echo "   ❌ Angular core dependency missing"
    fi
    
    if grep -q "@angular/cli" package.json; then
        echo "   ✅ Angular CLI dependency found"
    else
        echo "   ⚠️  Angular CLI dependency missing from package.json"
    fi
fi
echo ""

# 6. Test basic npm command
echo "6. 🧪 Testing npm functionality..."
if npm list --depth=0 >/dev/null 2>&1; then
    echo "   ✅ npm list command works"
else
    echo "   ⚠️  npm list command failed - dependencies might be corrupted"
    echo "   💡 Try: rm -rf node_modules && npm install"
fi
echo ""

echo "🚀 Suggested Solutions:"
echo "1. Free port 4200: lsof -ti:4200 | xargs kill -9"
echo "2. Install dependencies: npm install"
echo "3. Install Angular CLI globally: npm install -g @angular/cli"
echo "4. Start frontend: ./start-frontend.sh"
echo "5. Or start manually: npm run start"
echo "6. Alternative port: ng serve --port 4201"
echo ""

echo "🌐 Expected URLs after starting:"
echo "   - http://localhost:4200 (Primary)"
echo "   - http://localhost:4201 (Alternative)"
echo "   - http://127.0.0.1:4200 (Local)"
