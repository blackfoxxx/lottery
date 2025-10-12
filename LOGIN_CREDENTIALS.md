# 🔐 IRAQI E-COMMERCE & LOTTERY PLATFORM - LOGIN CREDENTIALS

## ✅ **WORKING CREDENTIALS**

### 👤 **Test User Account**
- **Email**: `test@example.com`
- **Password**: `password`
- **Role**: Regular User
- **Admin Access**: No

### 👨‍💼 **Admin Account**  
- **Email**: `admin@example.com`
- **Password**: `password`
- **Role**: Administrator
- **Admin Access**: Yes

### 🤖 **Auto-Generated Test Accounts**
- **Email**: `test-{timestamp}@example.com`
- **Password**: `password123`
- **Role**: Regular User
- **Created**: Automatically when using "Create Test Account" feature

---

## 🚨 **COMMON LOGIN ISSUES**

### **Issue**: "Invalid email or password"
**Solution**: Use the correct passwords:
- For `test@example.com` → use `password`
- For `admin@example.com` → use `password`
- For auto-generated accounts → use `password123`

### **Issue**: Frontend not connecting to backend
**Solution**: Ensure backend is running on `http://localhost:8000`

---

## 🧪 **TESTING LOGIN**

### **Backend API Test**:
```bash
# Test user login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# Admin login  
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

### **Frontend Access**:
- **URL**: http://localhost:4200 (or assigned port)
- **Quick Login**: Use the "Quick Login" button with pre-filled credentials

---

## 🛠️ **TROUBLESHOOTING**

1. **Check Backend Status**: 
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check Database Users**:
   ```bash
   cd backend && php artisan tinker --execute="App\Models\User::all(['email', 'is_admin'])"
   ```

3. **Reset Password** (if needed):
   ```bash
   cd backend && php artisan tinker --execute="
   \$user = App\Models\User::where('email', 'test@example.com')->first();
   \$user->password = Hash::make('password');
   \$user->save();
   echo 'Password updated';
   "
   ```

---

## 📱 **QUICK ACCESS**

**For immediate testing, use these credentials in the frontend:**
- **Email**: `test@example.com`
- **Password**: `password`

**For admin features:**
- **Email**: `admin@example.com`  
- **Password**: `password`

---

*Last Updated: October 6, 2025*  
*Status: ✅ All accounts verified working*
