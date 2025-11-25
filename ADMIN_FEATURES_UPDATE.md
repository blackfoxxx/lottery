# Mobile App Admin Features Update

## Overview

The Belkhair Mobile App has been updated with comprehensive admin management features that sync with the web backend. Admin users can now manage banners, bundles, reviews, and view analytics directly from the mobile app.

## What's New

### 1. tRPC Integration
- **New tRPC Client**: Replaced REST API calls with tRPC for type-safe communication
- **Location**: `services/trpc.ts`
- **Type Definitions**: `types/trpc.ts`
- **Benefits**: Type safety, better error handling, automatic request batching

### 2. Admin Dashboard
- **Screen**: `AdminDashboardScreen.tsx`
- **Access**: Profile → Admin Dashboard (admin users only)
- **Features**:
  - Quick access to all admin tools
  - Overview cards with stats
  - Navigation to management screens

### 3. Banners Management
- **Screen**: `AdminBannersScreen.tsx`
- **Route**: `/AdminBanners`
- **Features**:
  - View all banners with image previews
  - Create new banners
  - Edit existing banners
  - Delete banners
  - Toggle active/inactive status
  - Set display order
  - Pull-to-refresh

### 4. Bundles Management
- **Screen**: `AdminBundlesScreen.tsx`
- **Route**: `/AdminBundles`
- **Features**:
  - View all product bundles
  - Create new bundles
  - Edit existing bundles
  - Delete bundles
  - Toggle active/inactive status
  - Product multi-select
  - Discount type selection (percentage/fixed)
  - Real-time product selection
  - Pull-to-refresh

### 5. Reviews Management
- **Screen**: `AdminReviewsScreen.tsx`
- **Route**: `/AdminReviews`
- **Features**:
  - View all customer reviews
  - Filter by status (pending/approved/rejected)
  - Approve/reject individual reviews
  - Bulk approve/reject
  - Delete reviews
  - Star rating display
  - Helpful votes count
  - Stats dashboard (pending, approved, rejected counts)
  - Pull-to-refresh

### 6. Bundle Analytics
- **Screen**: `AdminAnalyticsScreen.tsx`
- **Route**: `/AdminAnalytics`
- **Features**:
  - Overview metrics (total bundles, active bundles, revenue)
  - Bundle performance table
  - Views, conversions, revenue per bundle
  - Conversion rate calculation
  - Date range filtering (7d, 30d, 90d, all time)
  - Top performing bundle insights
  - Best conversion rate insights
  - Most viewed bundle insights
  - Pull-to-refresh

## API Integration

### Updated Endpoints

All admin features use tRPC endpoints:

**Banners:**
- `banners.list` - Get all banners
- `banners.create` - Create new banner
- `banners.update` - Update banner
- `banners.delete` - Delete banner
- `banners.toggleActive` - Toggle active status

**Bundles:**
- `bundles.list` - Get all bundles
- `bundles.getById` - Get bundle by ID
- `bundles.create` - Create new bundle
- `bundles.update` - Update bundle
- `bundles.delete` - Delete bundle
- `bundles.toggleActive` - Toggle active status

**Reviews:**
- `reviews.list` - Get all reviews
- `reviews.byProduct` - Get reviews by product
- `reviews.create` - Create new review
- `reviews.approve` - Approve review
- `reviews.reject` - Reject review
- `reviews.delete` - Delete review
- `reviews.bulkApprove` - Bulk approve reviews
- `reviews.bulkReject` - Bulk reject reviews

**Bundle Analytics:**
- `bundleAnalytics.overview` - Get overview metrics
- `bundleAnalytics.performance` - Get bundle performance data
- `bundleAnalytics.trackView` - Track bundle view
- `bundleAnalytics.trackConversion` - Track bundle conversion

### Backend URL Configuration

Update the API base URL in `services/trpc.ts`:

```typescript
const API_BASE_URL = 'https://your-backend-url.com/api/trpc';
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd belkhair-mobile
npm install
```

New dependency added:
- `@trpc/client` - tRPC client for React Native

### 2. Configure Backend URL

Edit `services/trpc.ts` and update the `API_BASE_URL` to point to your backend:

```typescript
const API_BASE_URL = 'https://your-backend-url.com/api/trpc';
```

### 3. Test Admin Access

1. Run the app: `npm start`
2. Login with an admin account
3. Navigate to Profile
4. Tap "Admin Dashboard"
5. Test each admin feature

## User Permissions

### Admin Access Control

