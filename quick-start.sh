#!/bin/zsh

# Simple startup script for Bil Khair Platform
echo "🚀 Starting Bil Khair Platform..."
echo "================================"

# Change to project directory
cd /Users/aj/Desktop/iraqi-ecommerce-lottery

# Start backend in background
echo "📡 Starting Backend Server..."
cd backend
nohup php artisan serve --port=8001 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "✅ Bil Khair Platform Starting..."
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:4200"
echo "  Backend:  http://localhost:8001"
echo "  Health:   http://localhost:8001/api/health"
echo ""
echo "👨‍💼 Admin Login:"
echo "  Email: admin@example.com"
echo "  Password: password"
echo ""
echo "💡 To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📄 Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: Check terminal output"

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo ""
echo "⏳ Services starting... Check URLs above in 30 seconds"
