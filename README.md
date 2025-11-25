# Belkhair E-Commerce Platform - Mobile App

A comprehensive mobile e-commerce application with integrated lottery system, built with React Native and Expo.

## 🌟 Features

### Core E-Commerce
- **Product Catalog** - Browse 34+ products with filtering and search
- **Shopping Cart** - Add products, manage quantities, and checkout
- **Wishlist** - Save favorite products for later
- **Product Comparison** - Compare up to 4 products side-by-side
- **Order Management** - Track orders and view order history
- **Gift Cards** - Purchase and redeem gift cards
- **Product Bundles** - Buy curated product bundles at discounted prices

### Lottery System
- **Lottery Draws** - Participate in lottery draws with every purchase
- **Automatic Ticket Generation** - Earn 1 lottery ticket per $10 spent
- **My Tickets** - View all purchased lottery tickets with status
- **Lottery Results** - Check past draw results and winners
- **Live Countdown** - Real-time countdown to next draw

### Payment & Financial
- **Payment Methods** - Manage credit/debit cards, PayPal, and wallet
- **Wallet System** - Top-up wallet balance and pay with wallet
- **Payment History** - View all transactions with filtering
- **Saved Addresses** - Manage shipping and billing addresses
- **Multiple Payment Options** - Credit card, PayPal, wallet

### User Features
- **User Authentication** - Sign up, sign in, and profile management
- **User Profile** - Edit profile with avatar upload
- **Multi-Language Support** - English, Arabic (RTL), Kurdish
- **Notifications** - Push notifications for orders and lottery wins
- **Security** - Biometric login (Face ID/Fingerprint), 2FA
- **Settings** - Comprehensive settings for notifications, security, and preferences

### Enterprise Features
- **Multi-Language** - Full i18n support with 3 languages
- **RTL Layout** - Automatic right-to-left layout for Arabic
- **Biometric Authentication** - Face ID and Fingerprint login
- **2-Factor Authentication** - Enhanced security with 2FA
- **Password Management** - Change password with validation
- **Address Management** - Add, edit, delete shipping/billing addresses
- **Payment Method Management** - Securely store and manage payment methods
- **Transaction History** - Complete payment history with filtering and export

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Expo Go app on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/blackfoxxx/lottery.git
   cd lottery/belkhair-mobile
   ```

2. **Run the installation script**
   ```bash
   ./install.sh
   ```

   Or manually:
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your configuration:
   ```env
   API_URL=http://localhost:3001/api/v1
   APP_NAME=Belkhair
   APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Scan the QR code**
   
   Open Expo Go on your mobile device and scan the QR code displayed in the terminal.

## 📦 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## 🏗️ Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **State Management**: React Context API
- **Icons**: Ionicons
- **Internationalization**: react-i18next
- **Storage**: AsyncStorage
- **Authentication**: Expo Local Authentication
- **Image Picker**: Expo Image Picker
- **Date Handling**: date-fns

## 📁 Project Structure

```
belkhair-mobile/
├── screens/             # Screen components
│   ├── HomeScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── CartScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── UserProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── PaymentMethodsScreen.tsx
│   ├── AddPaymentMethodScreen.tsx
│   ├── PaymentHistoryScreen.tsx
│   ├── AddressesScreen.tsx
│   ├── AddAddressScreen.tsx
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── LanguageContext.tsx
│   ├── PaymentMethodContext.tsx
│   ├── TransactionContext.tsx
│   ├── AddressContext.tsx
│   └── ...
├── types/               # TypeScript types
│   ├── payment.ts
│   ├── transaction.ts
│   ├── address.ts
│   └── ...
├── i18n.ts              # i18n configuration
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── README.md            # This file
```

## 🎨 Key Features Implementation

### Multi-Language Support
- **3 Languages**: English, Arabic, Kurdish
- **RTL Layout**: Automatic right-to-left layout for Arabic
- **Language Switcher**: Easy language selection in settings
- **Persistent Preference**: Language preference saved locally

### Payment Method Management
- Add/remove credit cards with Luhn validation
- Link PayPal accounts
- Wallet balance with quick top-up options ($10, $25, $50, $100)
- Set default payment methods
- Secure card number masking

### Address Management
- Add/edit/delete addresses
- Set default shipping/billing addresses
- Address type selection (shipping, billing, both)
- Full address validation
- Support for multiple addresses

### Payment History
- View all transactions (purchases, top-ups, refunds, lottery wins)
- Filter by type and status
- Search transactions
- Pull-to-refresh
- Export to CSV
- Transaction details modal

### User Profile
- Edit profile information (name, email, phone, bio)
- Upload profile avatar from camera or gallery
- Account statistics (orders, tickets, prizes, wishlist)
- Account information (member since, status, loyalty tier)

### Security Features
- **Biometric Login**: Face ID (iOS) / Fingerprint (Android)
- **2-Factor Authentication**: SMS/Email verification
- **Password Change**: With validation and confirmation
- **Secure Storage**: Encrypted local storage for sensitive data

## 🌐 Multi-Language Support

The app supports three languages:
- **English** (en)
- **Arabic** (ar) with RTL layout
- **Kurdish** (ku)

Language can be changed from Settings → Language & Region.

## 📱 Screens

### Main Tabs (Bottom Navigation)
1. **Home** - Lottery banner, recent winners, featured products
2. **Products** - Product catalog with filtering
3. **Wishlist** - Saved products
4. **Compare** - Product comparison
5. **Gift Cards** - Purchase and manage gift cards
6. **Bundles** - Product bundles
7. **Loyalty** - Loyalty program and rewards
8. **Cart** - Shopping cart
9. **Profile** - User profile and settings

### Additional Screens
- **Lottery Purchase** - Buy lottery tickets
- **My Tickets** - View purchased tickets
- **Lottery Results** - Check draw results
- **User Profile** - Edit profile and avatar
- **Settings** - App settings and preferences
- **Payment Methods** - Manage payment methods
- **Add Payment Method** - Add new card/PayPal
- **Payment History** - Transaction history
- **Addresses** - Manage addresses
- **Add Address** - Add new address
- **Change Password** - Update password
- **About** - App information

## 🔒 Security Features

- Biometric authentication (Face ID/Fingerprint)
- 2-Factor authentication
- Secure local storage with AsyncStorage
- Input validation and sanitization
- Card number masking
- CVV validation
- Address validation

## 📱 Platform Support

- **iOS**: iOS 13.4+
- **Android**: Android 5.0+ (API 21+)
- **Expo Go**: Latest version

## 🎯 Demo Credentials

```
Email: demo@belkhair.com
Password: demo123
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@belkhair.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- Icons from [Ionicons](https://ionic.io/ionicons)
- [react-i18next](https://react.i18next.com/)

---

**Made with ❤️ by the Belkhair Team**
