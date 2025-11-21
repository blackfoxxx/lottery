# Belkhair Web App - TODO

## Core Features
- [x] Homepage with hero section and featured products
- [x] Product catalog page with grid layout
- [x] Product detail page with images and description
- [x] Shopping cart functionality (basic)
- [ ] User authentication (login/register)
- [ ] Checkout process
- [ ] Order confirmation page
- [ ] User profile/dashboard
- [ ] Lottery system integration
- [ ] Multi-language support (Arabic RTL, English)
- [ ] Responsive design for mobile/tablet/desktop

## UI Components
- [x] Header with navigation and cart icon
- [x] Footer with links and info
- [x] Product card component
- [x] Category filter sidebar
- [x] Search bar
- [ ] Language switcher
- [ ] Cart sidebar/modal
- [ ] Login/Register modal
- [ ] Product image gallery
- [ ] Lottery ticket display

## Integration
- [x] Connect to Laravel backend API
- [x] Fetch products from API
- [x] Fetch categories from API
- [ ] Handle authentication with API
- [ ] Submit orders to API
- [ ] Error handling and loading states

## Styling
- [x] Dark theme with brand colors (#1a1a2e, #e74c3c)
- [x] Consistent typography and spacing
- [x] Smooth transitions and animations
- [x] Mobile-first responsive design
- [ ] Arabic RTL layout support (fonts loaded, needs implementation)

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
