import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SIZES } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar style="light" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="diamond" size={80} color={colors.background} />
        </View>
        
        {/* App Name */}
        <Text style={[styles.appName, { color: colors.background }]}>
          Iraqi E-commerce
        </Text>
        <Text style={[styles.appSubtitle, { color: colors.background }]}>
          Lottery System
        </Text>
        
        {/* Loading */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.background} />
          <Text style={[styles.loadingText, { color: colors.background }]}>
            {t('loading')}
          </Text>
        </View>
      </Animated.View>
      
      {/* Version */}
      <Text style={[styles.version, { color: colors.background + '80' }]}>
        Version 1.0.0
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: SIZES.marginXLarge,
    padding: SIZES.paddingXLarge,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  appName: {
    fontSize: SIZES.fontXXLarge + 4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.marginSmall,
  },
  appSubtitle: {
    fontSize: SIZES.fontLarge,
    textAlign: 'center',
    marginBottom: SIZES.marginXLarge * 2,
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.fontMedium,
    marginTop: SIZES.marginMedium,
    opacity: 0.8,
  },
  version: {
    position: 'absolute',
    bottom: SIZES.paddingXLarge,
    fontSize: SIZES.fontSmall,
  },
});

export default SplashScreen;
