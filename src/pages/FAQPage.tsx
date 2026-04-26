import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, Section } from '@/components/ui/responsive-container';
import { getAllFaqs, getFaqsByCategory } from '@/data/faq';
import FaqItem from '@/components/FaqItem';

const FAQPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const allFaqs = getAllFaqs();
  
  const categories = [
    { key: 'all', label: t('faq.categories.all') },
    { key: 'platform', label: t('faq.categories.platform') },
    { key: 'company', label: t('faq.categories.company') },
    { key: 'owner', label: t('faq.categories.owner') }
  ];

  const filteredFaqs = useMemo(() => {
    let faqs = selectedCategory === 'all' 
      ? allFaqs 
      : getFaqsByCategory(selectedCategory);
      
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return faqs;
  }, [searchQuery, selectedCategory, allFaqs]);

  // Group filtered FAQs by category
  const groupedFaqs = useMemo(() => {
    const groups = new Map<string, typeof filteredFaqs>();
    
    filteredFaqs.forEach(faq => {
      const category = faq.category;
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(faq);
    });
    
    return Array.from(groups.entries()).map(([category, faqs]) => ({
      category,
      title: t(`faq.categories.${category}`),
      faqs
    }));
  }, [filteredFaqs, t]);

  // SEO structured data
  React.useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [allFaqs]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Section className="bg-gradient-to-b from-primary/5 to-background border-b">
        <ResponsiveContainer>
          <div className="py-8">
            <Link 
              to="/#popular-questions"
              className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <span className="font-ibm-plex-arabic">{t('faq.back')}</span>
              {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-ibm-plex-arabic">
                {t('faq.allFaq')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-ibm-plex-arabic">
                {t('faq.sectionSubtitle')}
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </Section>

      {/* Search and Filters */}
      <Section>
        <ResponsiveContainer>
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10 text-right' : 'pl-10 text-left'} font-ibm-plex-arabic`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 font-ibm-plex-arabic"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </Section>

      {/* FAQ Content */}
      <Section>
        <ResponsiveContainer>
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg font-ibm-plex-arabic">
                  {t('faq.noResults')}
                </p>
              </div>
            ) : selectedCategory === 'all' ? (
              // Show grouped by category when "all" is selected
              <div className="space-y-12">
                {groupedFaqs.map((group) => (
                  <div key={group.category} className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground text-right font-ibm-plex-arabic">
                      {group.title}
                    </h2>
                    
                    <Accordion type="single" collapsible className="space-y-3">
                      {group.faqs.map((faq) => (
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
            ) : (
              <div className="space-y-4">
                <Accordion type="single" collapsible className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <FaqItem 
                      key={faq.id}
                      faq={faq}
                      value={faq.id}
                    />
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </Section>
    </div>
  );
};

export default FAQPage;