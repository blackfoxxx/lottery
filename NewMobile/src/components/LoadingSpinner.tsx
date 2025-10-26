import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES, MESSAGES } from '../constants';

interface LoadingSpinnerProps {
  visible?: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  text = MESSAGES.LOADING,
  overlay = false,
  size = 'large',
  color = COLORS.primary,
  style,
}) => {
  if (!visible) return null;

  const content = (
    <View style={[styles.container, !overlay && styles.inline, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inline: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.paddingLarge,
  },
  content: {
    backgroundColor: COLORS.background,
    padding: SIZES.paddingLarge,
    borderRadius: SIZES.borderRadiusLarge,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    marginTop: SIZES.marginMedium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
