import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
  cancelable?: boolean;
  onCancel?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  transparent = true,
  cancelable = false,
  onCancel,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const defaultMessage = t('loading') || 'Loading...';

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      onRequestClose={cancelable ? onCancel : undefined}
    >
      <View style={[
        styles.overlay,
        { backgroundColor: transparent ? 'rgba(0, 0, 0, 0.5)' : colors.background }
      ]}>
        <View style={[
          styles.container,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.text,
          }
        ]}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.spinner}
          />
          <Text style={[
            styles.message,
            { color: colors.text }
          ]}>
            {message || defaultMessage}
          </Text>
          {__DEV__ && (
            <Text style={[
              styles.devHint,
              { color: colors.textSecondary }
            ]}>
              Development Mode
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: Dimensions.get('window').width * 0.8,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  devHint: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LoadingOverlay;