Admin features are only visible to users with `role === 'admin'`. The admin dashboard link appears in the ProfileScreen menu only for admin users.

**Check in code:**
```typescript
{user?.role === 'admin' && (
  <MenuItem 
    label="Admin Dashboard"
    onPress={() => navigation.navigate('AdminDashboard')}
  />
)}
```

## UI/UX Features

### Common Features Across All Screens

1. **Pull-to-Refresh**: All screens support pull-to-refresh
2. **Loading States**: Proper loading indicators
3. **Error Handling**: User-friendly error messages
4. **Empty States**: Helpful messages when no data exists
5. **Confirmation Dialogs**: Confirm before destructive actions
6. **Success Feedback**: Toast/alert messages on success

### Design System

**Colors:**
- Primary: `#e74c3c` (Red)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Info: `#3498db` (Blue)
- Purple: `#9b59b6` (Bundles)
- Background: `#1a1a2e` (Dark)
- Card Background: `#16213e` (Darker)

**Icons:**
- Ionicons from `@expo/vector-icons`
- Consistent icon usage across screens

## Testing Checklist

### Banners Management
- [ ] View all banners
- [ ] Create new banner with valid data
- [ ] Edit existing banner
- [ ] Delete banner
- [ ] Toggle active/inactive
- [ ] Image preview displays correctly
- [ ] Pull-to-refresh works

### Bundles Management
- [ ] View all bundles
- [ ] Create bundle with products
- [ ] Edit bundle and change products
- [ ] Delete bundle
- [ ] Toggle active/inactive
- [ ] Product selector works
- [ ] Discount calculation correct
- [ ] Pull-to-refresh works

### Reviews Management
- [ ] View all reviews
- [ ] Filter by status
- [ ] Approve pending review
- [ ] Reject pending review
- [ ] Delete review
- [ ] Bulk approve multiple reviews
- [ ] Bulk reject multiple reviews
- [ ] Stats update correctly
- [ ] Pull-to-refresh works

### Bundle Analytics
- [ ] View overview metrics
- [ ] View bundle performance
- [ ] Change date range
- [ ] Conversion rate calculates correctly
- [ ] Insights display top performers
- [ ] Pull-to-refresh works

## Known Limitations

1. **Image Upload**: Currently requires manual image URL input (no image picker)
2. **Offline Mode**: Admin features require internet connection
3. **Real-time Updates**: No WebSocket support, requires manual refresh
4. **Export Features**: No CSV export in mobile (available in web)
5. **Advanced Filters**: Limited filtering compared to web version

## Future Enhancements

1. **Image Upload**: Add camera/gallery image picker
2. **Push Notifications**: Notify admins of pending reviews
3. **Offline Support**: Cache data for offline viewing
4. **Charts**: Add visual charts for analytics
5. **Advanced Filters**: More filtering options
6. **Search**: Global search across all admin features
7. **Batch Operations**: More bulk actions
8. **Export**: CSV/PDF export functionality

## Troubleshooting

### Common Issues

**Issue**: "Failed to load data"
**Solution**: Check backend URL in `services/trpc.ts` and ensure backend is running

**Issue**: "Unauthorized" errors
**Solution**: Ensure user has admin role and valid auth token

**Issue**: Admin dashboard not visible
**Solution**: Verify user role is set to 'admin' in database

**Issue**: tRPC errors
**Solution**: Ensure backend tRPC router matches type definitions in `types/trpc.ts`

**Issue**: Images not loading
**Solution**: Verify image URLs are valid and accessible

## Migration from REST API

The old REST API client in `services/api.ts` is still available for backward compatibility. New admin features use tRPC exclusively.

**Old way (REST):**
```typescript
import { bannersAPI } from '../services/api';
const banners = await bannersAPI.getBanners();
```

**New way (tRPC):**
```typescript
import trpc from '../services/trpc';
const banners = await trpc.banners.list.query();
```

## Support

For issues or questions:
- Check backend logs for API errors
- Verify tRPC router configuration
- Ensure all dependencies are installed
- Test with Postman/curl to isolate frontend vs backend issues

## Version History

**v1.1.0** (Current)
- Added tRPC integration
- Added admin dashboard
- Added banners management
- Added bundles management
- Added reviews management with moderation
- Added bundle analytics dashboard
- Updated API client
- Added type definitions

**v1.0.0**
- Initial release with customer-facing features

---

**Last Updated**: 2025-01-25
**Maintained by**: Development Team
