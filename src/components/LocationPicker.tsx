import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Crosshair,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import MapPreview from './MapPreview';

interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
  district?: string;
  city?: string;
  formatted_address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const [location, setLocation] = useState<LocationData>(initialLocation || {});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    console.log('📍 Getting current location...');
    
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      toast.error('الموقع الجغرافي غير مدعوم في هذا المتصفح');
      return;
    }

    setIsGettingLocation(true);
    setLocationStatus('idle');
    toast.info('جاري تحديد موقعك الحالي...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('✅ GPS coordinates received:', { latitude, longitude });
        
        try {
          // Reverse geocoding to get address
          toast.info('جاري تحديد العنوان...');
          const address = await reverseGeocode(latitude, longitude);
          const newLocation: LocationData = {
            latitude,
            longitude,
            ...address
          };
          
          console.log('✅ Complete location data:', newLocation);
          setLocation(newLocation);
          onLocationSelect(newLocation);
          setLocationStatus('success');
          toast.success(`تم تحديد الموقع بنجاح: ${newLocation.city || 'موقع غير محدد'}`);
        } catch (error) {
          console.error('⚠️ Error getting address:', error);
          const newLocation: LocationData = { latitude, longitude };
          setLocation(newLocation);
          onLocationSelect(newLocation);
          setLocationStatus('success');
          toast.success(`تم تحديد الإحداثيات: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        setIsGettingLocation(false);
        setLocationStatus('error');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('تم رفض الوصول للموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('الموقع غير متاح حالياً. تأكد من تفعيل GPS');
            break;
          case error.TIMEOUT:
            toast.error('انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى');
            break;
          default:
            toast.error('حدث خطأ في تحديد الموقع');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }, [onLocationSelect]);

  // Reverse geocoding function (mock implementation)
  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    // In a real implementation, you would use a service like Google Maps API, OpenStreetMap, or similar
    // For now, we'll return a mock response based on Saudi Arabia regions
    
    // Mock data for demonstration
    const mockAddresses = [
      { district: 'حي الملز', city: 'الرياض', formatted_address: 'حي الملز، الرياض، المملكة العربية السعودية' },
      { district: 'حي العليا', city: 'الرياض', formatted_address: 'حي العليا، الرياض، المملكة العربية السعودية' },
      { district: 'حي الروضة', city: 'جدة', formatted_address: 'حي الروضة، جدة، المملكة العربية السعودية' },
      { district: 'حي الزهراء', city: 'الدمام', formatted_address: 'حي الزهراء، الدمام، المملكة العربية السعودية' }
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return random mock address for demonstration
    return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
  };

  // Search for location by address
  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      toast.error('يرجى إدخال عنوان للبحث');
      return;
    }

    console.log('🔍 Searching for location:', searchQuery);
    setIsLoading(true);
    setLocationStatus('idle');
    toast.info('جاري البحث عن الموقع...');
    
    try {
      // Mock geocoding - in real implementation, use Google Maps Geocoding API or similar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock coordinates for Saudi cities
      const mockResults: Record<string, LocationData> = {
        'الرياض': { latitude: 24.7136, longitude: 46.6753, city: 'الرياض', district: 'وسط المدينة', formatted_address: 'الرياض، المملكة العربية السعودية' },
        'جدة': { latitude: 21.4858, longitude: 39.1925, city: 'جدة', district: 'وسط المدينة', formatted_address: 'جدة، المملكة العربية السعودية' },
        'الدمام': { latitude: 26.4207, longitude: 50.0888, city: 'الدمام', district: 'وسط المدينة', formatted_address: 'الدمام، المملكة العربية السعودية' },
        'مكة': { latitude: 21.3891, longitude: 39.8579, city: 'مكة المكرمة', district: 'وسط المدينة', formatted_address: 'مكة المكرمة، المملكة العربية السعودية' },
        'المدينة': { latitude: 24.4686, longitude: 39.6142, city: 'المدينة المنورة', district: 'وسط المدينة', formatted_address: 'المدينة المنورة، المملكة العربية السعودية' },
        'الطائف': { latitude: 21.2703, longitude: 40.4178, city: 'الطائف', district: 'وسط المدينة', formatted_address: 'الطائف، المملكة العربية السعودية' }
      };

      const foundLocation = Object.keys(mockResults).find(city => 
        searchQuery.toLowerCase().includes(city) || city.includes(searchQuery)
      );

      if (foundLocation) {
        const newLocation = mockResults[foundLocation];
        console.log('✅ Location found:', newLocation);
        setLocation(newLocation);
        onLocationSelect(newLocation);
        setLocationStatus('success');
        toast.success(`تم العثور على الموقع: ${newLocation.city}`);
      } else {
        // Default to Riyadh if not found
        const defaultLocation = mockResults['الرياض'];
        console.log('⚠️ Location not found, using default:', defaultLocation);
        setLocation(defaultLocation);
        onLocationSelect(defaultLocation);
        setLocationStatus('success');
        toast.success('تم تحديد موقع افتراضي في الرياض');
      }
    } catch (error) {
      console.error('❌ Error searching location:', error);
      setLocationStatus('error');
      toast.error('حدث خطأ في البحث عن الموقع');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual coordinate input
  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    console.log(`📝 Manual coordinate input - ${field}:`, value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newLocation = { ...location, [field]: numValue };
      console.log('📍 Updated location:', newLocation);
      setLocation(newLocation);
      onLocationSelect(newLocation);
      
      // Check if both coordinates are now available
      if (newLocation.latitude && newLocation.longitude) {
        setLocationStatus('success');
        toast.success(`تم تحديث الإحداثيات: ${newLocation.latitude.toFixed(4)}, ${newLocation.longitude.toFixed(4)}`);
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Location Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
            <Search className="w-5 h-5" />
            البحث عن الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2" dir="rtl">
            <Input
              placeholder="ابحث عن العنوان أو المدينة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              className="text-right flex-1"
              dir="rtl"
            />
            <Button 
              onClick={searchLocation} 
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
            <Navigation className="w-5 h-5" />
            الموقع الحالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            {isGettingLocation ? 'جاري تحديد الموقع...' : 'استخدام الموقع الحالي'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Location Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
            <MapPin className="w-5 h-5" />
            مواقع سريعة للتجربة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
              { name: 'جدة', lat: 21.4858, lng: 39.1925 },
              { name: 'الدمام', lat: 26.4207, lng: 50.0888 },
              { name: 'مكة', lat: 21.3891, lng: 39.8579 }
            ].map((city) => (
              <Button
                key={city.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log(`🏙️ Quick select: ${city.name}`);
                  const newLocation: LocationData = {
                    latitude: city.lat,
                    longitude: city.lng,
                    city: city.name,
                    district: 'وسط المدينة',
                    formatted_address: `${city.name}، المملكة العربية السعودية`
                  };
                  setLocation(newLocation);
                  onLocationSelect(newLocation);
                  setLocationStatus('success');
                  toast.success(`تم اختيار موقع ${city.name}`);
                }}
                className="text-right"
                dir="rtl"
              >
                {city.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Coordinates Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right" dir="rtl">
            <MapPin className="w-5 h-5" />
            إدخال الإحداثيات يدوياً
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-right">خط العرض (Latitude)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="مثال: 24.7136"
                value={location.latitude || ''}
                onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-right">خط الطول (Longitude)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="مثال: 46.6753"
                value={location.longitude || ''}
                onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      {location.latitude && location.longitude && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-right" dir="rtl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">تم تحديد الموقع بنجاح</p>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-green-700">
                    <strong>الإحداثيات:</strong> {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                  </p>
                  {location.city && (
                    <p className="text-sm text-green-700">
                      <strong>المدينة:</strong> {location.city}
                    </p>
                  )}
                  {location.district && (
                    <p className="text-sm text-green-700">
                      <strong>الحي:</strong> {location.district}
                    </p>
                  )}
                  {location.formatted_address && (
                    <p className="text-sm text-green-700">
                      <strong>العنوان:</strong> {location.formatted_address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Status Error */}
      {locationStatus === 'error' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-right" dir="rtl">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">فشل في تحديد الموقع</p>
                <p className="text-sm text-red-700">يرجى المحاولة مرة أخرى أو إدخال الإحداثيات يدوياً</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Preview */}
      <MapPreview
        latitude={location.latitude}
        longitude={location.longitude}
        address={location.formatted_address}
      />
    </div>
  );
};

export default LocationPicker;
