import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPreviewProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  className?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  address,
  className = ''
}) => {
  if (!latitude || !longitude) {
    return (
      <Card className={`border-dashed border-2 border-muted-foreground/25 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            لم يتم تحديد الموقع بعد
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            استخدم أدوات تحديد الموقع أعلاه لعرض الخريطة
          </p>
        </CardContent>
      </Card>
    );
  }

  // Generate Google Maps static image URL
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;
  
  // Generate Google Maps link
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  // For demo purposes, we'll use a placeholder image
  const placeholderMapUrl = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=خريطة+الموقع`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
          <MapPin className="w-5 h-5" />
          معاينة الموقع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Image */}
        <div className="relative rounded-lg overflow-hidden border">
          <img
            src={placeholderMapUrl}
            alt="خريطة الموقع"
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
              <MapPin className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-sm font-medium">موقع السكن</p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-2 text-right" dir="rtl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">الإحداثيات:</span>
            <span className="text-sm font-mono">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
          </div>
          {address && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">العنوان:</span>
              <span className="text-sm text-right max-w-[200px]">{address}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(googleMapsUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            فتح في خرائط جوجل
          </Button>
        </div>

        {/* Accuracy Note */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/30 rounded">
          ملاحظة: هذه معاينة تقريبية للموقع. في التطبيق الفعلي، ستظهر خريطة تفاعلية دقيقة.
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPreview;
