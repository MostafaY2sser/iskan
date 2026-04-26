import { useTranslation } from 'react-i18next';
import { getLanguageByCode } from '@/i18n/languages';

/**
 * Hook to get the current text direction (ltr/rtl) based on the current language
 */
export const useDir = (): 'ltr' | 'rtl' => {
  const { i18n } = useTranslation();
  const currentLanguage = getLanguageByCode(i18n.language);
  return currentLanguage?.dir || 'ltr';
};

/**
 * Hook to check if the current language is RTL
 */
export const useIsRTL = (): boolean => {
  const dir = useDir();
  return dir === 'rtl';
};

export default useDir;