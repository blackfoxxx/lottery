#!/bin/bash

# Category-Based Home Screen Verification Script
echo "🎯 Testing Category-Based Home Screen Implementation..."
echo "=================================================="

# Test backend API
echo "📡 Testing Backend API..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health 2>/dev/null || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend API: Healthy (Status: $BACKEND_STATUS)"
else
    echo "❌ Backend API: Not responding (Status: $BACKEND_STATUS)"
fi

# Test products endpoint
echo "📦 Testing Products API..."
PRODUCTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/products 2>/dev/null || echo "000")

if [ "$PRODUCTS_STATUS" = "200" ]; then
    echo "✅ Products API: Working (Status: $PRODUCTS_STATUS)"
    
    # Get product count and categories
    PRODUCTS_DATA=$(curl -s http://localhost:8001/api/products 2>/dev/null)
    TOTAL_PRODUCTS=$(echo "$PRODUCTS_DATA" | jq length 2>/dev/null || echo "N/A")
    GOLDEN_COUNT=$(echo "$PRODUCTS_DATA" | jq '[.[] | select(.ticket_category == "golden")] | length' 2>/dev/null || echo "N/A")
    SILVER_COUNT=$(echo "$PRODUCTS_DATA" | jq '[.[] | select(.ticket_category == "silver")] | length' 2>/dev/null || echo "N/A")
    BRONZE_COUNT=$(echo "$PRODUCTS_DATA" | jq '[.[] | select(.ticket_category == "bronze")] | length' 2>/dev/null || echo "N/A")
    
    echo "   📊 Total Products: $TOTAL_PRODUCTS"
    echo "   🥇 Golden Products: $GOLDEN_COUNT"
    echo "   🥈 Silver Products: $SILVER_COUNT"
    echo "   🥉 Bronze Products: $BRONZE_COUNT"
else
    echo "❌ Products API: Not responding (Status: $PRODUCTS_STATUS)"
fi

# Test frontend
echo "🌐 Testing Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 2>/dev/null || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: Accessible (Status: $FRONTEND_STATUS)"
else
    echo "❌ Frontend: Not accessible (Status: $FRONTEND_STATUS)"
fi

echo ""
echo "🎉 Category-Based Home Screen Verification Complete!"
echo "=================================================="
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:4200"
echo "   Backend:  http://localhost:8001/api"
echo ""
echo "🧪 Test Steps:"
echo "   1. Visit http://localhost:4200"
echo "   2. View enhanced home screen with platform info"
echo "   3. Click on any lottery category (Golden/Silver/Bronze)"
echo "   4. Verify products are filtered by category"
echo "   5. Test 'Back to Categories' navigation"
echo ""
echo "🔐 Test Credentials:"
echo "   User: test@example.com / password"
echo "   Admin: admin@example.com / password"
echo ""
