import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { getLatestNews } from '@/data/news';

export const HomeNewsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const latestNews = getLatestNews(3);
  const isRTL = i18n.language === 'ar';

  return (
    <section 
      id="news" 
      className="py-8 sm:py-16 lg:py-20 bg-muted/30 anchor-offset" 
    >
      <div className="responsive-container">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 font-ibm-plex-arabic">
            {t('news.sectionTitle')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-ibm-plex-arabic max-w-2xl mx-auto">
            {t('news.sectionSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
          {latestNews.map((newsItem) => (
            <NewsCard 
              key={newsItem.id} 
              news={newsItem}
              className="bg-white h-full"
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/news">
            <Button 
              variant="outline" 
              size="lg" 
              className="touch-target bg-[#2E4166] text-white border-[#2E4166] hover:bg-[#2E4166]/90 hover:text-white font-ibm-plex-arabic"
            >
              {t('news.exploreAll')}
              {isRTL ? (
                <ArrowLeft className="ml-2 h-4 w-4" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};