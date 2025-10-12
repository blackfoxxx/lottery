#!/bin/zsh

echo "🎨 Bil Khair Frontend Server - Comprehensive Startup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Navigate to frontend directory
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend

# Check if we're in the right place
if [ ! -f "angular.json" ]; then
    print_error "Not in Angular frontend directory!"
    exit 1
fi

print_info "Current directory: $(pwd)"

# Step 1: Kill any existing processes
print_info "Step 1: Cleaning up existing processes..."
pkill -f "ng serve" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

# Kill specific ports
for port in 4200 4201 4202; do
    if lsof -i :$port >/dev/null 2>&1; then
        print_warning "Port $port is in use, attempting to free it..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
done

print_status "Cleanup complete"

# Step 2: Check Node.js environment
print_info "Step 2: Checking Node.js environment..."

# Try different common Node.js installation paths
NODE_PATHS=(
    "/usr/local/bin/node"
    "/opt/homebrew/bin/node"
    "/usr/bin/node"
    "$(which node 2>/dev/null)"
)

NODE_CMD=""
for path in "${NODE_PATHS[@]}"; do
    if [ -x "$path" ]; then
        NODE_CMD="$path"
        break
    fi
done

if [ -z "$NODE_CMD" ]; then
    print_error "Node.js not found!"
    echo "Please install Node.js:"
    echo "  brew install node"
    echo "  or download from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$($NODE_CMD --version 2>/dev/null)
print_status "Node.js found: $NODE_VERSION at $NODE_CMD"

# Check npm
NPM_PATHS=(
    "/usr/local/bin/npm"
    "/opt/homebrew/bin/npm"
    "/usr/bin/npm"
    "$(which npm 2>/dev/null)"
)

NPM_CMD=""
for path in "${NPM_PATHS[@]}"; do
    if [ -x "$path" ]; then
        NPM_CMD="$path"
        break
    fi
done

if [ -z "$NPM_CMD" ]; then
    print_error "npm not found!"
    exit 1
fi

NPM_VERSION=$($NPM_CMD --version 2>/dev/null)
print_status "npm found: $NPM_VERSION at $NPM_CMD"

# Step 3: Check and install dependencies
print_info "Step 3: Checking dependencies..."

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    print_warning "Node modules missing or incomplete. Installing..."
    $NPM_CMD install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_status "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Step 4: Check Angular CLI
print_info "Step 4: Checking Angular CLI..."

# Try global Angular CLI first
if command -v ng >/dev/null 2>&1; then
    print_status "Global Angular CLI found"
    NG_CMD="ng"
else
    # Try local Angular CLI
    if [ -f "node_modules/.bin/ng" ]; then
        print_status "Local Angular CLI found"
        NG_CMD="./node_modules/.bin/ng"
    else
        print_warning "Angular CLI not found, using npm run start"
        NG_CMD="npm run start"
    fi
fi

# Step 5: Find available port
print_info "Step 5: Finding available port..."

PORTS=(4200 4201 4202 4203 4204)
SELECTED_PORT=""

for port in "${PORTS[@]}"; do
    if ! lsof -i :$port >/dev/null 2>&1; then
        SELECTED_PORT=$port
        print_status "Port $port is available"
        break
    else
        print_warning "Port $port is in use"
    fi
done

if [ -z "$SELECTED_PORT" ]; then
    print_error "No available ports found!"
    exit 1
fi

# Step 6: Start the server
print_info "Step 6: Starting Angular development server..."
echo ""
print_status "🚀 Starting Bil Khair Frontend on port $SELECTED_PORT"
print_info "🌐 Frontend URL: http://localhost:$SELECTED_PORT"
print_info "🔧 Backend should be on: http://localhost:8001"
print_info "📊 Admin Dashboard: Login with admin@example.com / password"
echo ""
print_info "Press Ctrl+C to stop the server"
echo ""

# Start the server with the selected configuration
if [ "$NG_CMD" = "npm run start" ]; then
    $NPM_CMD run start -- --port $SELECTED_PORT --host 0.0.0.0
elif [ "$NG_CMD" = "ng" ]; then
    ng serve --port $SELECTED_PORT --host 0.0.0.0 --open
else
    $NG_CMD serve --port $SELECTED_PORT --host 0.0.0.0 --open
fi

# If we get here, the server stopped
echo ""
print_info "Frontend server stopped"
