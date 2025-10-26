import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { STORAGE_KEYS } from '../constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

export interface ScheduledNotificationData extends NotificationData {
  trigger: {
    seconds?: number;
    date?: Date;
    repeats?: boolean;
    channelId?: string;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  drawReminders: boolean;
  orderUpdates: boolean;
  winNotifications: boolean;
  promotions: boolean;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the notification service
   */
  private async initialize() {
    // Set up notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF4433',
      });

      // Create specific channels for different notification types
      await Notifications.setNotificationChannelAsync('draws', {
        name: 'Lottery Draws',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#fbbf24',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('wins', {
        name: 'Wins & Prizes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#34C759',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('orders', {
        name: 'Order Updates',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        lightColor: '#007AFF',
      });
    }

    // Load saved settings
    await this.loadSettings();
  }

  /**
   * Register for push notifications and get Expo Push Token
   */
  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Check if running on physical device
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission to receive push notifications was denied');
        return null;
      }

      // Get Expo Push Token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.log('No project ID found, using default configuration');
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId || undefined,
      });

      this.expoPushToken = tokenData.data;
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, this.expoPushToken);

      console.log('Push token registered:', this.expoPushToken);

      return this.expoPushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Get the current Expo Push Token
   */
  async getPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }

    // Try to load from storage
    const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN);
    if (savedToken) {
      this.expoPushToken = savedToken;
      return savedToken;
    }

    // Register if not available
    return await this.registerForPushNotifications();
  }

  /**
   * Send local notification immediately
   */
  async sendLocalNotification(notification: NotificationData): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger: null, // Send immediately
      });

      console.log('Local notification sent:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(notification: ScheduledNotificationData): Promise<string> {
    try {
      const trigger: any = {};

      if (notification.trigger.seconds) {
        trigger.seconds = notification.trigger.seconds;
      }

      if (notification.trigger.date) {
        trigger.date = notification.trigger.date;
      }

      if (notification.trigger.repeats) {
        trigger.repeats = notification.trigger.repeats;
      }

      if (Platform.OS === 'android' && notification.trigger.channelId) {
        trigger.channelId = notification.trigger.channelId;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger,
      });

      console.log('Notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('Notification cancelled:', identifier);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Set up notification listeners
   */
  setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationTapped?: (response: Notifications.NotificationResponse) => void
  ) {
    // Listener for when a notification is received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listener for when a user taps on a notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        if (onNotificationTapped) {
          onNotificationTapped(response);
        }
      }
    );

    return {
      notificationListener: this.notificationListener,
      responseListener: this.responseListener,
    };
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }

    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
  }

  /**
   * Get notification badge count
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear notification badge
   */
  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  /**
   * Save notification settings
   */
  async saveSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        JSON.stringify(settings)
      );
      console.log('Notification settings saved:', settings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  /**
   * Load notification settings
   */
  async loadSettings(): Promise<NotificationSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }

      // Default settings
      const defaultSettings: NotificationSettings = {
        enabled: true,
        drawReminders: true,
        orderUpdates: true,
        winNotifications: true,
        promotions: false,
      };

      await this.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return {
        enabled: true,
        drawReminders: true,
        orderUpdates: true,
        winNotifications: true,
        promotions: false,
      };
    }
  }

  /**
   * Schedule draw reminder notification
   */
  async scheduleDrawReminder(drawDate: Date, categoryName: string, prizeAmount: string): Promise<string | null> {
    const settings = await this.loadSettings();
    
    if (!settings.enabled || !settings.drawReminders) {
      console.log('Draw reminders are disabled');
      return null;
    }

    try {
      // Schedule notification 1 hour before draw
      const notificationTime = new Date(drawDate.getTime() - 60 * 60 * 1000);

      if (notificationTime.getTime() <= Date.now()) {
        console.log('Draw time is too soon to schedule reminder');
        return null;
      }

      const identifier = await this.scheduleNotification({
        title: `🎯 ${categoryName} Draw Starting Soon!`,
        body: `The ${categoryName} lottery draw starts in 1 hour. Prize: ${prizeAmount}. Good luck!`,
        data: {
          type: 'draw_reminder',
          categoryName,
          prizeAmount,
        },
        sound: true,
        trigger: {
          date: notificationTime,
          channelId: 'draws',
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling draw reminder:', error);
      return null;
    }
  }

  /**
   * Notify about order completion
   */
  async notifyOrderComplete(orderNumber: string, ticketCount: number): Promise<void> {
    const settings = await this.loadSettings();
    
    if (!settings.enabled || !settings.orderUpdates) {
      return;
    }

    await this.sendLocalNotification({
      title: '✅ Order Completed!',
      body: `Your order #${orderNumber} is complete. You received ${ticketCount} lottery ${ticketCount === 1 ? 'ticket' : 'tickets'}!`,
      data: {
        type: 'order_complete',
        orderNumber,
        ticketCount,
      },
      sound: true,
    });
  }

  /**
   * Notify about winning ticket
   */
  async notifyWin(prizeAmount: string, ticketNumber: string): Promise<void> {
    const settings = await this.loadSettings();
    
    if (!settings.enabled || !settings.winNotifications) {
      return;
    }

    await this.sendLocalNotification({
      title: '🎉 Congratulations! You Won!',
      body: `Your ticket #${ticketNumber} won ${prizeAmount}! Check your tickets to claim your prize.`,
      data: {
        type: 'win',
        prizeAmount,
        ticketNumber,
      },
      sound: true,
      badge: 1,
    });
  }

  /**
   * Check notification permissions status
   */
  async checkPermissions(): Promise<{
    granted: boolean;
    canAskAgain: boolean;
    status: string;
  }> {
    try {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain: canAskAgain ?? true,
        status,
      };
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return {
        granted: false,
        canAskAgain: true,
        status: 'undetermined',
      };
    }
  }

  /**
   * Open device notification settings
   */
  async openSettings(): Promise<void> {
    if (Platform.OS === 'ios') {
      // On iOS, use Linking to open settings
      const { Linking } = require('react-native');
      await Linking.openURL('app-settings:');
    } else {
      // On Android, you can guide users to settings manually
      console.log('Please enable notifications in device settings');
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
