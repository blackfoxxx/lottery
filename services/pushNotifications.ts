import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  deviceId: string;
  platform: string;
}

/**
 * Register for push notifications and get the Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push notification token:', token);

    // Save token to AsyncStorage
    await AsyncStorage.setItem('push_token', token);

    // Send token to backend
    await sendTokenToBackend(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E74C3C',
    });
  }

  return token;
}

/**
 * Send push token to backend server
 */
async function sendTokenToBackend(token: string): Promise<void> {
  try {
    const authToken = await AsyncStorage.getItem('auth_token');
    if (!authToken) {
      console.log('No auth token, skipping token registration');
      return;
    }

    const response = await fetch('http://localhost:8000/api/v1/notifications/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        token,
        platform: Platform.OS,
        device_id: Device.modelName || 'unknown',
      }),
    });

    if (response.ok) {
      console.log('Push token registered with backend');
    } else {
      console.error('Failed to register push token with backend');
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  seconds: number = 0
): Promise<string> {
  const trigger = seconds > 0 ? { seconds } : null;

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger,
  });
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get notification permission status
 */
export async function getNotificationPermissionStatus(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 * Send gift card delivery notification
 */
export async function sendGiftCardNotification(
  recipientName: string,
  amount: number,
  code: string
): Promise<void> {
  await scheduleLocalNotification(
    '🎁 Gift Card Received!',
    `${recipientName} sent you a $${amount} gift card. Code: ${code}`,
    { type: 'gift_card', code }
  );
}

/**
 * Send bundle promotion notification
 */
export async function sendBundlePromotionNotification(
  bundleName: string,
  discount: number,
  discountType: 'percentage' | 'fixed'
): Promise<void> {
  const discountText =
    discountType === 'percentage' ? `${discount}% off` : `$${discount} off`;

  await scheduleLocalNotification(
    '🎉 Special Bundle Deal!',
    `${bundleName} - Save ${discountText}! Limited time offer.`,
    { type: 'bundle_promotion', bundleName }
  );
}

/**
 * Send order status notification
 */
export async function sendOrderNotification(
  orderId: number,
  status: string,
  message: string
): Promise<void> {
  await scheduleLocalNotification(
    `Order #${orderId} ${status}`,
    message,
    { type: 'order_update', orderId }
  );
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
): void {
  // Handle notifications received while app is in foreground
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received:', notification);
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  // Handle notification tap
  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Notification tapped:', response);
    if (onNotificationResponse) {
      onNotificationResponse(response);
    }
  });

  // Return cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
