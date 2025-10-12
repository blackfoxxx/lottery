# 🔍 Bil Khair Platform - Manual Service Check & Start Guide

## Current Status: No Services Running

Based on the checks performed, it appears no services are currently running. Here's how to manually check and start them:

## 📋 Step-by-Step Service Check

### Step 1: Open Terminal
Open your Terminal application on macOS.

### Step 2: Check System Requirements
```zsh
# Check if required tools are installed
node --version    # Should show Node.js version
npm --version     # Should show npm version  
php --version     # Should show PHP version
composer --version # Should show Composer version
```

**If any are missing:**
```zsh
# Install missing tools using Homebrew
brew install node     # For Node.js and npm
brew install php      # For PHP
brew install composer # For Composer
```

### Step 3: Check Current Port Usage
```zsh
# Check what's using our required ports
lsof -i :8001    # Backend port
lsof -i :4200    # Frontend port
lsof -i :4201    # Alternative frontend port

# If anything is using the ports, kill it:
lsof -ti:8001 | xargs kill -9
lsof -ti:4200 | xargs kill -9
```

### Step 4: Check Project Dependencies

**Backend Dependencies:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
ls -la vendor/    # Should exist if Composer dependencies are installed

# If vendor/ doesn't exist, install dependencies:
composer install
```

**Frontend Dependencies:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend  
ls -la node_modules/    # Should exist if npm dependencies are installed

# If node_modules/ doesn't exist, install dependencies:
npm install
```

## 🚀 Starting the Services

### Method 1: Manual Start (Recommended)

**Terminal 1 - Start Backend:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
php artisan serve --port=8001
```
**Expected output:**
```
Laravel development server started: http://127.0.0.1:8001
[Sun Oct  6 10:00:00 2025] PHP 8.x.x Development Server (http://127.0.0.1:8001) started
```

**Terminal 2 - Start Frontend (new terminal window):**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend
npm start
```
**Expected output:**
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

### Method 2: Use Automation Scripts

**Option A - Complete Startup:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery
./start-bil-khair.sh
```

**Option B - Backend Only:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
php artisan serve --port=8001 &
```

**Option C - Frontend Only:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery
./start-frontend-robust.sh
```

### Method 3: Alternative Ports (if port conflicts)

**Backend on different port:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
php artisan serve --port=8002
```

**Frontend on different port:**
```zsh
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend
npm start -- --port=4201
```

## ✅ Verification Steps

### 1. Check if Backend is Running
```zsh
curl http://localhost:8001/api/health
```
**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T...",
  "version": "1.0.0",
  "database": "connected",
  "services": {
    "api": "active",
    "lottery": "active"
  }
}
```

### 2. Check if Frontend is Running
Open browser and go to: `http://localhost:4200`

**Expected result:**
- ✅ Bil Khair platform loads
- ✅ Shows "🛒 Bil Khair" in header
- ✅ Arabic subtitle: "بالخير - منصة التجارة الإلكترونية واليانصيب"
- ✅ Modern UI with category-based layout

### 3. Test Admin Dashboard
1. Click "Login" or use quick login
2. Use admin credentials: `admin@example.com` / `password`
3. Access Admin Dashboard
4. Click "⚙️ System Settings" tab
5. Verify all settings panels load

## 🎯 Expected Service URLs

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:4200 | Browser test |
| Backend API | http://localhost:8001/api | API endpoint |
| Health Check | http://localhost:8001/api/health | JSON response |
| Admin Dashboard | http://localhost:4200 (login as admin) | UI test |

## 🔧 Troubleshooting Common Issues

### Issue 1: "Command not found" errors
**Solution:** Install missing tools
```zsh
# Install everything with Homebrew
brew install node php composer
```

### Issue 2: "Port already in use" 
**Solution:** Kill existing processes
```zsh
# Find and kill processes using the ports
lsof -ti:8001,4200 | xargs kill -9
```

### Issue 3: "Dependencies missing"
**Solution:** Install project dependencies
```zsh
# Backend
cd backend && composer install

# Frontend  
cd frontend && npm install
```

### Issue 4: "Laravel key missing"
**Solution:** Generate application key
```zsh
cd backend
cp .env.example .env  # if .env doesn't exist
php artisan key:generate
```

### Issue 5: "Database connection failed"
**Solution:** Check SQLite database
```zsh
cd backend
ls -la database/database.sqlite  # Should exist
php artisan migrate:fresh --seed  # Reset if needed
```

## 🎨 Testing the Enhanced Features

Once both services are running, test these new features:

### 1. Platform Rebranding
- ✅ Header shows "Bil Khair" instead of old name
- ✅ Arabic subtitle is displayed correctly
- ✅ Footer shows updated branding
- ✅ Page title is "Bil Khair - بالخير"

### 2. Admin System Settings
- ✅ Login as admin: `admin@example.com` / `password`
- ✅ Navigate to Admin Dashboard
- ✅ Click "⚙️ System Settings" tab
- ✅ Test platform branding changes
- ✅ Test lottery configuration
- ✅ Test UI color customization
- ✅ Test import/export functionality

### 3. Real-time Updates
- ✅ Change primary color in admin settings
- ✅ Verify color applies immediately to UI
- ✅ Change platform name and see updates
- ✅ Test reset to defaults functionality

## 📞 Next Steps

1. **Start Services:** Use Method 1 (manual start) first
2. **Verify Backend:** Check `http://localhost:8001/api/health`
3. **Verify Frontend:** Check `http://localhost:4200`
4. **Test Admin Features:** Login and explore System Settings
5. **Report Issues:** If any step fails, note the specific error message

The Bil Khair platform should now be fully functional with all the enhanced admin dashboard features and real-time configuration capabilities!
