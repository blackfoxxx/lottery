# 🔧 Port 4200 Not Working - Quick Fix Guide

## Problem: Angular Frontend Server Won't Start on Port 4200

### Method 1: Use the Automated Script
```bash
cd /Users/aj/Desktop/iraqi-ecommerce-lottery
./start-frontend-robust.sh
```

### Method 2: Manual Step-by-Step Fix

#### Step 1: Open Terminal
Open your Terminal application

#### Step 2: Navigate to Project
```bash
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend
```

#### Step 3: Check What's Using Port 4200
```bash
lsof -i :4200
```
If something is using it, kill it:
```bash
lsof -ti:4200 | xargs kill -9
```

#### Step 4: Check Node.js and npm
```bash
node --version
npm --version
```
If not found, install Node.js:
```bash
brew install node
```

#### Step 5: Install Dependencies (if needed)
```bash
npm install
```

#### Step 6: Start on Different Port
Try starting on an alternative port:
```bash
# Try port 4201
npm run start-alt

# Or manually specify port
ng serve --port 4201 --host 0.0.0.0

# Or use npm with port override
npm start -- --port 4201
```

#### Step 7: Check for Global Angular CLI
If you get "ng: command not found":
```bash
npm install -g @angular/cli
```

### Method 3: Docker Alternative (if nothing else works)
```bash
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/frontend
docker build -t bil-khair-frontend .
docker run -p 4200:80 bil-khair-frontend
```

## Expected Results

Once working, you should see:
```
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
✔ Compiled successfully.
```

## Access URLs

- **Frontend**: http://localhost:4200 (or alternative port)
- **Backend**: http://localhost:8001 (make sure this is running first)
- **Admin Login**: admin@example.com / password

## Common Issues & Solutions

### Issue 1: "ng: command not found"
**Solution**: Install Angular CLI globally
```bash
npm install -g @angular/cli
```

### Issue 2: "Port 4200 is already in use"
**Solution**: Use different port or kill existing process
```bash
# Use different port
ng serve --port 4201

# Or kill existing process
lsof -ti:4200 | xargs kill -9
```

### Issue 3: "Cannot resolve dependencies"
**Solution**: Clean install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Module not found" errors
**Solution**: Verify Angular installation
```bash
ng version
npm list @angular/core
```

### Issue 5: Backend not responding
Make sure backend is running first:
```bash
cd /Users/aj/Desktop/iraqi-ecommerce-lottery/backend
php artisan serve --port 8001
```

## Verification Steps

1. ✅ Backend running on port 8001
2. ✅ Frontend running on port 4200 (or alternative)
3. ✅ Can access http://localhost:4200
4. ✅ Can see "Bil Khair" branding
5. ✅ Can login as admin and access System Settings

## Need Help?

If these steps don't work:
1. Run the troubleshooting script: `./fix-frontend.sh`
2. Check the console output for specific error messages
3. Try the Docker method as a fallback
4. Ensure both Node.js and PHP are properly installed

## Quick Test Commands

```bash
# Test if ports are free
lsof -i :4200 :4201 :8001

# Test Node.js setup
node --version && npm --version

# Test Angular CLI
ng version

# Test backend
curl http://localhost:8001/api/health
```
