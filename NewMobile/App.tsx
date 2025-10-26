import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/services/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { AppProvider } from './src/contexts/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/components/SplashScreen';
import DevBanner from './src/components/DevBanner';
import ErrorBoundary from './src/components/ErrorBoundary';
import PerformanceMonitor from './src/components/PerformanceMonitor';
import ConnectionStatus from './src/components/ConnectionStatus';
import { notificationService } from './src/services/NotificationService';
import { apiService } from './src/services/ApiService';
import * as Device from 'expo-device';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Simulate some loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize notification service
        await initializeNotifications();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    
    // Cleanup listeners on unmount
    return () => {
      notificationService.removeNotificationListeners();
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Register for push notifications
      const pushToken = await notificationService.registerForPushNotifications();
      
      if (pushToken) {
        // Send push token to backend
        const deviceInfo = {
          deviceId: Device.modelId || 'unknown',
          deviceName: Device.deviceName || 'unknown',
          platform: Device.osName || 'unknown',
          osVersion: Device.osVersion || 'unknown',
        };
        
        await apiService.registerPushToken(pushToken, deviceInfo);
      }

      // Set up notification listeners
      const listeners = notificationService.setupNotificationListeners(
        (notification) => {
          // Handle notification received while app is open
          console.log('📩 Notification received:', notification.request.content.title);
        },
        (response) => {
          // Handle user tapping on notification
          console.log('👆 Notification tapped:', response.notification.request.content.data);
          // You can navigate to specific screens based on notification data
          // navigation.navigate('ScreenName', { data: response.notification.request.content.data });
        }
      );

      notificationListener.current = listeners.notificationListener;
      responseListener.current = listeners.responseListener;

      console.log('✅ Notifications initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const handleCustomSplashFinish = () => {
    setShowCustomSplash(false);
  };

  if (!appIsReady) {
    return null;
  }

  if (showCustomSplash) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <AppProvider>
              <CustomSplashScreen onFinish={handleCustomSplashFinish} />
            </AppProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LanguageProvider>
            <ThemeProvider>
              <AppProvider>
                <View style={{ flex: 1 }}>
                  <DevBanner />
                  <ConnectionStatus />
                  <PerformanceMonitor />
                  <AuthProvider>
                    <AppNavigator />
                    <StatusBar style="auto" />
                  </AuthProvider>
                </View>
              </AppProvider>
            </ThemeProvider>
          </LanguageProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
