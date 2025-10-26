import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle | ImageStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 100, 
  style, 
  resizeMode = 'contain' 
}) => {
  return (
    <Image
      source={require('../../assets/icon.png')}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode={resizeMode}
      accessibilityLabel="بلخير"
      accessibilityRole="image"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Default styles can be added here if needed
  },
});

export default Logo;
