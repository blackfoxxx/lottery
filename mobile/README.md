# Iraqi E-commerce Lottery Mobile App

[![Ionic](https://img.shields.io/badge/Ionic-7.0-blue.svg)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-17.0-red.svg)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.0-orange.svg)](https://capacitorjs.com/)
[![Android](https://img.shields.io/badge/Android-Ready-green.svg)](https://developer.android.com/)

A hybrid mobile application for the Iraqi E-commerce Lottery platform, built with Ionic, Angular, and Capacitor. This app provides a native mobile experience for users to participate in the lottery system through product purchases.

## 📱 Features

- **Product Catalog**: Browse and purchase e-commerce products
- **Automatic Lottery Tickets**: Get FREE lottery tickets with every purchase
- **User Authentication**: Secure login and registration
- **Order Management**: Track purchase history and orders
- **Lottery System**: View tickets, draws, and prizes
- **Push Notifications**: Real-time updates for lottery draws and wins
- **Offline Support**: Basic functionality when offline
- **Native Performance**: Optimized for Android devices

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── app/
│   │   ├── pages/           # Application pages/screens
│   │   ├── services/        # API and business logic services
│   │   ├── components/      # Reusable UI components
│   │   └── models/          # TypeScript interfaces and models
│   ├── assets/              # Static assets (images, icons)
│   ├── environments/        # Environment configuration
│   └── theme/               # Application styling
├── android/                 # Native Android project
├── build-output/           # Built APK files
├── keystore/               # Production signing certificates
└── www/                    # Built web assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Android Studio** (for Android development)
- **Java JDK 17** (for Android builds)

### Installation

1. **Clone and navigate to mobile directory**:
   ```bash
   cd /Users/aj/Desktop/iraqi-ecommerce-lottery/mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Ionic CLI** (if not already installed):
   ```bash
   npm install -g @ionic/cli
   ```

### Development Setup

1. **Start development server**:
   ```bash
   ionic serve
   ```
   - Opens browser at `http://localhost:8100`
   - Hot reload enabled for development

2. **Preview in device simulator**:
   ```bash
   ionic serve --lab
   ```
   - Shows iOS and Android previews side by side

## 🔧 Configuration

### API Configuration

The app uses environment-based configuration for API endpoints:

#### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // Local backend
};
```

#### Production Environment (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-domain.com/api'  // Production backend
};
```

### Common API URL Configurations

| Environment | URL Example | Use Case |
|-------------|-------------|----------|
| Local Development | `http://localhost:8000/api` | Same machine development |
| Local Network | `http://192.168.1.100:8000/api` | Testing on real devices |
| Android Emulator | `http://10.0.2.2:8000/api` | Android emulator host |
| Staging | `https://staging-api.yoursite.com/api` | Testing environment |
| Production | `https://api.yoursite.com/api` | Live production |

### App Configuration (`capacitor.config.ts`)

```typescript
const config: CapacitorConfig = {
  appId: 'com.iraqi.lottery.mobile',           // Android package ID
  appName: 'Iraqi Lottery Mobile',             // App display name
  webDir: 'www',                               // Built web assets
  server: {
    androidScheme: 'https'                     // Use HTTPS for security
  }
};
```

## 📱 Building for Android

### Development Build

1. **Build web assets**:
   ```bash
   ionic build
   ```

2. **Sync with Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

### Production Build

1. **Build optimized web assets**:
   ```bash
   ionic build --prod
   ```

2. **Sync with Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Build release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 🔐 APK Signing & Distribution

### Generate Keystore (One-time setup)

```bash
# Navigate to keystore directory
cd keystore

# Generate production keystore
keytool -genkey -v -keystore iraqi-lottery-release.keystore \
  -alias iraqi-lottery \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

### Sign APK

```bash
# Sign the unsigned APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore keystore/iraqi-lottery-release.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  iraqi-lottery

# Optimize with zipalign
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  build-output/iraqi-lottery-release-final.apk
```

### Verify APK Signature

```bash
jarsigner -verify -verbose build-output/iraqi-lottery-release-final.apk
```

## 🛠️ Development Workflow

### 1. Make Changes
- Edit source files in `src/`
- Test in browser with `ionic serve`

### 2. Test on Device
```bash
# Build and sync
ionic build && npx cap sync

# Test on Android device/emulator
npx cap run android
```

### 3. Production Deployment
```bash
# Build production version
ionic build --prod
npx cap sync

# Build signed APK
cd android && ./gradlew assembleRelease

# Sign and optimize
jarsigner [signing commands]
zipalign [optimization commands]
```

## 📦 Dependencies

### Core Framework
- **@ionic/angular**: Ionic framework for Angular
- **@angular/core**: Angular framework
- **@capacitor/core**: Native bridge functionality

### Capacitor Plugins
- **@capacitor/app**: App lifecycle management
- **@capacitor/haptics**: Device vibration
- **@capacitor/keyboard**: Keyboard management
- **@capacitor/status-bar**: Status bar styling

### HTTP & Storage
- **@angular/common/http**: HTTP client for API calls
- **rxjs**: Reactive programming with observables

## 🎨 UI Components

The app uses Ionic's component library:

- **ion-tab-bar**: Bottom navigation
- **ion-card**: Product and content cards
- **ion-list**: Data lists and menus
- **ion-button**: Interactive buttons
- **ion-input**: Form inputs
- **ion-loading**: Loading indicators
- **ion-toast**: Notification messages

## 🔄 State Management

### Services
- **AuthService**: User authentication and session management
- **ApiService**: HTTP API communications
- **NotificationService**: Push notifications and alerts

### Data Flow
1. User interacts with UI components
2. Components call service methods
3. Services make HTTP requests to backend
4. Responses update UI through observables

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run e2e
```

### Device Testing
```bash
# Android device
npx cap run android --target=device_id

# Android emulator
npx cap run android --target=emulator
```

## 📱 Platform-Specific Features

### Android
- **Native navigation**: Hardware back button support
- **Deep linking**: Handle app URLs
- **File access**: Access device storage
- **Camera integration**: Take photos for profiles
- **Push notifications**: Firebase Cloud Messaging

## 🔧 Troubleshooting

### Common Issues

#### 1. **Gradle Build Fails**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

#### 2. **Java Version Conflicts**
- Ensure Java 17 is installed and configured
- Check `JAVA_HOME` environment variable

#### 3. **API Connection Issues**
- Verify backend is running
- Check API URL in environment files
- Test API endpoints with Postman

#### 4. **Capacitor Sync Issues**
```bash
# Reset and re-sync
npx cap clean android
npx cap sync android
```

### Debug Commands

```bash
# Check Ionic info
ionic info

# Check Capacitor configuration
npx cap doctor

# View device logs
npx cap run android --external
```

## 📚 Additional Resources

### Documentation
- [Ionic Framework Docs](https://ionicframework.com/docs)
- [Angular Docs](https://angular.io/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)

### Useful Commands
```bash
# Add new Capacitor plugin
npm install @capacitor/camera
npx cap sync

# Update Ionic/Angular
ionic version
ng update

# Generate new page
ionic generate page pages/new-page

# Generate new service
ionic generate service services/new-service
```

## 🚀 Deployment Options

### 1. **Direct APK Distribution**
- Share `iraqi-lottery-release-final.apk` directly
- Users enable "Unknown Sources" to install

### 2. **Google Play Store**
- Upload APK to Google Play Console
- Complete store listing and review process

### 3. **Enterprise Distribution**
- Use Mobile Device Management (MDM) systems
- Internal company app stores

### 4. **Progressive Web App (PWA)**
- Deploy web version with service workers
- Install directly from browser

## 📋 Version Information

- **App Version**: 1.0.0
- **Package ID**: com.iraqi.lottery.mobile
- **Target Android SDK**: 34
- **Minimum Android**: API 22 (Android 5.1)

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes and test thoroughly
3. Build and test APK
4. Submit pull request with description

## 📄 License

This project is proprietary software for Iraqi E-commerce Lottery platform.

---

**Happy Coding! 🎯**

For technical support or questions, contact the development team.
