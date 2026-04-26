import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Calendar, Share2, Eye } from 'lucide-react';
import { getNewsBySlug, newsData } from '@/data/news';
import { NewsCard } from '@/components/news/NewsCard';

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  
  const newsItem = slug ? getNewsBySlug(slug) : undefined;
  const isRTL = i18n.language === 'ar';

  if (!newsItem) {
    return <Navigate to="/news" replace />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with breadcrumb and title */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <Link to="/" className="hover:underline">{t('nav.home')}</Link>
            <span>&gt;</span>
            <Link to="/news" className="hover:underline">{t('news.allNews')}</Link>
            <span>&gt;</span>
            <span>{newsItem.title}</span>
          </div>
          
          {/* Title under navigation */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 font-ibm-plex-arabic" dir={isRTL ? 'rtl' : 'ltr'}>
            {newsItem.title}
          </h1>
          
          {/* <Link to="/news">
            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              {isRTL ? (
                <ArrowRight className="w-4 h-4 ml-2" />
              ) : (
                <ArrowLeft className="w-4 h-4 mr-2" />
              )}
              {t('news.backToNews')}
            </Button>
          </Link> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-6">
            <img 
              src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
              alt={newsItem.title}
              className="w-full h-auto rounded-lg shadow-md"
              style={{ aspectRatio: '1296/418' }}
              loading="lazy"
            />
          </div>

          {/* Meta info under image */}
          <div className="flex flex-wrap items-center gap-4 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <Badge className="bg-primary font-ibm-plex-arabic">
              {t(`news.category.${newsItem.category}`)}
            </Badge>
            
            <div className="flex-1" /> 
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-ibm-plex-arabic">{formatDate(newsItem.date)}</span>
            </div>
        
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm">1,234 views</span>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
           
          </div>

          {/* Article Content - no border, aligned with image */}
          <div 
            className="prose prose-lg max-w-none font-ibm-plex-arabic leading-relaxed"
            dir={isRTL ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: newsItem.body }}
          />
        </div>
      </div>

      {/* Related News Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="responsive-container">
          <div className="max-w-6xl mx-auto">
          <h2
  dir={isRTL ? 'rtl' : 'ltr'}
  className="text-2xl sm:text-3xl font-bold text-foreground font-ibm-plex-arabic mb-8 text-start"
>
  {isRTL ? 'قد يعجبك أيضاً' : 'You might also like'}
</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsData.filter(n => n.slug !== newsItem.slug).slice(0, 3).map(item => (
                <Link 
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="font-ibm-plex-arabic">{formatDate(item.date)}</span>
                      </div>
                      <Badge 
                        variant="default" 
                        className="bg-[#2E4166] text-white font-ibm-plex-arabic text-xs px-2 py-1"
                      >
                        {t(`news.category.${item.category}`)}
                      </Badge>
                    </div>
                    <h3 
                      className="font-ibm-plex-arabic font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetailPage;