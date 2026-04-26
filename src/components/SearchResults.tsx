import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Loader2
} from 'lucide-react';
import type { ResidencePublicResponse } from '@/api/types';

interface SearchResultsProps {
  results: ResidencePublicResponse[];
  loading: boolean;
  error: string | null;
  onResultClick?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  onResultClick
}) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ر.س`;
  };

  const getResidenceTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'apartment': 'bg-blue-100 text-blue-800',
      'villa': 'bg-green-100 text-green-800',
      'studio': 'bg-purple-100 text-purple-800',
      'house': 'bg-orange-100 text-orange-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleResultClick = (residence: ResidencePublicResponse) => {
    navigate(`/residence/${residence.id}`);
    if (onResultClick) {
      onResultClick();
    }
  };

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <div className="p-4 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-gray-600">جاري البحث...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div className="p-4 text-center">
          <div className="text-red-600 mb-2">
            <Home className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div className="p-4 text-center">
          <Home className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">لا توجد نتائج للبحث</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-500 mb-2 px-2">
          {results.length} نتيجة
        </div>
        {results.map((residence) => (
          <Card 
            key={residence.id} 
            className="mb-2 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleResultClick(residence)}
          >
            <CardContent className="p-3">
              <div className="flex gap-3">
                {/* Property Image */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {residence.cover_photo_url ? (
                    <img
                      src={residence.cover_photo_url}
                      alt={residence.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {residence.name}
                    </h3>
                    <Badge className={`text-xs ${getResidenceTypeColor(residence.residence_type)}`}>
                      {residence.residence_type}
                    </Badge>
                  </div>

                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-3 h-3 ml-1" />
                    <span className="text-xs">{residence.city}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 ml-1" />
                      <span>{residence.bed_count}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 ml-1" />
                      <span>{residence.bathroom_count}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-3 h-3 ml-1" />
                      <span>{residence.rooms_count}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold text-blue-600">
                      {formatPrice(residence.price_with_commission)}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
