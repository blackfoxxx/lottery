#!/bin/zsh

echo "🎨 Starting Bil Khair Frontend Server"
echo "==================================="

# Set environment variables
export NODE_ENV=development
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:$PATH"

# Navigate to frontend directory
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend

# Check if we're in the right directory
if [ ! -f "angular.json" ]; then
    echo "❌ Error: angular.json not found. Are you in the frontend directory?"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Node modules not found. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Kill any existing process on port 4200
echo "🧹 Cleaning up port 4200..."
lsof -ti:4200 | xargs kill -9 2>/dev/null || true

# Wait a moment for the port to be freed
sleep 2

# Check Node.js and npm versions
echo "🔍 Checking Node.js and npm..."
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Install with: brew install node"
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Check Angular CLI
if command -v ng >/dev/null 2>&1; then
    echo "✅ Angular CLI: $(ng version --skip-git 2>/dev/null | head -n1)"
else
    echo "⚠️  Angular CLI not found globally. Using local version..."
fi

echo ""
echo "🚀 Starting Angular development server..."
echo "   URL: http://localhost:4200"
echo "   Press Ctrl+C to stop"
echo ""

# Start the server with explicit configuration
if command -v ng >/dev/null 2>&1; then
    # Use global Angular CLI
    ng serve --host 0.0.0.0 --port 4200 --open
else
    # Use local Angular CLI via npm
    npm run start -- --host 0.0.0.0 --port 4200 --open
fi
