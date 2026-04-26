import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsCard } from '@/components/news/NewsCard';
import { getAllNews } from '@/data/news';

const NewsListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allNews = getAllNews();
  
  const categories = [
    'all',
    'general', 
    'updates',
    'partnerships',
    'security',
    'tips',
    'events'
  ];

  const filteredNews = selectedCategory === 'all' 
    ? allNews 
    : allNews.filter(item => item.category === selectedCategory);

  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-full w-full">
            {/* Building silhouettes */}
            <svg className="absolute right-0 top-0 h-full w-full" viewBox="0 0 1200 400" fill="currentColor">
              <polygon points="0,400 0,200 50,180 50,400" opacity="0.3"/>
              <polygon points="50,400 50,160 100,140 100,400" opacity="0.4"/>
              <polygon points="100,400 100,120 150,100 150,400" opacity="0.3"/>
              <polygon points="150,400 150,140 200,120 200,400" opacity="0.5"/>
              <polygon points="200,400 200,100 250,80 250,400" opacity="0.3"/>
              <polygon points="250,400 250,120 300,100 300,400" opacity="0.4"/>
              <polygon points="300,400 300,80 350,60 350,400" opacity="0.3"/>
              <polygon points="350,400 350,100 400,80 400,400" opacity="0.5"/>
              <polygon points="400,400 400,60 450,40 450,400" opacity="0.3"/>
              <polygon points="450,400 450,80 500,60 500,400" opacity="0.4"/>
            </svg>
          </div>
        </div>
        
        <div className="responsive-container relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6 font-ibm-plex-arabic">
            <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span>•</span>
            <span className="text-white">{t('news.allNews')}</span>
          </div>
          
          {/* Title */}
          <div className="">
            <h1 className="text-2xl sm:text-5xl font-bold font-ibm-plex-arabic">{t('news.allNews')}</h1>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="responsive-container">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="font-ibm-plex-arabic"
              >
                {category === 'all' ? t('filter') : t(`news.category.${category}`)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-white">
        <div className="responsive-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">
                <span className="text-gray-600">‹</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">
                3
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">
                <span className="text-gray-600">›</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsListPage;