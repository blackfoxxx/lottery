import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SIZES } from '../constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  testID,
}) => {
  const colors = COLORS;
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: SIZES.borderRadiusMedium,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: variant === 'outline' ? 1 : 0,
    };

    // Size styles
    const sizeStyles: ViewStyle = (() => {
      switch (size) {
        case 'small':
          return {
            paddingHorizontal: SIZES.paddingMedium,
            paddingVertical: SIZES.paddingSmall,
            minHeight: 36,
          };
        case 'large':
          return {
            paddingHorizontal: SIZES.paddingXLarge,
            paddingVertical: SIZES.paddingLarge,
            minHeight: 54,
          };
        default: // medium
          return {
            paddingHorizontal: SIZES.paddingLarge,
            paddingVertical: SIZES.paddingMedium,
            minHeight: 45,
          };
      }
    })();

    // Variant styles
    const variantStyles: ViewStyle = (() => {
      switch (variant) {
        case 'secondary':
          return {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: colors.primary,
          };
        case 'danger':
          return {
            backgroundColor: colors.error,
          };
        default: // primary
          return {
            backgroundColor: colors.primary,
          };
      }
    })();

    // Disabled styles
    const disabledStyles: ViewStyle = disabled ? {
      opacity: 0.6,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles,
      ...variantStyles,
      ...disabledStyles,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size styles
    const sizeStyles: TextStyle = (() => {
      switch (size) {
        case 'small':
          return { fontSize: SIZES.fontSmall };
        case 'large':
          return { fontSize: SIZES.fontLarge };
        default: // medium
          return { fontSize: SIZES.fontMedium };
      }
    })();

    // Variant styles
    const variantStyles: TextStyle = (() => {
      switch (variant) {
        case 'secondary':
          return { color: colors.text };
        case 'outline':
          return { color: colors.primary };
        case 'danger':
          return { color: colors.background };
        default: // primary
          return { color: colors.background };
      }
    })();

    return {
      ...baseStyle,
      ...sizeStyles,
      ...variantStyles,
    };
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.background} 
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
