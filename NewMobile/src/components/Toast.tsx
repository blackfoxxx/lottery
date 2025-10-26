import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  autoHide?: boolean;
  onPress?: () => void;
  onDismiss?: () => void;
}

interface ToastProps extends ToastConfig {
  visible: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  type,
  title,
  message,
  duration = 4000,
  autoHide = true,
  onPress,
  onDismiss,
  onHide,
}) => {
  const { colors, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      showToast();
      if (autoHide) {
        timeoutRef.current = setTimeout(() => {
          hideToast();
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, autoHide]);

  const showToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
      onDismiss?.();
    });
  };

  const getToastStyle = () => {
    const baseStyle = {
      backgroundColor: colors.surface,
      borderLeftColor: colors.primary,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          borderLeftColor: '#10b981',
          backgroundColor: isDarkMode ? '#064e3b' : '#ecfdf5',
        };
      case 'error':
        return {
          ...baseStyle,
          borderLeftColor: '#ef4444',
          backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
        };
      case 'warning':
        return {
          ...baseStyle,
          borderLeftColor: '#f59e0b',
          backgroundColor: isDarkMode ? '#78350f' : '#fffbeb',
        };
      case 'info':
        return {
          ...baseStyle,
          borderLeftColor: '#3b82f6',
          backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
        };
      default:
        return baseStyle;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📱';
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      hideToast();
    }
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY < -50) {
      hideToast();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View>            <TouchableOpacity
              style={[
                styles.toast,
                getToastStyle(),
                { borderColor: colors.border }
              ]}
              onPress={handlePress}
              activeOpacity={0.9}
            >
              <View style={styles.content}>
                <Text style={styles.icon}>{getIcon()}</Text>
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.title,
                    { color: colors.text }
                  ]}>
                    {title}
                  </Text>
                  {message && (
                    <Text style={[
                      styles.message,
                      { color: colors.textSecondary }
                    ]}>
                      {message}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={hideToast}
              >
                <Text style={[
                  styles.closeText,
                  { color: colors.textSecondary }
                ]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  message: {
    fontSize: 14,
    lineHeight: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<(ToastConfig & { id: string; visible: boolean })[]>([]);

  const show = (config: ToastConfig) => {
    const id = config.id || Date.now().toString();
    const newToast = { ...config, id, visible: true };
    
    setToasts(prev => [...prev, newToast]);
  };

  const hide = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const hideAll = () => {
    setToasts([]);
  };

  const showSuccess = (title: string, message?: string) => {
    show({ type: 'success', title, message });
  };

  const showError = (title: string, message?: string) => {
    show({ type: 'error', title, message });
  };

  const showWarning = (title: string, message?: string) => {
    show({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message?: string) => {
    show({ type: 'info', title, message });
  };

  const ToastContainer: React.FC = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onHide={() => hide(toast.id)}
        />
      ))}
    </>
  );

  return {
    show,
    hide,
    hideAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer,
  };
};

export default Toast;
