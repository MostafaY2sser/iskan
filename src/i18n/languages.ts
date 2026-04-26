export interface Language {
  code: string;
  label: string;
  dir: 'ltr' | 'rtl';
  flag?: string;
}

export const languages: Language[] = [
  {
    code: 'en',
    label: 'English',
    dir: 'ltr',
    flag: '🇺🇸'
  },
  {
    code: 'ar',
    label: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦'
  }
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const getDefaultLanguage = (): Language => {
  return languages[1]; // Arabic as default
};