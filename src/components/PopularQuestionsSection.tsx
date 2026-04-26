import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, Section } from '@/components/ui/responsive-container';
import { getPopularFaqs, getFaqsByCategory } from '@/data/faq';
import FaqItem from '@/components/FaqItem';

const PopularQuestionsSection: React.FC = () => {
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const popularFaqs = getPopularFaqs();
  
  // Group FAQs by category for display
  const platformFaqs = getFaqsByCategory('platform').filter(faq => faq.popular);
  const companyFaqs = getFaqsByCategory('company').filter(faq => faq.popular);
  const ownerFaqs = getFaqsByCategory('owner').filter(faq => faq.popular);

  const categories = [
    {
      key: 'platform',
      title: t('faq.categories.platform'),
      faqs: platformFaqs
    },
    {
      key: 'company', 
      title: t('faq.categories.company'),
      faqs: companyFaqs
    },
    {
      key: 'owner',
      title: t('faq.categories.owner'),
      faqs: ownerFaqs
    }
  ].filter(category => category.faqs.length > 0);

  return (
    <Section 
      id="popular-questions" 
      anchor 
      className="bg-gradient-to-b from-background to-muted/30"
    >
      <ResponsiveContainer>
        <div className="text-center m-8 sm:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-ibm-plex-arabic">
            {t('faq.sectionTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-ibm-plex-arabic">
            {t('faq.sectionSubtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category) => (
            <div key={category.key} className="space-y-4">
              <h3 className={`text-base md:text-2xl font-bold text-foreground  ${isRTL? "text-right" : "text-left"} font-ibm-plex-arabic mb-3 sm:mb-6`}>
                {category.title}
              </h3>
              
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq) => (
                  <FaqItem 
                    key={faq.id}
                    faq={faq}
                    value={faq.id}
                  />
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};

export default PopularQuestionsSection;