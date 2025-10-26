# Iraqi E-commerce Lottery Mobile App

A modern React Native mobile application built with Expo for the Iraqi e-commerce lottery system.

## 🚀 Features

- **Authentication System**: Login and registration with JWT token management
- **Product Browsing**: View products with category filtering
- **Lottery Tickets**: Manage and view lottery tickets
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Real-time API**: Integrates with backend API for live data

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Context API with Hooks
- **API Client**: Axios
- **Storage**: AsyncStorage
- **UI Components**: Custom components with React Native core
- **Icons**: Expo Vector Icons

## 📱 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd NewMobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on your preferred platform**:
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

## 📋 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   └── LoadingSpinner.tsx
├── constants/           # App constants and configuration
│   └── index.ts
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── main/           # Main app screens
│   ├── products/       # Product-related screens
│   ├── tickets/        # Ticket management screens
│   └── profile/        # User profile screens
├── services/           # API services and context
│   ├── ApiService.ts
│   └── AuthContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── helpers.ts
```

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/constants/index.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.196:8000/api', // Your backend URL
  TIMEOUT: 10000,
};
```

### Demo Credentials

For testing, use these demo credentials:
- **Email**: test@test.com
- **Password**: 123456

## 🎯 Key Features Implementation

### Authentication Flow
- JWT token-based authentication
- Secure storage with AsyncStorage
- Auto-login on app restart
- Protected routes with auth context

### Navigation System
- Stack navigation for auth flow
- Bottom tab navigation for main app
- Nested stack navigation for product details
- Type-safe navigation with TypeScript

### API Integration
- Axios-based HTTP client
- Request/response interceptors
- Error handling and retry logic
- Loading states and error messaging

### UI Components
- Custom reusable components
- Consistent design system
- Responsive layouts
- Loading and error states

## 🚀 Next Steps

1. **Implement Product List**: Connect to real API data
2. **Add Product Details**: Full product information and purchase flow
3. **Implement Tickets**: Display user lottery tickets
4. **Add Profile Management**: User settings and preferences
5. **Add Search**: Product search and filtering
6. **Push Notifications**: Lottery results and updates
7. **Localization**: Arabic language support
8. **Testing**: Unit and integration tests

## 🔗 Related Projects

- **Backend API**: Iraqi e-commerce lottery backend
- **Web Frontend**: Admin dashboard and web interface

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for type safety
3. Add proper error handling
4. Include loading states for async operations
5. Test on both iOS and Android platforms

## 📄 License

This project is part of the Iraqi E-commerce Lottery system.
