import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../contexts/ThemeContext';

interface ConnectionStatusProps {
  showOfflineOnly?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showOfflineOnly = true 
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Get initial connection state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Don't show anything if we're connected and showOfflineOnly is true
  if (showOfflineOnly && isConnected) {
    return null;
  }

  // Don't show anything if connection state is unknown
  if (isConnected === null) {
    return null;
  }

  const getStatusColor = () => {
    if (isConnected) {
      return connectionType === 'wifi' ? '#10b981' : '#f59e0b';
    }
    return '#ef4444';
  };

  const getStatusText = () => {
    if (!isConnected) {
      return 'No Internet Connection';
    }
    
    switch (connectionType) {
      case 'wifi':
        return 'Connected to WiFi';
      case 'cellular':
        return 'Connected to Mobile Data';
      case 'ethernet':
        return 'Connected to Ethernet';
      default:
        return 'Connected';
    }
  };

  const getStatusIcon = () => {
    if (!isConnected) {
      return '⚠️';
    }
    
    switch (connectionType) {
      case 'wifi':
        return '📶';
      case 'cellular':
        return '📱';
      case 'ethernet':
        return '🌐';
      default:
        return '✅';
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: getStatusColor(),
        borderColor: colors.border 
      }
    ]}>
      <Text style={styles.icon}>{getStatusIcon()}</Text>
      <Text style={[styles.text, { color: '#ffffff' }]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
});

export default ConnectionStatus;
