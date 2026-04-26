import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages, getLanguageByCode, Language } from '@/i18n/languages';

interface DirectionContextType {
  direction: 'ltr' | 'rtl';
  language: Language;
  setDirection: (direction: 'ltr' | 'rtl') => void;
  setLanguage: (languageCode: string) => void;
  toggleDirection: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};

interface DirectionProviderProps {
  children: React.ReactNode;
}

export const DirectionProvider: React.FC<DirectionProviderProps> = ({ children }) => {
  const [direction, setDirectionState] = useState<'ltr' | 'rtl'>('rtl');
  const [language, setLanguageState] = useState<Language>(languages[1]); // Default to Arabic

  // Initialize from localStorage or default to Arabic
  useEffect(() => {
    const savedDirection = localStorage.getItem('direction');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedDirection && (savedDirection === 'ltr' || savedDirection === 'rtl')) {
      setDirectionState(savedDirection);
    }
    
    if (savedLanguage) {
      const lang = getLanguageByCode(savedLanguage);
      if (lang) {
        setLanguageState(lang);
        setDirectionState(lang.dir);
      }
    }
  }, []);

  // Update HTML attributes when direction changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', direction);
    html.setAttribute('lang', language.code);
    
    // Update body classes
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(direction);
    
    // Save to localStorage
    localStorage.setItem('direction', direction);
    localStorage.setItem('language', language.code);
  }, [direction, language]);

  const setDirection = (newDirection: 'ltr' | 'rtl') => {
    setDirectionState(newDirection);
  };

  const setLanguage = (languageCode: string) => {
    const lang = getLanguageByCode(languageCode);
    if (lang) {
      setLanguageState(lang);
      setDirectionState(lang.dir);
    }
  };

  const toggleDirection = () => {
    const newDirection = direction === 'rtl' ? 'ltr' : 'rtl';
    setDirection(newDirection);
  };

  const value: DirectionContextType = {
    direction,
    language,
    setDirection,
    setLanguage,
    toggleDirection,
  };

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
};

export default DirectionProvider;
