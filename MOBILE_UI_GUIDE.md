# Belkhair Mobile App - UI Guide

## Overview

The Belkhair React Native mobile app provides a complete e-commerce experience with lottery system integration. Built with Expo and React Native, it features a modern dark theme with blue accents and seamless navigation.

## App Architecture

**Platform**: React Native with Expo
**Navigation**: React Navigation (Stack + Bottom Tabs)
**State Management**: React Context API
**Storage**: AsyncStorage for offline persistence
**API Integration**: Axios with Laravel backend

---

## 📱 Screen-by-Screen UI Overview

### 1. Home Screen (`HomeScreen.tsx`)
**Route**: Main tab - Home icon

**UI Elements**:
- **Lottery Banner** (Top section)
  - Blue gradient background (navy to blue)
  - Golden trophy icon with dashed circle
  - Prize amount: "$10,000 Grand Prize"
  - Live countdown timer (Days, Hours, Minutes, Seconds)
  - Animated countdown numbers with scale effect
  - Tickets issued counter
  - Red "View My Tickets" button
  - Carousel with pagination dots

- **Recent Winners Banner**
  - Orange gradient background
  - Trophy icon on left
  - Winner name and ticket number
  - Prize amount display
  - Carousel rotation with pagination

- **Product Carousel**
  - Horizontal scrolling FlatList
  - Product cards with images
  - Product names and ratings (stars)
  - Original price with strikethrough
  - Discounted price in green
  - "Add to Cart" button on each card
  - "View All" link to products page

- **New Arrivals Section**
  - Background image with overlay
  - "New Arrivals" heading
  - "Check out our latest products" subtitle
  - Blue "Shop Now" button

- **Feature Cards** (3 cards)
  - Premium Products (cart icon)
  - Lottery Tickets (ticket icon)
  - Best Deals (star icon)
  - Each with icon, title, description

