import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
};

export default I18nProvider;