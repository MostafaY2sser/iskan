
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '@/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const PropertyOwnerLayout: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">بوابة مالك العقار</h1>
        <LanguageSwitcher />
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PropertyOwnerLayout;
