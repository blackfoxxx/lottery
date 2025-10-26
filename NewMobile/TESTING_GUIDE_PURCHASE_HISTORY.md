# 🧪 Testing Guide - Purchase History & Arabic Translations

## Quick Test Steps

### 1. Reload the App
```bash
# In the Expo terminal, press 'r' to reload
# Or shake your device and press "Reload"
```

### 2. Test Purchase History Navigation
1. Go to **Profile** tab
2. Tap on **"Purchase History"** under Account section
3. ✅ Should navigate to Purchase History screen
4. ✅ Should show empty state if no orders exist
5. ✅ Tap "Browse Products" should navigate to Products screen

### 3. Test Arabic Translations
1. Go to **Profile** tab
2. Toggle **Language** to Arabic (العربية)
3. ✅ Check Profile screen translations:
   - "Member since" → "عضو منذ"
   - "Wins" → "الفوزات"
   - "Purchases" → "المشتريات"
   - Theme toggle shows "داكن" or "فاتح"
4. ✅ Navigate to Purchase History
   - "Purchase History" → "سجل المشتريات"
   - "No Purchases Yet" → "لا توجد مشتريات بعد"
   - "Browse Products" → "تصفح المنتجات"
5. ✅ Verify RTL layout is correct

### 4. Test Theme Support
1. Toggle **Dark/Light** theme in Profile
2. ✅ Verify theme label changes: "Dark" / "Light" in English, "داكن" / "فاتح" in Arabic
3. Navigate to Purchase History
4. ✅ Verify colors adapt correctly to theme

### 5. Test with Backend Data (if available)
1. Make a purchase to generate an order
2. Go to Purchase History
3. ✅ Should show order card with:
   - Product name
   - Quantity, price, total
   - Status badge (colored)
   - Ticket numbers
   - Order ID
4. ✅ Pull down to refresh orders

### 6. Test Status Badges
If you have test orders with different statuses:
- ✅ **Completed**: Green badge
- ✅ **Pending**: Orange badge
- ✅ **Failed**: Red badge
- ✅ **Cancelled**: Gray badge

---

## Expected Behavior

### Empty State:
```
📦 Icon
"No Purchases Yet"
"Start shopping to see your purchase history here"
[Browse Products] button
```

### With Orders:
```
┌─────────────────────────────────┐
│ Product Name                    │
│ Jan 15, 2025                    │
│ [Completed] ← Green badge       │
│                                 │
│ Quantity: 2                     │
│ Price: IQD 50,000              │
│ Total: IQD 100,000             │
│                                 │
│ 🎟️ Lottery Tickets:            │
│ [T-123456] [T-123457]          │
│                                 │
│ Order ID: #123                  │
└─────────────────────────────────┘
```

---

## Troubleshooting

### Issue: "Coming Soon" alert still appears
**Fix**: Make sure you've reloaded the app (press 'r' in Expo)

### Issue: Translation keys showing instead of text
**Fix**: Check that both English and Arabic translations have the same keys in LanguageContext.tsx

### Issue: Orders not loading
**Fix**: 
1. Check backend is running at `http://10.113.107.90:8000`
2. Check `/api/orders` endpoint exists
3. Check network connection

### Issue: Status colors not showing
**Fix**: Orders must have valid status: 'pending', 'completed', 'failed', or 'cancelled'

---

## API Testing (Backend)

Test the orders endpoint directly:
```bash
curl http://10.113.107.90:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
[
  {
    "id": 1,
    "product_name": "Test Product",
    "quantity": 2,
    "price": "50000.00",
    "total": "100000.00",
    "status": "completed",
    "created_at": "2025-01-15T10:30:00Z",
    "tickets": [
      {
        "id": 1,
        "ticket_number": "T-123456"
      },
      {
        "id": 2,
        "ticket_number": "T-123457"
      }
    ]
  }
]
```

---

## ✅ Success Criteria

- [ ] Purchase History screen is accessible from Profile
- [ ] Empty state displays correctly
- [ ] Browse Products button navigates correctly
- [ ] All Profile text is translated in Arabic
- [ ] RTL layout works in Arabic
- [ ] Theme toggle shows correct labels
- [ ] Member stats show translated labels
- [ ] Pull-to-refresh works
- [ ] Status badges show correct colors
- [ ] Ticket numbers display properly
- [ ] No errors in console

---

**All features should work perfectly! 🎉**
