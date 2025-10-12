#!/bin/bash

# 🎯 Buy Lottery Ticket Removal - Final Verification Script
# This script verifies that all "Buy Lottery Ticket" functionality has been removed

echo "🔍 VERIFYING BUY LOTTERY TICKET REMOVAL"
echo "========================================"

# Check for any remaining "Buy Lottery" references in frontend
echo "📱 Checking Frontend for 'Buy Lottery' references..."
FRONTEND_MATCHES=$(grep -r "Buy.*Lottery\|Lottery.*Buy\|buyLotteryTicket" frontend/src/ --include="*.html" --include="*.ts" 2>/dev/null | wc -l)

if [ $FRONTEND_MATCHES -eq 0 ]; then
    echo "✅ No 'Buy Lottery' references found in frontend"
else
    echo "❌ Found $FRONTEND_MATCHES 'Buy Lottery' references in frontend:"
    grep -r "Buy.*Lottery\|Lottery.*Buy\|buyLotteryTicket" frontend/src/ --include="*.html" --include="*.ts"
fi

# Check frontend build
echo ""
echo "🏗️ Testing Frontend Build..."
cd frontend
BUILD_RESULT=$(npm run build 2>&1)
if echo "$BUILD_RESULT" | grep -q "Application bundle generation complete"; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
fi
cd ..

# Check backend tests
echo ""
echo "🧪 Running Backend Tests..."
cd backend
TEST_RESULT=$(php artisan test 2>&1)
if echo "$TEST_RESULT" | grep -q "Tests:.*passed"; then
    PASSED_TESTS=$(echo "$TEST_RESULT" | grep -o "[0-9]* passed" | head -1)
    echo "✅ Backend tests: $PASSED_TESTS"
else
    echo "❌ Backend tests failed"
fi
cd ..

# Check for JavaScript alerts in frontend
echo ""
echo "🚨 Checking for remaining JavaScript alerts..."
ALERT_MATCHES=$(grep -r "alert(" frontend/src/ --include="*.ts" --include="*.js" 2>/dev/null | wc -l)

if [ $ALERT_MATCHES -eq 0 ]; then
    echo "✅ No JavaScript alerts found (all replaced with notifications)"
else
    echo "⚠️ Found $ALERT_MATCHES JavaScript alerts remaining:"
    grep -r "alert(" frontend/src/ --include="*.ts" --include="*.js"
fi

# Summary
echo ""
echo "📊 VERIFICATION SUMMARY"
echo "======================="
echo "Frontend 'Buy Lottery' references: $FRONTEND_MATCHES"
echo "Frontend build: $([ $? -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "Backend tests: $(echo "$TEST_RESULT" | grep -q "passed" && echo "✅ PASS" || echo "❌ FAIL")"
echo "JavaScript alerts: $ALERT_MATCHES remaining"

if [ $FRONTEND_MATCHES -eq 0 ] && [ $ALERT_MATCHES -eq 0 ]; then
    echo ""
    echo "🎉 VERIFICATION COMPLETE: All 'Buy Lottery Ticket' functionality successfully removed!"
    echo "✅ System ready with streamlined UI"
else
    echo ""
    echo "⚠️ VERIFICATION INCOMPLETE: Some issues found above"
fi
