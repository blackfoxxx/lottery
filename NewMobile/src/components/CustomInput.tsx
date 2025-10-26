import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  onRightIconPress?: () => void;
  isRTL?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  isPassword = false,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isRTL = false,
  style,
  ...textInputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderRightIcon = () => {
    if (isPassword) {
      return (
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.rightIcon}
        >
          <Ionicons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={20} 
            color={COLORS.textSecondary} 
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      if (typeof rightIcon === 'string') {
        return (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons 
              name={rightIcon as keyof typeof Ionicons.glyphMap} 
              size={20} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        );
      } else {
        // It's a React node
        return rightIcon;
      }
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? COLORS.primary : COLORS.textSecondary} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.textSecondary}
          textAlign={isRTL ? 'right' : 'left'}
          {...textInputProps}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.marginMedium,
  },
  label: {
    fontSize: SIZES.fontMedium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.marginSmall,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusMedium,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.paddingMedium,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    paddingVertical: SIZES.paddingMedium,
  },
  leftIcon: {
    marginRight: SIZES.marginSmall,
  },
  rightIcon: {
    marginLeft: SIZES.marginSmall,
    padding: SIZES.paddingSmall,
  },
  errorText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    marginTop: SIZES.marginSmall,
  },
});

export default CustomInput;
