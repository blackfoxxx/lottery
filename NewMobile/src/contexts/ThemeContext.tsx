import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { apiManager } from '../services/ApiManager';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  golden: string;
  silver: string;
  bronze: string;
  platinum: string;
}

const lightTheme: ThemeColors = {
  primary: '#f53003',        // Backend primary red-orange
  secondary: '#5856D6',      // Keep iOS secondary
  success: '#34C759',        // Keep iOS success green
  warning: '#FF9500',        // Keep iOS warning orange
  error: '#FF3B30',          // Keep iOS error red
  background: '#FDFDFC',     // Backend light background
  surface: '#FFFFFF',        // Backend light surface (white)
  text: '#1b1b18',          // Backend light primary text
  textSecondary: '#706f6c',  // Backend light secondary text
  border: '#e3e3e0',        // Backend light border
  card: '#FFFFFF',          // Backend light surface
  golden: '#fbbf24',        // Keep existing golden
  silver: '#9ca3af',        // Keep existing silver
  bronze: '#ea580c',        // Keep existing bronze
  platinum: '#e5e7eb',      // Keep existing platinum
};

const darkTheme: ThemeColors = {
  primary: '#FF4433',        // Backend primary red-orange (dark)
  secondary: '#5E5CE6',      // Keep iOS secondary (dark)
  success: '#30D158',        // Keep iOS success green (dark)
  warning: '#FF9F0A',        // Keep iOS warning orange (dark)
  error: '#FF453A',          // Keep iOS error red (dark)
  background: '#0a0a0a',     // Backend dark background
  surface: '#161615',        // Backend dark surface
  text: '#EDEDEC',          // Backend dark primary text
  textSecondary: '#A1A09A',  // Backend dark secondary text
  border: '#3E3E3A',        // Backend dark border
  card: '#161615',          // Backend dark surface
  golden: '#fbbf24',        // Keep existing golden
  silver: '#9ca3af',        // Keep existing silver
  bronze: '#ea580c',        // Keep existing bronze
  platinum: '#e5e7eb',      // Keep existing platinum
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors | null>(null);

  useEffect(() => {
    loadThemePreference();
    loadBackendColors();
  }, []);

  useEffect(() => {
    // Reload backend colors when theme changes
    if (customColors) {
      loadBackendColors();
    }
  }, [isDarkMode]);

  const loadBackendColors = async (themeMode?: boolean) => {
    try {
      const backendColors = await apiManager.getThemeColors();
      const currentMode = themeMode !== undefined ? themeMode : isDarkMode;
      
      if (backendColors && backendColors.light && backendColors.dark) {
        // Create enhanced theme colors with backend values
        const enhancedLightTheme: ThemeColors = {
          ...lightTheme,
          primary: backendColors.light.primary || lightTheme.primary,
          background: backendColors.light.background || lightTheme.background,
          surface: backendColors.light.surface || lightTheme.surface,
          text: backendColors.light.text || lightTheme.text,
          textSecondary: backendColors.light.textSecondary || lightTheme.textSecondary,
          border: backendColors.light.border || lightTheme.border,
        };

        const enhancedDarkTheme: ThemeColors = {
          ...darkTheme,
          primary: backendColors.dark.primary || darkTheme.primary,
          background: backendColors.dark.background || darkTheme.background,
          surface: backendColors.dark.surface || darkTheme.surface,
          text: backendColors.dark.text || darkTheme.text,
          textSecondary: backendColors.dark.textSecondary || darkTheme.textSecondary,
          border: backendColors.dark.border || darkTheme.border,
        };

        setCustomColors(currentMode ? enhancedDarkTheme : enhancedLightTheme);
      }
    } catch (error) {
      console.log('Using default theme colors');
    }
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      
      // Save to AsyncStorage immediately
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme ? 'dark' : 'light');
      
      // Reload backend colors for the new theme
      await loadBackendColors();
      
      console.log(`Theme switched to: ${newTheme ? 'dark' : 'light'}`);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Revert the theme change if saving failed
      setIsDarkMode(isDarkMode);
    }
  };

  const colors = customColors || (isDarkMode ? darkTheme : lightTheme);

  const value: ThemeContextType = {
    isDarkMode,
    colors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
