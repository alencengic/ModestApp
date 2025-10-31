import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en';
import hr from './locales/hr';
import { FOODS_EN } from './foods/en';
import { FOODS_HR } from './foods/hr';

// Get device locale safely
const getDeviceLanguage = () => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const languageCode = locales[0].languageCode;
      return languageCode === 'hr' ? 'hr' : 'en';
    }
  } catch (error) {
    console.warn('Failed to get device locale:', error);
  }
  return 'en'; // Default to English
};

const deviceLanguage = getDeviceLanguage();

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      hr: {
        translation: hr,
      },
    },
    lng: deviceLanguage === 'hr' ? 'hr' : 'en', // Default to device language or English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Food translations mapping
export const getFoodTranslations = (language: string) => {
  return language === 'hr' ? FOODS_HR : FOODS_EN;
};

// Function to get food translation by index
export const translateFood = (foodName: string, targetLanguage: string): string => {
  const enFoods = FOODS_EN;
  const hrFoods = FOODS_HR;

  // If we're translating to Croatian
  if (targetLanguage === 'hr') {
    const index = enFoods.indexOf(foodName);
    return index !== -1 ? hrFoods[index] : foodName;
  }

  // If we're translating to English
  if (targetLanguage === 'en') {
    const index = hrFoods.indexOf(foodName);
    return index !== -1 ? enFoods[index] : foodName;
  }

  return foodName;
};

export default i18n;
