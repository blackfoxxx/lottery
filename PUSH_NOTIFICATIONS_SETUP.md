# Push Notifications Setup Guide

This guide explains how to set up push notifications in the Belkhair mobile app.

## Prerequisites

1. **Expo Account**: You need an Expo account to use push notifications
2. **Physical Device**: Push notifications don't work reliably on simulators/emulators

## Installation

Install the required packages:

```bash
npm install expo-notifications expo-device
```

Or with yarn:

```bash
yarn add expo-notifications expo-device
```

## Configuration

### 1. Update app.json

Add the following configuration to your `app.json`:

```json
{
  "expo": {
    "name": "Belkhair Mobile",
    "slug": "belkhair-mobile",
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#E74C3C",
      "androidMode": "default",
      "androidCollapsedTitle": "{{unread_count}} new notifications"
    },
    "android": {
      "useNextNotificationsApi": true,
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    }
  }
}
```

### 2. Create Notification Icon (Android)

Create a notification icon at `assets/notification-icon.png`:
- Size: 96x96 pixels
- Format: PNG with transparency
- Color: White foreground on transparent background
- Style: Simple, recognizable silhouette

### 3. Firebase Cloud Messaging (Optional for Android)

For Android push notifications via FCM:

1. Create a Firebase project at https://console.firebase.google.com
2. Add an Android app to your project
3. Download `google-services.json`
4. Place it in the root of your project

### 4. Apple Push Notification Service (iOS)

For iOS push notifications:

1. Enroll in Apple Developer Program
2. Create an App ID with Push Notifications enabled
3. Generate APNs certificates
4. Configure in Expo dashboard

## Usage in App

### Initialize Notifications

In your `App.tsx`, add the notification setup:

```typescript
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from './services/pushNotifications';

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync();

    // Setup listeners
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification);
      },
      (response) => {
        console.log('Notification tapped:', response);
        // Handle navigation based on notification data
        const data = response.notification.request.content.data;
        if (data.type === 'gift_card') {
          // Navigate to gift card screen
        } else if (data.type === 'bundle_promotion') {
          // Navigate to bundles screen
        }
      }
    );

    return cleanup;
  }, []);

  // Rest of your app...
}
```

### Send Notifications

#### Gift Card Notification

```typescript
import { sendGiftCardNotification } from './services/pushNotifications';

// When gift card is received
await sendGiftCardNotification('John Doe', 50, 'GIFT-1234-5678-9012');
```

#### Bundle Promotion Notification

```typescript
import { sendBundlePromotionNotification } from './services/pushNotifications';

// When promoting a bundle
await sendBundlePromotionNotification('Tech Essentials Bundle', 20, 'percentage');
```

#### Order Status Notification

```typescript
import { sendOrderNotification } from './services/pushNotifications';

// When order status changes
await sendOrderNotification(12345, 'Shipped', 'Your order has been shipped!');
```

## Backend Integration

### Register Device Token

The app automatically sends the push token to your backend at:

```
POST /api/v1/notifications/register-device
```

Request body:
```json
{
  "token": "ExponentPushToken[xxxxxx]",
  "platform": "ios",
  "device_id": "iPhone 14 Pro"
}
```

### Send Push Notifications from Backend

Use the Expo Push API to send notifications:

```bash
curl -H "Content-Type: application/json" \
  -X POST https://exp.host/--/api/v2/push/send \
  -d '{
    "to": "ExponentPushToken[xxxxxx]",
    "title": "Gift Card Received!",
    "body": "You received a $50 gift card",
    "data": {"type": "gift_card", "code": "GIFT-1234"}
  }'
```

Or use the expo-server-sdk in your Laravel backend:

```php
// Install: composer require expo/expo-server-sdk-php

use ExpoSDK\Expo;
use ExpoSDK\ExpoMessage;

$expo = new Expo();

$message = (new ExpoMessage([
    'title' => 'Gift Card Received!',
    'body' => 'You received a $50 gift card',
    'data' => ['type' => 'gift_card', 'code' => 'GIFT-1234']
]))
->setTo(['ExponentPushToken[xxxxxx]'])
->setChannelId('default')
->setBadge(1)
->playSound();

$expo->send($message)->push();
```

## Testing

### Test on Physical Device

1. Build and install the app on a physical device
2. Grant notification permissions when prompted
3. Send a test notification using the Expo push tool:
   https://expo.dev/notifications

### Test Local Notifications

```typescript
import { scheduleLocalNotification } from './services/pushNotifications';

// Schedule immediate notification
await scheduleLocalNotification(
  'Test Notification',
  'This is a test message',
  { test: true }
);

// Schedule delayed notification (5 seconds)
await scheduleLocalNotification(
  'Delayed Notification',
  'This appears after 5 seconds',
  { test: true },
  5
);
```

## Notification Permissions

### Check Permission Status

```typescript
import { getNotificationPermissionStatus } from './services/pushNotifications';

const status = await getNotificationPermissionStatus();
console.log('Permission status:', status); // 'granted', 'denied', 'undetermined'
```

### Request Permissions

```typescript
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
if (status === 'granted') {
  console.log('Notifications enabled');
} else {
  console.log('Notifications denied');
}
```

## Troubleshooting

### Notifications Not Received

1. **Check permissions**: Ensure notifications are enabled in device settings
2. **Verify token**: Check that the push token is correctly registered
3. **Check network**: Ensure device has internet connection
4. **Test with Expo tool**: Use https://expo.dev/notifications to test

### iOS Specific Issues

- Ensure you're testing on a physical device
- Check that APNs certificates are properly configured
- Verify App ID has Push Notifications capability

### Android Specific Issues

- Ensure `google-services.json` is in the project root
- Check that notification channels are properly configured
- Verify app has notification permissions in system settings

## Best Practices

1. **Don't spam**: Send notifications only for important events
2. **Personalize**: Use user's name and relevant information
3. **Timing**: Send notifications at appropriate times
4. **Clear actions**: Make it obvious what the notification is about
5. **Deep linking**: Navigate to relevant screen when notification is tapped
6. **Respect preferences**: Allow users to customize notification settings

## User Preferences

Implement notification preferences in the app:

```typescript
// Save user preferences
await AsyncStorage.setItem('notification_preferences', JSON.stringify({
  giftCards: true,
  bundles: true,
  orders: true,
  promotions: false
}));

// Check before sending
const prefs = JSON.parse(await AsyncStorage.getItem('notification_preferences'));
if (prefs.giftCards) {
  await sendGiftCardNotification(...);
}
```

## Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
