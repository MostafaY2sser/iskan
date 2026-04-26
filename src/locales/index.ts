import en from './en/en';
import ar from './ar/ar';

export const translations = {
  en,
  ar,
};

export type AvailableLanguages = keyof typeof translations;
