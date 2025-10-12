#!/bin/zsh

echo "🛑 Stopping Bil Khair Platform Services..."

# Kill processes by PID if files exist
if [[ -f ".backend.pid" ]]; then
    BACKEND_PID=$(cat .backend.pid)
    kill $BACKEND_PID 2>/dev/null
    rm .backend.pid
    echo "✅ Backend stopped (PID: $BACKEND_PID)"
fi

if [[ -f ".frontend.pid" ]]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null
    rm .frontend.pid
    echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
fi

# Kill by port as backup
lsof -ti:8001 | xargs kill -9 2>/dev/null
lsof -ti:4200 | xargs kill -9 2>/dev/null

# Kill by process name
pkill -f "php artisan serve" 2>/dev/null
pkill -f "ng serve" 2>/dev/null
pkill -f "npm start" 2>/dev/null

echo "🧹 All Bil Khair services stopped"
