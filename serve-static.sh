#!/bin/zsh

echo "🏗️ Building and Serving Bil Khair Frontend (Static)"
echo "================================================="

cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend

# Build the application
echo "📦 Building Angular application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Starting static server on port 8080..."
    echo "   URL: http://localhost:8080"
    echo ""
    
    # Try different ways to serve static files
    if command -v python3 >/dev/null 2>&1; then
        echo "Using Python 3 HTTP server..."
        cd dist/iraqi-lottery-frontend
        python3 -m http.server 8080
    elif command -v python >/dev/null 2>&1; then
        echo "Using Python 2 HTTP server..."
        cd dist/iraqi-lottery-frontend
        python -m SimpleHTTPServer 8080
    elif command -v php >/dev/null 2>&1; then
        echo "Using PHP built-in server..."
        cd dist/iraqi-lottery-frontend
        php -S localhost:8080
    else
        echo "❌ No suitable HTTP server found"
        echo "Install Python or use the development server"
        exit 1
    fi
else
    echo "❌ Build failed!"
    echo "Try running: npm install"
    exit 1
fi
