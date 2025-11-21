# Belkhair Web App - TODO

## Core Features
- [x] Homepage with hero section and featured products
- [x] Product catalog page with grid layout
- [x] Product detail page with images and description
- [x] Shopping cart functionality (basic)

## UI Components
- [x] Header with navigation and cart icon
- [x] Footer with links and info
- [x] Product card component
- [x] Category filter sidebar
- [x] Search bar

## Integration
- [x] Connect to Laravel backend API
- [x] Fetch products from API
- [x] Fetch categories from API

## Styling
- [x] Dark theme with brand colors (#1a1a2e, #e74c3c)
- [x] Consistent typography and spacing
- [x] Smooth transitions and animations
- [x] Mobile-first responsive design
- [x] Arabic RTL layout support (fonts loaded, needs full implementation)

## Authentication
- [x] Login functionality
- [x] Registration functionality
- [x] User profile management
- [x] Protected admin routes

## Payment Integration
- [ ] Stripe payment gateway
- [ ] Payment confirmation
- [ ] Order receipt generation

## Lottery System
- [ ] Automated ticket generation on purchase
- [ ] Ticket tracking for users
- [ ] Draw results display

## Admin Features
- [ ] User management
- [ ] Category management
- [ ] Brand management
- [ ] System settings

## Bug Fixes
- [x] Fix Vite WebSocket HMR connection error for proxied environment

## Shopping Cart Implementation
- [x] Create CartContext with localStorage persistence
- [x] Build cart sidebar UI component
- [x] Add quantity management (increase/decrease)
- [x] Calculate totals and lottery tickets
- [x] Integrate cart across all pages

## Product Search Implementation
- [x] Create useDebounce hook for search optimization
- [x] Create useProductSearch hook with API integration
- [x] Build SearchResults dropdown component
- [x] Integrate search into Header with click-outside detection
- [ ] Add mobile-responsive search modal

## Checkout Implementation
- [x] Update Cart page with full cart view and checkout button
- [x] Create Checkout page with shipping address form
- [x] Add payment method selection (Credit Card, PayPal, Cash on Delivery)
- [x] Display order summary with totals and lottery tickets
- [x] Create OrderConfirmation page with order details
- [x] Form validation for shipping information

## Admin Dashboard Implementation
- [x] Create AdminLayout with sidebar navigation
- [x] Build Dashboard page with statistics cards
- [x] Create Products management page with data table
- [x] Create Orders management page with status filtering
- [x] Inventory tracking with low stock alerts in dashboard
- [ ] Add product create/edit forms
- [ ] Add order detail view with status updates
- [ ] Add analytics charts for sales and revenue

## User Authentication
- [x] Create AuthContext with JWT token management
- [x] Build Login modal component
- [x] Build Register modal component
- [x] Add protected routes for admin
- [x] Store auth token in localStorage
- [x] Add user profile dropdown in header

## Product Management Forms
- [x] Create ProductForm component for add/edit
- [x] Add image upload functionality (URL input)
- [x] Category and brand selection dropdowns
- [x] Lottery ticket configuration
- [x] SKU auto-generation
- [x] Form validation

## Multi-Language Support
- [x] Create LanguageContext for i18n
- [x] Add language switcher component
- [x] Create translation files (Arabic, English, Kurdish)
- [x] Implement RTL layout for Arabic
- [x] Translate header and common UI text
- [x] Add Arabic fonts (Cairo)

## Backend Integration
- [x] Create order history page
- [x] Connect orders to backend
- [ ] Update login/register to use Laravel API
- [ ] Implement JWT token handling
- [ ] Add API error handling

## Product Reviews
- [ ] Create review submission form
- [ ] Display reviews on product detail page
- [ ] Add star ratings
- [ ] Implement helpful/not helpful voting

## Lottery Management System
- [x] Create lottery tickets admin page
- [x] Add ticket generation system
- [x] Create lottery draws admin page
- [x] Implement draw creation and management
- [x] Add winner selection algorithm
- [ ] Create lottery results page
- [ ] Add ticket tracking for users
- [ ] Implement automated ticket generation on purchase
- [ ] CSV import/export for tickets
