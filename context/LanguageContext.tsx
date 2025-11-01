import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from '../i18n/i18n.config';

const LANGUAGE_STORAGE_KEY = '@modest_app_language';

export type LanguageCode = 'en' | 'hr';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

// Language names are kept in English and native form
// The UI displaying these should use the current language for labels
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
];

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (lang: LanguageCode) => Promise<void>;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get device language
const getDeviceLanguage = (): LanguageCode => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const languageCode = locales[0].languageCode;
      // Return 'hr' if device is Croatian, otherwise default to English
      return languageCode === 'hr' ? 'hr' : 'en';
    }
  } catch (error) {
    console.warn('Failed to get device locale:', error);
  }
  return 'en'; // Default to English
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved language on mount, or use device language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        let languageToUse: LanguageCode;

        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hr')) {
          // Use saved language
          languageToUse = savedLanguage;
        } else {
          // Use device language if no saved preference
          languageToUse = getDeviceLanguage();
        }

        await i18nInstance.changeLanguage(languageToUse);
        setCurrentLanguage(languageToUse);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading language:', error);
        // Fallback to English on error
        await i18nInstance.changeLanguage('en');
        setCurrentLanguage('en');
        setIsInitialized(true);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang: LanguageCode) => {
    try {
      await i18nInstance.changeLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
