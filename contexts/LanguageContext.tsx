import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import * as Updates from 'expo-updates';

type Language = 'en' | 'ar' | 'ku';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage) {
        const lang = savedLanguage as Language;
        setLanguage(lang);
        i18n.changeLanguage(lang);
        setIsRTL(lang === 'ar');
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (lang: Language) => {
    try {
      const newIsRTL = lang === 'ar';
      
      // Save language preference
      await AsyncStorage.setItem('app_language', lang);
      
      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update state
      setLanguage(lang);
      setIsRTL(newIsRTL);
      
      // Handle RTL layout change
      if (I18nManager.isRTL !== newIsRTL) {
        I18nManager.forceRTL(newIsRTL);
        
        // Reload app to apply RTL changes
        if (Updates.reloadAsync) {
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
