#!/bin/bash

echo "🔍 LOGIN TROUBLESHOOTING TOOL"
echo "=============================="
echo

echo "📋 Available Users in Database:"
docker exec iraqi_ecommerce_backend php artisan tinker --execute "
\$users = App\Models\User::all(['id', 'name', 'email', 'is_admin']);
foreach (\$users as \$user) {
    echo \$user->id . ' - ' . \$user->name . ' (' . \$user->email . ') - Admin: ' . (\$user->is_admin ? 'Yes' : 'No') . PHP_EOL;
}
"

echo
echo "🔐 Testing Known Working Credentials:"
echo

echo "1. Test User (test@example.com / password):"
RESULT1=$(curl -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}' | jq -r '.user.name // .message')
echo "   Result: $RESULT1"

echo
echo "2. Admin User (admin@example.com / password):"
RESULT2=$(curl -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}' | jq -r '.user.name // .message')
echo "   Result: $RESULT2"

echo
echo "🌐 Frontend Quick Access:"
echo "   1. Visit: http://localhost"
echo "   2. Click 'Login' or navigate to auth section"
echo "   3. Use Quick Login buttons:"
echo "      - '🚀 Quick Login (Test User)' for regular user"
echo "      - '👑 Quick Admin Login' for admin access"

echo
echo "🔧 If manual login fails, try these exact credentials:"
echo "   Email: test@example.com"
echo "   Password: password"
echo "   (no extra spaces or special characters)"

echo
echo "📝 Recent Backend Login Attempts:"
docker-compose logs backend | grep -i login | tail -5

echo
echo "✅ System Status:"
echo "   Frontend: http://localhost ($(curl -s -w "%{http_code}" http://localhost -o /dev/null))"
echo "   Backend: http://localhost:8000 ($(curl -s -w "%{http_code}" http://localhost:8000/api/health -o /dev/null))"
echo "   Database: Connected"
