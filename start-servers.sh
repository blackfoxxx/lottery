#!/bin/bash

echo "🚀 Starting Bil Khair Platform Servers"
echo "====================================="

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:8001 | xargs kill -9 2>/dev/null || true
lsof -ti:4200 | xargs kill -9 2>/dev/null || true

# Start Laravel backend server
echo "🔧 Starting Laravel Backend Server on port 8001..."
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
php artisan serve --port=8001 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start Angular frontend server
echo "🎨 Starting Angular Frontend Server on port 4200..."
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 5

echo ""
echo "✅ Bil Khair Platform is starting up!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:4200"
echo "   Backend API: http://localhost:8001/api"
echo "   Health Check: http://localhost:8001/api/health"
echo ""
echo "👨‍💼 Admin Access:"
echo "   Email: admin@example.com"
echo "   Password: password"
echo ""
echo "👤 Test User Access:"
echo "   Email: test@example.com"
echo "   Password: password"
echo ""
echo "🛠️ System Features:"
echo "   - 🛒 Product catalog with lottery integration"
echo "   - 🎟️ FREE lottery tickets with every purchase"
echo "   - 👨‍💼 Comprehensive admin dashboard"
echo "   - ⚙️ System settings management"
echo "   - 🎨 Real-time theme customization"
echo "   - 📊 System statistics and monitoring"
echo ""
echo "🔄 To stop servers: Press Ctrl+C or run 'pkill -f \"php artisan serve\"' and 'pkill -f \"ng serve\"'"
echo ""
echo "Servers running with PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"

# Keep script running
wait
