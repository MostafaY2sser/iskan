
import React from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

const Properties: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('property.myProperties')}</h1>
      <p className="text-muted-foreground">{t('property.viewManage')}</p>
    </div>
  );
};

export default Properties;
