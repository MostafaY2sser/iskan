import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  BedSingle, 
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import CustomerDashboardLayoutNew from '@/layouts/CustomerDashboardLayoutNew';
import { residencesApi } from '@/api/endpoints/residences';
import type { ResidencePublicResponse } from '@/api/types';
import { toast } from 'sonner';
import BookingDialog from '@/components/BookingDialog';
import { useTranslation } from 'react-i18next';



const ResidenceDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [residence, setResidence] = useState<ResidencePublicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // SLider of Images :-------
  const next = () =>
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  
  const prev = () =>
    setCurrentImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
  );
  // SLider of Images :-------
  

  // Get Residence By Id :----------
  useEffect(() => {
    const fetchResidence = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await residencesApi.getResidenceById(parseInt(id));
        console.log('Residence data:', data);
        console.log('Residence services:', data.services);
        setResidence(data);
        
      } catch (error) {
        console.error('Error fetching residence:', error);
        toast.error(t('error_loading_property_data'));
      } finally {
        setLoading(false);
      }
    };

    fetchResidence();
  }, [id]);


   // get Property Gallery :-----------------
    useEffect(() => {
      if (!residence?.id) return;
  
      const fetchGallery = async () => {
        try {
          setLoadingImages(true);
  
          const res = await residencesApi.getPropertyGallery(residence.id);

          const results = res.results || res.data?.results || [];
          if (Array.isArray(results) && results.length > 0) {
            setGalleryImages(results.map((img: any) => img.public_url));
          } else {
            setGalleryImages([]);
          }
        } catch (error) {
          console.error('Error fetching gallery images:', error);
          setGalleryImages([]);
        } finally {
          setLoadingImages(false);
        }
      };
  
      fetchGallery();
    }, [residence?.id]);
  // get Property Gallery :-----------------
  
  

  if (loading) {
    return (
      <CustomerDashboardLayoutNew 
        title={t('property_details')} 
        subtitle={t('property_loading')}
      >
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('property_loading')}</p>
          </div>
        </div>
      </CustomerDashboardLayoutNew>                               
    );
  }

  if (!residence) {
    return (
      <CustomerDashboardLayoutNew 
        title={t('property_details')} 
        subtitle={t('property_not_found')}
      >
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{t('property_not_found')}</p>

          <Button onClick={() => navigate('/customer-properties')}>
            {t('back_to_properties')}
          </Button>
        </div>
      </CustomerDashboardLayoutNew>
    );
  }

  return (
    <CustomerDashboardLayoutNew title={t("property_details")} subtitle={residence.name}>
      <div className="">
        {/* Residence Details */}
        <div className="lg:col-span-2 rounded-md space-y-6 bg-[#ffffff]">

          {/* Property Image */}
          <div className="relative h-[220px] sm:h-[450px] bg-gray-200 rounded-t-md overflow-hidden">
            {loadingImages ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {t('loading')}...
              </div>
              ) : galleryImages.length > 0 ? (
                <img
                  src={galleryImages[currentImage]}
                  alt={`residence ${currentImage + 1}`}
                  className="w-full h-full  transition-all duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {t('no_images')}
                </div>
              )}
  
              {/* arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#DDD4BA] text-primary w-[40px] h-[40px]  rounded-full flex items-center justify-center"
                  >
                    <ChevronRight />
                  </button>
  
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#DDD4BA] text-primary w-[40px] h-[40px] rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </>
            )}
          </div>

          {/*  Main Info */}
          <div className="sm:p-4 p-2 pt-0 sm-pt-4">

            {/* Type */}
            <div className="flex items-center gap-2 mb-2 sm:mb-4 text-[#DDD4BA] text-xs sm:text-sm font-medium bg-primary rounded-md p-2  w-fit">
              <Home className="h-4 w-4 sm:h-6 sm:w-6" />
              <span>{residence.residence_type}</span>
            </div>

            {/* Name , Location , Price */}
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
              <div className="flex flex-col gap-1 sm:gap-2">
                <span className='text-base sm:text-3xl font-bold'>{residence.name}</span>
                <div className="flex items-center gap-2 text-[#5D6772] text-xs sm:text-base font-medium">
                  <MapPin className="w-4 h-4 " />
                  <span>{residence.city}, {residence.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                
                { residence.price_period === "monthly" 
                  ? (
                      <>
                        <h4 className='text-xl sm:text-2xl font-bold '> {parseFloat(residence.price_with_commission.toFixed(1))} {t('currency')} </h4>
                        <span className='text-[#516180] text-xs sm:text-sm font-semibold'>{t('person_per_month')}</span>
                      </>
                    ) 
                  : (
                      <>
                        {/* <h4 className='text-xl sm:text-2xl font-bold '> {residence.price_with_commission * 12} {t('currency')} </h4> */}
                        <h4 className='text-xl sm:text-2xl font-bold '> {parseFloat((residence.price_with_commission ).toFixed(1))} {t('currency')} </h4>
                        <span className='text-[#516180] text-xs sm:text-sm font-semibold'>{t('per_person_per_year')}</span>
                      </>
                    )
                }
              </div>
            </div>

            {/*  */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 py-6 flex-wrap w-[100%] sm:w-[60%]">
              <div className="flex items-center justify-center gap-2 bg-[#F7F8FA] p-4 rounded-md text-[#5D6772] text-sm">
                <BedSingle className="w-4 h-4" />
                <span>{residence.bed_count} {t('bed')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-[#F7F8FA] p-4 rounded-md text-[#5D6772] text-sm">
                <Home className="w-4 h-4" />
                <span>{residence.rooms_count} {t('rooms')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-[#F7F8FA] p-4 rounded-md text-[#5D6772] text-sm">
                <Home className="w-4 h-4" />
                <span>{residence.bathroom_count} {t('baths')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-[#F7F8FA] p-4 rounded-md text-[#5D6772] text-sm">
                <Home className="w-4 h-4" />
                <span>{residence.kitchen_count} {t('kitchen')}</span>
              </div>
            </div>

            {/* Description */}
            <div className="">
              <h3 className="text-base sm:text-2xl font-bold mb-2 sm:mb-4">{t('description')}</h3>
              <p>{residence.description}</p>
            </div>

            {/*  */}
            <div className="mt-6">
              <h2  className='text-primary text-base sm:text-2xl font-bold mb-4'>{t('detailed_specifications')}</h2>
              <div className=''>
                  <div className='flex items-center justify-between mb-2 sm:mb-4'>
                    <p className='text-sm sm:text-base'> {t('building_year')} :</p>
                    <span className='text-xs sm:text-base'>{residence.building_year}</span>
                  </div>
                  <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm sm:text-base'> {t('building_type')} :</p>
                    <span className='text-xs sm:text-base'>{residence.residence_type}</span>
                  </div>
                  {residence.is_renewed && (
                    <div className='flex items-center justify-between mb-4'>
                      <p className='text-sm sm:text-base'> مجدد :</p>
                      <span className='text-xs sm:text-base'>{ residence.is_renewed === true ? "نعم" : "لا" }</span>
                    </div>
                  )}
                  <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm sm:text-base'> {t('nearby_landmarks')} :</p>
                    <span className='text-xs sm:text-base'> {residence.nearby_landmarks }</span>
                  </div>
                  <div className='flex items-center justify-between mb-4'>
                    <p className='text-sm sm:text-base'> {t('price_period')} :</p>
                    <span className='text-xs sm:text-base'>{residence.price_period === "monthly" ? t('monthly') : t('yearly') }</span>
                  </div>
              </div>
            </div>
            {/*  */}

            {/* Services */}
            {residence.services && residence.services.length > 0 && (
              <div className="mt-8">
                <h3 className="text-bbase sm:text-2xl font-bold mb-4">{t('available_services')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {residence.services.map((service, index) => (
                    <div key={index} className="flex items-center  gap-2 ">
                      <span className='text-sm sm:text-base'>{service.name}</span>
                      {service.extra_cost && service.extra_cost > 0 && (
                        <Badge variant="secondary">+{service.extra_cost} {t('currency')}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Dialog Trigger */}
            <BookingDialog 
              residence={residence}
              onBookingCreated={(bookingId) => {
                toast.success(t('booking_success'));
                navigate('/customer-bookings');
              }}
              trigger={
                <div className='flex justify-end'>
                  <Button className="bg-primary text-[#DDD4BA] text-sm font-semibold mt-6 w-full ">
                    {t('book_this_property')}
                  </Button>
                </div>
              }
            />

          </div>
          {/*  Main Info */}

        </div>
      </div>
    </CustomerDashboardLayoutNew>
  );
};

export default ResidenceDetailsPage;







 