**Color Scheme**:
- Background: Dark (#1a1a1a)
- Primary: Blue (#3b82f6)
- Accent: Golden yellow (#fbbf24)
- Success: Green (#10b981)
- Text: White/Gray

---

### 2. Products Screen (`ProductsScreen.tsx`)
**Route**: Main tab - Grid icon

**UI Elements**:
- **Header**
  - "Products" title
  - Search icon button
  - Filter icon button

- **Product Grid**
  - 2-column layout
  - Product cards with:
    - Product image (lazy loaded)
    - Product name
    - Star rating with count
    - Price with discount badge
    - Social proof badge ("X viewing", "Y purchased")
    - Heart icon (wishlist)
    - Compare checkbox
    - "Add to Cart" button

- **Filter Options** (when filter pressed)
  - Category selection
  - Price range slider
  - Rating filter
  - Stock availability toggle

- **Empty State**
  - Icon placeholder
  - "No products found" message
  - "Browse all products" button

**Interactions**:
- Tap product card → Product Detail Modal
- Tap heart → Add/remove from wishlist
- Tap compare → Add to comparison
- Tap "Add to Cart" → Add to cart with toast

---

### 3. Lottery Purchase Screen (`LotteryPurchaseScreen.tsx`)
**Route**: Stack screen (modal style)

**UI Elements**:
- **Header**
  - Blue gradient background
  - Back arrow button
  - "Purchase Lottery Tickets" title

- **Lottery Info Card**
  - Draw name (e.g., "Golden Draw")
  - Prize amount with trophy icon
  - Draw date with calendar icon
  - White card with shadow

- **Quantity Selector**
  - Large number display (center)
  - Minus button (left)
  - Plus button (right)
  - Direct text input option
  - Quick select buttons: 5, 10, 20, 50 tickets
  - Blue active state for selected quick amount

- **Price Breakdown**
  - "Price per ticket" row ($10)
  - "Quantity" row
  - Divider line
  - "Total" row (bold, large)

- **Payment Method Selection**
  - Three options with radio buttons:
    1. Credit/Debit Card (card icon)
    2. PayPal (PayPal icon)
    3. Wallet Balance (wallet icon)
  - Blue border for selected method
  - Checkmark icon on selected

- **Complete Purchase Button**
  - Full-width green button
  - "Complete Purchase" text
  - Arrow right icon
  - Bottom of screen

- **Success Modal**
  - Green checkmark icon
  - "Purchase Successful!" heading
  - Confirmation message
  - Ticket numbers generated
  - Auto-dismiss after 3 seconds

**Flow**:
1. Select quantity (tap +/- or quick buttons)
2. Choose payment method
3. Tap "Complete Purchase"
4. See success modal
5. Auto-navigate back to home

---

### 4. My Tickets Screen (`MyTicketsScreen.tsx`)
**Route**: Stack screen

**UI Elements**:
- **Header**
  - Blue gradient background
  - Back arrow button
  - "My Lottery Tickets" title

- **Filter Tabs**
  - All / Active / Past
  - Blue underline for active tab

- **Ticket Cards**
  - Draw name (e.g., "Golden Draw")
  - Quantity badge
  - Status badge (Active/Won/Lost)
    - Blue for active
    - Green for won
    - Gray for lost
  - Ticket numbers in blue badges
  - Draw date with calendar icon
  - Purchase date with clock icon
  - Prize banner for won tickets

- **Ticket Detail Modal** (on tap)
  - Full ticket information
  - All ticket numbers displayed
  - Win banner with congratulations
  - Prize amount
  - Close button

- **Empty State**
  - Ticket icon
  - "No lottery tickets yet"
  - "Purchase tickets to participate" message
  - "Buy Tickets" button

**Status Colors**:
- Active: Blue (#3b82f6)
- Won: Green (#10b981)
- Lost: Gray (#6b7280)

---

### 5. Lottery Results Screen (`LotteryResultsScreen.tsx`)
**Route**: Stack screen

**UI Elements**:
- **Header**
  - Blue gradient background
  - Back arrow button
  - "Lottery Results" title

- **Check My Tickets Button**
  - Green button at top
  - Search icon
  - "Check My Tickets" text
  - Compares user tickets with winning numbers

- **Past Draw Results Cards**
  - Draw name
  - Draw date with calendar icon
  - Prize amount with trophy icon
  - Winning numbers (green badges)
  - Winner name
  - Total tickets sold

- **Check Results Modal**
  - **Win Scenario**:
    - Trophy icon (gold)
    - "Congratulations!" heading
    - "You won [amount]!" message
    - List of winning ticket numbers
    - "View My Tickets" button
  - **No Win Scenario**:
    - Info icon (blue)
    - "No Winning Tickets" heading
    - Encouraging message
    - "Buy More Tickets" button
  - Close button (X)

**Interactions**:
- Tap "Check My Tickets" → Automatic matching
- Tap winning card → View details
- Tap "View My Tickets" → Navigate to MyTicketsScreen
- Tap "Buy More Tickets" → Navigate to LotteryPurchaseScreen

---

### 6. Cart Screen (`CartScreen.tsx`)
**Route**: Main tab - Cart icon

**UI Elements**:
- **Header**
  - "Shopping Cart" title
  - Item count badge

- **Cart Items List**
  - Product image (left)
  - Product name
  - Price per unit
  - Quantity selector (- / number / +)
  - Subtotal
  - Remove button (trash icon)

- **Cart Summary Card**
  - Subtotal row
  - Shipping row
  - Tax row
  - Divider
  - Total row (bold, large)
  - Lottery tickets earned badge

- **Checkout Button**
  - Full-width blue button
  - "Proceed to Checkout" text
  - Arrow right icon

- **Empty Cart State**
  - Cart icon
  - "Your cart is empty"
  - "Start shopping to add items" message
  - "Browse Products" button

**Interactions**:
- Tap +/- → Update quantity
- Tap trash → Remove item with confirmation
- Tap "Proceed to Checkout" → Navigate to checkout

---

### 7. Profile Screen (`ProfileScreen.tsx`)
**Route**: Main tab - Person icon

**UI Elements**:
- **Profile Header**
  - Avatar circle with initials
  - User name
  - Email address
  - Edit profile button

- **Menu Options** (List items)
  - My Orders (with count badge)
  - My Lottery Tickets (with count badge)
  - Wishlist (with count badge)
  - Payment Methods
  - Shipping Addresses
  - Notifications Settings
  - Language & Region
  - Help & Support
  - About
  - Logout (red text)

- **Each menu item**:
  - Icon on left
  - Label text
  - Badge (if applicable)
  - Chevron right arrow
  - Divider line

**Interactions**:
- Tap "Edit Profile" → Edit profile form
- Tap "My Orders" → Orders list
- Tap "My Lottery Tickets" → MyTicketsScreen
- Tap "Wishlist" → WishlistScreen
- Tap "Logout" → Confirmation dialog → Login screen

---

### 8. Wishlist Screen (`WishlistScreen.tsx`)
**Route**: Main tab - Heart icon

**UI Elements**:
- **Header**
  - "My Wishlist" title
  - Item count

- **Wishlist Grid**
  - 2-column layout
  - Product cards similar to Products screen
  - Heart icon (filled, red)
  - "Add to Cart" button
  - "Remove" button (X)

- **Empty Wishlist State**
  - Heart icon
  - "Your wishlist is empty"
  - "Save items you love" message
  - "Browse Products" button

**Interactions**:
- Tap heart → Remove from wishlist
- Tap "Add to Cart" → Add to cart + toast
- Tap product → Product Detail Modal

---

### 9. Compare Screen (`CompareScreen.tsx`)
**Route**: Main tab - Compare icon

**UI Elements**:
- **Header**
  - "Compare Products" title
  - Product count (max 4)

- **Comparison Table**
  - Horizontal scroll
  - Product images at top
  - Specification rows:
    - Name
    - Price
    - Rating
    - Brand
    - Category
    - Stock status
    - Lottery tickets
  - "Add to Cart" button per product
  - "Remove" button per product

- **Empty Compare State**
  - Compare icon
  - "No products to compare"
  - "Add products from listings" message
  - "Browse Products" button

**Interactions**:
- Swipe left/right → Scroll comparison table
- Tap "Add to Cart" → Add to cart
- Tap "Remove" → Remove from comparison

---

### 10. Gift Cards Screen (`GiftCardsScreen.tsx`)
**Route**: Main tab - Gift icon

**UI Elements**:
- **Header**
  - "Gift Cards" title
  - Gift icon

- **Preset Amounts** (Grid)
  - $25, $50, $100, $200, $500 cards
  - Blue border for selected
  - Checkmark on selected

- **Custom Amount Input**
  - Text input field
  - "$" prefix
  - Placeholder: "Enter custom amount"
  - Min: $10, Max: $1000

- **Recipient Information Form**
  - Recipient name input
  - Recipient email input
  - Personal message textarea

- **Purchase Button**
  - Full-width blue button
  - "Purchase Gift Card" text
  - Price display

- **How It Works Section**
  - Icon with steps
  - Numbered list of instructions

**Flow**:
1. Select preset or enter custom amount
2. Fill recipient information
3. Add personal message (optional)
4. Tap "Purchase Gift Card"
5. Payment processing
6. Success confirmation
7. Email sent to recipient

---

### 11. Bundles Screen (`BundlesScreen.tsx`)
**Route**: Main tab - Cube icon

**UI Elements**:
- **Header**
  - "Product Bundles" title
  - Bundle icon

- **Bundle Cards**
  - Bundle name
  - Bundle description
  - Product images (grid)
  - Discount badge (percentage or fixed)
  - Original price (strikethrough)
  - Bundle price (green, large)
  - Savings amount
  - "Add Bundle to Cart" button

- **Why Buy Bundles Section**
  - Icon with benefits
  - Bullet points of advantages

- **Empty Bundles State**
  - Cube icon
  - "No bundles available"
  - "Check back later" message

**Interactions**:
- Tap bundle card → Expand details
- Tap "Add Bundle to Cart" → Add all products
- Toast confirmation

---

### 12. Loyalty Screen (`LoyaltyScreen.tsx`)
**Route**: Accessible from Profile

**UI Elements**:
- **Tier Card**
  - Current tier badge (Bronze/Silver/Gold/Platinum)
  - Points balance (large number)
  - Progress bar to next tier
  - Points needed for next tier

- **Tier Benefits**
  - List of current tier perks
  - Icon for each benefit
  - Checkmark for active benefits

- **Points History**
  - Timeline of points earned/redeemed
  - Transaction type
  - Points amount (+/-)
  - Date and time
  - Running balance

- **Rewards Catalog**
  - Redeemable rewards cards
  - Points cost
  - Reward description
  - "Redeem" button

**Tier Colors**:
- Bronze: #cd7f32
- Silver: #c0c0c0
- Gold: #ffd700
- Platinum: #e5e4e2

---

### 13. Login Screen (`LoginScreen.tsx`)
**Route**: Auth stack

**UI Elements**:
- **Logo**
  - Belkhair logo at top
  - App name

- **Login Form**
  - Email input with icon
  - Password input with show/hide toggle
  - "Remember me" checkbox
  - "Forgot password?" link

- **Login Button**
  - Full-width blue button
  - "Sign In" text
  - Loading spinner when processing

- **Demo Credentials Display**
  - Info box with sample logins
  - Admin and Customer credentials
  - Copy button for each

- **Social Login Options**
  - "Or continue with" divider
  - Facebook button
  - Google button
  - Apple button

- **Sign Up Link**
  - "Don't have an account? Sign Up"
  - Blue "Sign Up" text

**Validation**:
- Email format validation
- Password minimum length
- Error messages below fields

---

### 14. Register Screen (`RegisterScreen.tsx`)
**Route**: Auth stack

**UI Elements**:
- **Logo**
  - Belkhair logo at top

- **Registration Form**
  - Full name input
  - Email input
  - Phone number input
  - Password input with show/hide
  - Confirm password input with show/hide
  - Terms & conditions checkbox

- **Register Button**
  - Full-width blue button
  - "Create Account" text
  - Loading spinner when processing

- **Sign In Link**
  - "Already have an account? Sign In"
  - Blue "Sign In" text

**Validation**:
- All fields required
- Email format validation
- Phone number format
- Password strength indicator
- Password match validation
- Terms acceptance required

---

## 🎨 Design System

### Colors
```typescript
Primary: #3b82f6 (Blue)
Secondary: #10b981 (Green)
Accent: #fbbf24 (Golden Yellow)
Background: #1a1a1a (Dark)
Card Background: #2d2d2d
Text Primary: #ffffff
Text Secondary: #9ca3af
Border: #374151
Error: #ef4444
Success: #10b981
Warning: #f59e0b
```

### Typography
```typescript
Heading 1: 28px, Bold
Heading 2: 24px, Bold
Heading 3: 20px, SemiBold
Body: 16px, Regular
Caption: 14px, Regular
Small: 12px, Regular
```

### Spacing
```typescript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Border Radius
```typescript
Small: 8px
Medium: 12px
Large: 16px
Full: 9999px (circle)
```

### Shadows
```typescript
Small: elevation: 2
Medium: elevation: 4
Large: elevation: 8
```

---

## 🔄 Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack (if not logged in)
│   ├── Login
│   └── Register
│
└── Main Tabs (if logged in)
    ├── Home Tab
    │   └── HomeScreen
    │
    ├── Products Tab
    │   └── ProductsScreen
    │
    ├── Cart Tab
    │   └── CartScreen
    │
    ├── Wishlist Tab
    │   └── WishlistScreen
    │
    ├── Compare Tab
    │   └── CompareScreen
    │
    ├── Gift Cards Tab
    │   └── GiftCardsScreen
    │
    ├── Bundles Tab
    │   └── BundlesScreen
    │
    └── Profile Tab
        └── ProfileScreen

Modal Screens (Stack)
├── LotteryPurchaseScreen
├── MyTicketsScreen
├── LotteryResultsScreen
├── LoyaltyScreen
└── ProductDetailModal (Component)
```

---

## 📦 Components

### Reusable Components
1. **ProductCard** - Product display with image, price, rating
2. **SocialProofBadge** - Live activity indicators
3. **LazyImage** - Lazy loaded images with placeholder
4. **LoadingSpinner** - Consistent loading indicator
5. **EmptyState** - Empty state with icon and message
6. **Button** - Styled button component
7. **Input** - Styled text input
8. **Card** - Container with shadow and padding

---

## 🔐 Authentication Flow

1. **App Launch** → Check AsyncStorage for token
2. **Token Found** → Validate with API → Main Tabs
3. **No Token** → Login Screen
4. **Login Success** → Store token → Main Tabs
5. **Logout** → Clear token → Login Screen

---

## 💾 Data Persistence

### AsyncStorage Keys
```typescript
'@auth_token' - JWT authentication token
'@user_data' - User profile information
'@cart_items' - Shopping cart contents
'@wishlist_items' - Wishlist product IDs
'@compare_items' - Comparison product IDs
'@loyalty_points' - Loyalty points balance
```

---

## 🌐 API Integration

### Base URL
```
Development: http://localhost:8000/api/v1
Production: https://api.belkhair.com/api/v1
```

### Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /products` - Product listings
- `GET /products/{id}` - Product details
- `POST /cart/add` - Add to cart
- `GET /lottery/draws` - Lottery draws
- `POST /lottery/purchase` - Purchase tickets
- `GET /lottery/tickets/{userId}` - User tickets
- `GET /gift-cards` - Gift cards list
- `POST /gift-cards/purchase` - Purchase gift card
- `GET /bundles` - Product bundles

---

## 📱 Platform-Specific Features

### iOS
- Native navigation gestures
- Haptic feedback
- Face ID / Touch ID support
- Apple Pay integration ready

### Android
- Material Design components
- Back button handling
- Google Pay integration ready
- Notification channels

---

## 🚀 Performance Optimizations

1. **FlatList** for long lists with `windowSize` optimization
2. **Image caching** with React Native Fast Image
3. **Memoization** with React.memo and useMemo
4. **Lazy loading** for off-screen content
5. **AsyncStorage** for offline data
6. **Debounced search** to reduce API calls

---

## 📸 Screenshots Locations

To generate actual screenshots:
1. Run the app: `cd /home/ubuntu/belkhair-mobile && npm start`
2. Open Expo Go app on device
3. Scan QR code
4. Navigate through screens
5. Take screenshots

---

## 🎯 Key Features Summary

✅ Complete e-commerce flow (browse → cart → checkout)
✅ Lottery ticket purchase and management
✅ Gift card purchase and delivery
✅ Product bundles with savings
✅ Wishlist and comparison
✅ Loyalty points system
✅ Social proof indicators
✅ Dark theme with blue accents
✅ Smooth animations and transitions
✅ Offline data persistence
✅ Real-time countdown timers
✅ Touch gestures and swipe navigation
✅ Form validation and error handling
✅ Loading states and empty states
✅ Toast notifications for feedback

---

## 📞 Support

For issues or questions about the mobile app UI:
- Check the code in `/home/ubuntu/belkhair-mobile/screens/`
- Review component implementations
- Test on actual devices for best results
- Refer to React Native documentation

---

**Last Updated**: November 25, 2025
**Version**: 1.0.0
**Platform**: React Native (Expo SDK 50+)
