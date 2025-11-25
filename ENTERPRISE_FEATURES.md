# Belkhair Mobile App - Enterprise Features Documentation

## Overview
The Belkhair mobile app has been enhanced with enterprise-grade features including multi-language support, comprehensive user profile management, advanced security settings, and professional UI/UX.

---

## 🌍 Multi-Language Support (i18n)

### Supported Languages
- **English** (en) 🇬🇧
- **Arabic** (ar) 🇸🇦 - with full RTL support
- **Kurdish** (ku) 🇮🇶

### Implementation Details

#### Libraries Used
- `react-i18next` - i18n framework for React Native
- `i18next` - Core i18n library
- `expo-localization` - Device language detection
- `expo-updates` - App reload for RTL changes

#### Configuration
The i18n system is configured in `/i18n.ts` with:
- Automatic device language detection
- Fallback to English if language not supported
- Complete translations for all app screens
- Support for interpolation (e.g., "You won {{amount}}!")

#### RTL Support
- **Automatic RTL layout** when Arabic is selected
- Uses React Native's `I18nManager.forceRTL()`
- **App reload required** when switching to/from Arabic
- All UI components adapt to RTL direction

#### Language Context
`/contexts/LanguageContext.tsx` provides:
- Current language state
- `changeLanguage(lang)` function
- `isRTL` boolean for RTL detection
- Persistent language preference in AsyncStorage

### Usage Example
```tsx
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <Text>{t('common.welcome')}</Text>
      <Button onPress={() => changeLanguage('ar')} />
    </View>
  );
}
```

---

## 👤 User Profile Management

### UserProfileScreen (`/screens/UserProfileScreen.tsx`)

#### Features
1. **Avatar Management**
   - Display user initials if no avatar
   - Upload avatar from camera or photo library
   - Edit badge indicator when in edit mode
   - Circular avatar with blue border

2. **Profile Information**
   - Name (editable)
   - Email (editable)
   - Phone (editable)
   - Bio (editable with multiline input)

3. **Edit Mode**
   - Toggle edit mode with checkmark button
   - All fields become editable TextInputs
   - Cancel button to discard changes
   - Save changes with success notification

4. **Account Statistics**
   - Total Orders (24)
   - Lottery Tickets (156)
   - Prizes Won (3)
   - Wishlist Items (42)
   - Displayed in 2x2 grid with icons

5. **Account Information**
   - Member Since date
   - Account Status badge (Active)
   - Loyalty Tier badge (Gold Member)
   - Total Spent amount

#### Permissions Required
- **Camera** - for taking profile photos
- **Photo Library** - for selecting existing photos

#### Libraries Used
- `expo-image-picker` - Avatar upload functionality

---

## ⚙️ Settings & Preferences

### SettingsScreen (`/screens/SettingsScreen.tsx`)

#### Language & Region
- Visual language selector with flags
- English, Arabic, Kurdish options
- Confirmation dialog before changing
- Automatic app reload for RTL changes

#### Notifications
Toggle switches for:
- Push Notifications
- Email Notifications
- Order Updates
- Lottery Results
- Promotions & Offers
- Newsletter

#### Security & Privacy
1. **Change Password**
   - Navigate to dedicated password change screen
   - Password strength requirements
   - Real-time validation

2. **Two-Factor Authentication (2FA)**
   - Enable/disable 2FA
   - SMS or email verification codes
   - Confirmation dialog

3. **Biometric Login**
   - Face ID (iOS)
   - Touch ID (iOS)
   - Fingerprint (Android)
   - Hardware availability check
   - Enrollment verification
   - Secure authentication prompt

#### Account Management
- Edit Profile
- Saved Addresses
- Payment Methods

#### Support & Legal
- Help Center
- Contact Support (opens email)
- Privacy Policy
- Terms of Service
- About

#### App Information
- App name and version
- Build number
- Copyright notice

