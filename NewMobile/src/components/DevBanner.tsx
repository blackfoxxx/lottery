import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SIZES } from '../constants';
import ApiConfigPanel from './ApiConfigPanel';
import { apiManager } from '../services/ApiManager';

interface DevBannerProps {
  visible?: boolean;
}

const DevBanner: React.FC<DevBannerProps> = ({ visible = __DEV__ }) => {
  const { colors } = useTheme();
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiStatus, setApiStatus] = useState(apiManager.getApiStatus());

  if (!visible) {
    return null;
  }

  const getApiStatusText = () => {
    return apiStatus.realApiAvailable ? '🌐 REAL-TIME API' : '⚠️ API DOWN';
  };

  const dynamicStyles = StyleSheet.create({
    banner: {
      backgroundColor: colors.warning || '#FF9500',
    },
    text: {
      color: colors.background,
    },
  });

  return (
    <>
      <TouchableOpacity 
        style={[styles.banner, dynamicStyles.banner]}
        onPress={() => setShowApiConfig(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, dynamicStyles.text]}>
          🛠️ DEVELOPMENT MODE • {getApiStatusText()} • TAP TO CONFIGURE
        </Text>
      </TouchableOpacity>
      
      <ApiConfigPanel
        visible={showApiConfig}
        onClose={() => {
          setShowApiConfig(false);
          setApiStatus(apiManager.getApiStatus());
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: SIZES.paddingSmall,
    paddingHorizontal: SIZES.paddingMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: SIZES.fontSmall,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DevBanner;