#!/bin/zsh

echo "🚀 Bil Khair Platform Server Startup Script"
echo "==========================================="

# Set up environment
export PATH="/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:$PATH"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if command_exists php; then
    echo "✅ PHP found: $(php --version | head -n1)"
else
    echo "❌ PHP not found. Please install PHP."
    exit 1
fi

if command_exists node; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js."
    exit 1
fi

if command_exists npm; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found. Please install npm."
    exit 1
fi

# Kill existing processes
echo ""
echo "🧹 Cleaning up existing processes..."
pkill -f "php artisan serve" 2>/dev/null || true
pkill -f "ng serve" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

# Check if ports are free
echo ""
echo "🔌 Checking ports..."
if lsof -i :8001 >/dev/null 2>&1; then
    echo "⚠️  Port 8001 is still in use"
    lsof -i :8001
else
    echo "✅ Port 8001 is free"
fi

if lsof -i :4200 >/dev/null 2>&1; then
    echo "⚠️  Port 4200 is still in use"
    lsof -i :4200
else
    echo "✅ Port 4200 is free"
fi

# Navigate to project directory
cd /Users/aj/Desktop/iraqi-ecommerce-lottery

# Check backend setup
echo ""
echo "🔧 Checking backend setup..."
cd backend

if [ ! -f "artisan" ]; then
    echo "❌ Laravel artisan not found in backend directory"
    exit 1
fi

if [ ! -f "vendor/autoload.php" ]; then
    echo "⚠️  Composer dependencies not installed. Running composer install..."
    composer install
fi

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    php artisan key:generate
fi

# Start backend server
echo ""
echo "🔧 Starting Laravel backend server..."
php artisan serve --host=127.0.0.1 --port=8001 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Test backend health
echo "🏥 Testing backend health..."
if curl -s http://127.0.0.1:8001/api/health >/dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "⚠️  Backend might still be starting up..."
fi

# Check frontend setup
echo ""
echo "🎨 Checking frontend setup..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "⚠️  Node modules not installed. Running npm install..."
    npm install
fi

# Start frontend server
echo ""
echo "🎨 Starting Angular frontend server..."
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 5

echo ""
echo "✅ Bil Khair Platform Servers Started!"
echo ""
echo "🌐 Access URLs:"
echo "   🎨 Frontend: http://localhost:4200"
echo "   🔧 Backend API: http://localhost:8001/api"
echo "   🏥 Health Check: http://localhost:8001/api/health"
echo ""
echo "👨‍💼 Admin Credentials:"
echo "   📧 Email: admin@example.com"
echo "   🔑 Password: password"
echo ""
echo "👤 Test User Credentials:"
echo "   📧 Email: test@example.com"
echo "   🔑 Password: password"
echo ""
echo "🎯 Features to Test:"
echo "   • 🏷️  Bil Khair rebranding throughout the platform"
echo "   • ⚙️  System Settings in Admin Dashboard"
echo "   • 🎨 Real-time color theme changes"
echo "   • 📥📤 Import/Export configuration"
echo "   • 🔄 Reset to defaults functionality"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or use: pkill -f 'php artisan serve' && pkill -f 'npm start'"
echo ""
echo "📊 Process IDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"
echo ""
echo "⏳ Servers are running... Press Ctrl+C to stop"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
wait
