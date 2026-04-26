import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const SeoMeta: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />

      {/* Open Graph */}
      <meta property="og:title" content={t('meta.title')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GRH" />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="twitter:description" content={t('meta.description')} />
      <meta name="twitter:image" content="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" />
    </Helmet>
  );
};

export default SeoMeta;
