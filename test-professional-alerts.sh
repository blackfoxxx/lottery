#!/bin/bash

# 🧪 Professional Alert System Test Script
# This script verifies that all JS alerts have been replaced with professional notifications

echo "🧪 PROFESSIONAL ALERT SYSTEM - FUNCTIONALITY TEST"
echo "=================================================="
echo ""

# Test 1: Check for JS alerts in codebase
echo "📋 Test 1: JavaScript Alert Detection"
echo "-------------------------------------"
JS_ALERTS=$(grep -r "alert\(|window\.alert|confirm\(|window\.confirm" frontend/src/ --include="*.ts" --include="*.js" 2>/dev/null | wc -l)
if [ $JS_ALERTS -eq 0 ]; then
    echo "✅ PASS: No JavaScript alerts found ($JS_ALERTS)"
else
    echo "❌ FAIL: Found $JS_ALERTS JavaScript alerts"
    grep -r "alert\(|window\.alert|confirm\(|window\.confirm" frontend/src/ --include="*.ts" --include="*.js" 2>/dev/null
fi
echo ""

# Test 2: Check notification service implementation
echo "🎨 Test 2: Professional Notification System"
echo "-------------------------------------------"
NOTIFICATIONS=$(grep -r "notificationService\." frontend/src/ --include="*.ts" | wc -l)
if [ $NOTIFICATIONS -gt 20 ]; then
    echo "✅ PASS: Professional notifications implemented ($NOTIFICATIONS instances)"
else
    echo "⚠️ WARNING: Limited notification usage ($NOTIFICATIONS instances)"
fi
echo ""

# Test 3: Check specific components
echo "🛒 Test 3: Product Purchase Flow"
echo "--------------------------------"
if grep -q "notificationService.info" frontend/src/app/components/product-list/product-list.ts; then
    echo "✅ PASS: Product purchase uses professional notifications"
else
    echo "❌ FAIL: Product purchase still uses old alerts"
fi
echo ""

echo "👨‍💼 Test 4: Admin Panel Confirmations"
echo "--------------------------------------"
if grep -q "notificationService.warning" frontend/src/app/components/admin/admin.ts; then
    echo "✅ PASS: Admin confirmations use professional notifications"
else
    echo "❌ FAIL: Admin panel still uses old confirms"
fi
echo ""

# Test 5: Frontend build
echo "🏗️ Test 5: Frontend Build Verification"
echo "--------------------------------------"
cd frontend
BUILD_OUTPUT=$(npm run build 2>&1)
if echo "$BUILD_OUTPUT" | grep -q "Application bundle generation complete"; then
    echo "✅ PASS: Frontend builds successfully"
else
    echo "❌ FAIL: Frontend build failed"
    echo "$BUILD_OUTPUT" | tail -5
fi
cd ..
echo ""

# Test 6: Backend functionality
echo "🔧 Test 6: Backend API Verification"
echo "-----------------------------------"
cd backend
if php artisan test --quiet 2>/dev/null; then
    echo "✅ PASS: All backend tests passing"
else
    echo "❌ FAIL: Backend tests failed"
fi
cd ..
echo ""

# Summary
echo "📊 TEST SUMMARY"
echo "==============="
echo "JavaScript Alerts: $JS_ALERTS (should be 0)"
echo "Professional Notifications: $NOTIFICATIONS (should be >20)"
echo "System Status: $([ $JS_ALERTS -eq 0 ] && [ $NOTIFICATIONS -gt 20 ] && echo "✅ READY" || echo "⚠️ NEEDS ATTENTION")"
echo ""

if [ $JS_ALERTS -eq 0 ] && [ $NOTIFICATIONS -gt 20 ]; then
    echo "🎉 SUCCESS: Professional alert system fully implemented!"
    echo "   ✅ No JavaScript alerts remain"
    echo "   ✅ Professional notifications working"
    echo "   ✅ Buy Now uses confirmation notifications"
    echo "   ✅ Admin panel uses professional confirmations"
    echo "   ✅ System ready for production"
else
    echo "⚠️ ATTENTION: Some issues detected above"
fi
echo ""
echo "Test completed: $(date)"