### ChangePasswordScreen (`/screens/ChangePasswordScreen.tsx`)

#### Features
1. **Password Fields**
   - Current Password
   - New Password
   - Confirm Password
   - Show/hide toggle for each field

2. **Password Requirements**
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character (!@#$%^&*)
   - Real-time validation with checkmarks

3. **Validation**
   - All fields required
   - Password length check
   - Password match verification
   - Visual feedback for requirements

#### Libraries Used
- `expo-local-authentication` - Biometric authentication

---

## 📱 About & Support

### AboutScreen (`/screens/AboutScreen.tsx`)

#### Sections

1. **App Information**
   - Logo/icon display
   - App name and tagline
   - Version and build number

2. **About Belkhair**
   - Company mission statement
   - Platform description
   - Value proposition

3. **Key Features**
   - Wide product selection
   - Lottery ticket system
   - Prize opportunities
   - Secure payments
   - Fast delivery
   - 24/7 support

4. **Contact Information**
   - Website (clickable)
   - Email (opens mail app)
   - Phone number
   - Physical address

5. **Social Media**
   - Facebook, Twitter, Instagram, LinkedIn
   - Clickable social media buttons
   - Platform-specific colors

6. **Legal Links**
   - Terms of Service
   - Privacy Policy
   - Navigate to dedicated screens

7. **Copyright**
   - Copyright notice
   - Made with ❤️ in Kurdistan

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Secure token storage in AsyncStorage
- Automatic token refresh
- Session management

### Biometric Authentication
- Platform-specific biometric support
- Hardware availability check
- Enrollment verification
- Secure authentication prompts
- Fallback to password authentication

### Two-Factor Authentication
- SMS or email verification
- Time-based one-time passwords (TOTP)
- Backup codes for account recovery
- Enable/disable toggle

### Password Security
- Minimum 8 characters
- Complexity requirements
- Secure password hashing
- Password change functionality
- Show/hide password toggles

### Data Protection
- Encrypted data storage
- HTTPS for all API calls
- Secure payment processing
- Privacy-compliant data handling

---

## 🎨 UI/UX Enhancements

### Design System
- **Dark Theme** - Professional dark background (#1a1a1a)
- **Primary Color** - Blue (#3b82f6)
- **Accent Colors** - Gold (#fbbf24), Green (#10b981), Red (#ef4444)
- **Typography** - System fonts with proper hierarchy
- **Spacing** - Consistent 8px grid system

### Components
- **Cards** - Rounded corners, subtle shadows
- **Buttons** - Clear CTAs with proper states
- **Forms** - Labeled inputs with validation
- **Icons** - Ionicons for consistency
- **Badges** - Status indicators with colors
- **Switches** - iOS-style toggles

### Interactions
- **Touch Feedback** - Visual feedback on all touchable elements
- **Animations** - Smooth transitions and state changes
- **Loading States** - Clear loading indicators
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Confirmation dialogs and toasts

### Accessibility
- **RTL Support** - Full right-to-left layout for Arabic
- **Font Scaling** - Respects system font size
- **Color Contrast** - WCAG AA compliant
- **Touch Targets** - Minimum 44x44 points
- **Screen Reader** - Accessible labels

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "react-i18next": "^13.x",
  "i18next": "^23.x",
  "i18next-browser-languagedetector": "^7.x",
  "expo-localization": "~14.x",
  "expo-updates": "~0.18.x",
  "expo-image-picker": "~14.x",
  "expo-local-authentication": "~13.x",
  "@react-native-async-storage/async-storage": "~1.x"
}
```

### Installation
```bash
npm install react-i18next i18next i18next-browser-languagedetector expo-localization expo-updates expo-image-picker expo-local-authentication
```

---

## 🚀 Getting Started

### Running the App
```bash
cd /home/ubuntu/belkhair-mobile
npm start
```

### Testing Languages
1. Open Settings screen
2. Tap on Language & Region
3. Select a language (English, Arabic, or Kurdish)
4. Confirm the change
5. App will reload with new language

### Testing RTL
1. Change language to Arabic
2. App will reload automatically
3. All UI elements will flip to RTL
4. Navigation will be right-to-left

### Testing Biometric
1. Ensure device has biometric hardware
2. Enroll biometric data in device settings
3. Open Settings > Security
4. Toggle "Enable Face ID/Fingerprint"
5. Authenticate with biometric

---

## 🔄 Migration Guide

### From Basic to Enterprise

#### Step 1: Install Dependencies
```bash
npm install react-i18next i18next expo-localization expo-updates expo-image-picker expo-local-authentication
```

#### Step 2: Add i18n Configuration
Create `/i18n.ts` with language resources and configuration.

#### Step 3: Wrap App with Providers
```tsx
<LanguageProvider>
  <AuthProvider>
    {/* Other providers */}
  </AuthProvider>
</LanguageProvider>
```

#### Step 4: Update Screens
Replace hardcoded strings with `t('key')` translations.

#### Step 5: Add New Screens
- UserProfileScreen
- SettingsScreen
- ChangePasswordScreen
- AboutScreen

#### Step 6: Update Navigation
Add new screens to Stack Navigator in `App.tsx`.

---

## 📊 Performance Considerations

### Optimization Strategies
1. **Lazy Loading** - Load translations on demand
2. **Caching** - Cache language preferences
3. **Memoization** - Memoize translated strings
4. **Image Optimization** - Compress avatar images
5. **AsyncStorage** - Efficient data persistence

### Best Practices
- Avoid inline styles
- Use StyleSheet.create()
- Minimize re-renders
- Optimize images
- Use FlatList for long lists
- Implement pagination

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Language switching works correctly
- [ ] RTL layout displays properly in Arabic
- [ ] Avatar upload from camera works
- [ ] Avatar upload from library works
- [ ] Profile edit saves correctly
- [ ] Password change validates properly
- [ ] Biometric authentication works
- [ ] 2FA toggle functions correctly
- [ ] All settings persist after app restart
- [ ] Navigation flows work in all languages
- [ ] Notifications toggle correctly
- [ ] Social media links open correctly
- [ ] Email links open mail app
- [ ] All translations are accurate

### Automated Testing
```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Common Issues

#### RTL Not Working
- Ensure `I18nManager.forceRTL(true)` is called
- Reload app after changing to Arabic
- Check if `expo-updates` is installed

#### Biometric Not Available
- Check device has biometric hardware
- Verify biometric data is enrolled
- Request permissions in app.json

#### Translations Not Loading
- Verify i18n.ts is imported in App.tsx
- Check translation keys match
- Ensure language code is correct

#### Avatar Upload Fails
- Request camera/library permissions
- Check expo-image-picker is installed
- Verify permissions in app.json

---

## 📝 Future Enhancements

### Planned Features
- [ ] Voice input for search
- [ ] Offline mode support
- [ ] Push notification system
- [ ] In-app chat support
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Crash reporting
- [ ] Performance monitoring
- [ ] User feedback system
- [ ] Referral program

### Roadmap
- **Q1 2025** - Voice search, offline mode
- **Q2 2025** - Push notifications, in-app chat
- **Q3 2025** - Analytics, A/B testing
- **Q4 2025** - Advanced features

---

## 📞 Support

### Contact Information
- **Email**: support@belkhair.com
- **Phone**: +964 750 123 4567
- **Website**: https://belkhair.com
- **Documentation**: https://docs.belkhair.com

### Community
- **GitHub**: https://github.com/belkhair
- **Discord**: https://discord.gg/belkhair
- **Forum**: https://forum.belkhair.com

---

## 📄 License

© 2024 Belkhair. All rights reserved.

This is proprietary software. Unauthorized copying, modification, or distribution is strictly prohibited.

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0  
**Author**: Belkhair Development Team
