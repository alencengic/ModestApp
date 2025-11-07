import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n/i18n.config';
import { useAuth } from './AuthContext';

const GLOBAL_LANGUAGE_STORAGE_KEY = '@modest_app_language';
const getUserLanguageKey = (userId: string) => `@modest_app_language_${userId}`;

export type LanguageCode = 'en' | 'hr';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

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

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n: i18nInstance } = useTranslation();
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    i18nInstance.language as LanguageCode || 'en'
  );

  // Load saved language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        let savedLanguage = null;
        
        // Try to load user-specific language first
        if (user?.id) {
          savedLanguage = await AsyncStorage.getItem(getUserLanguageKey(user.id));
        }
        
        // Fallback to global language if no user-specific language
        if (!savedLanguage) {
          savedLanguage = await AsyncStorage.getItem(GLOBAL_LANGUAGE_STORAGE_KEY);
        }
        
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hr')) {
          await i18nInstance.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, [user?.id]);

  const changeLanguage = async (lang: LanguageCode) => {
    try {
      await i18nInstance.changeLanguage(lang);
      setCurrentLanguage(lang);
      
      // Save language preference
      if (user?.id) {
        // Save user-specific language
        await AsyncStorage.setItem(getUserLanguageKey(user.id), lang);
      } else {
        // Save global language if no user
        await AsyncStorage.setItem(GLOBAL_LANGUAGE_STORAGE_KEY, lang);
      }
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
