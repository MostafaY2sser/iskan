import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { NewsItem } from '@/data/news';

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, className }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    navigate(`/news/${news.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-shadow flex flex-col h-full ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${t('news.readMore')}: ${news.title}`}
    >
      <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
        <img 
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <CardContent className="p-4 sm:p-5 lg:p-6 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge variant="secondary" className="font-ibm-plex-arabic text-xs sm:text-sm">
            {t(`news.category.${news.category}`)}
          </Badge>
          <time className="text-xs sm:text-sm text-muted-foreground font-ibm-plex-arabic">
            {formatDate(news.date)}
          </time>
        </div>
        
        <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors font-ibm-plex-arabic text-wrap">
          {news.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 font-ibm-plex-arabic text-wrap flex-1">
          {news.excerpt}
        </p>
      </CardContent>
    </Card>
  );
};