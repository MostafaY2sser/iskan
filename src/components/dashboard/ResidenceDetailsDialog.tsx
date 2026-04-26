import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Clock,
  CircleCheckBig,
  X,
  Mail,
  ChevronsLeft,
  ChevronsRight,
  User,
  Phone,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import type { ResidenceOwnerResponse } from '@/api/types';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { bookingsApi, residencesApi } from '@/api';
import ContactAmbassador from './ContactAmbassador';


const ResidenceDetailsDialog: React.FC = () => {

  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'reviews' | 'contact'
  >('overview');
    const { t , i18n } = useTranslation()  
    const isRTL = i18n.language === 'ar';
    const location = useLocation();
    const residence = location.state?.residence as ResidenceOwnerResponse | undefined;
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [ showContactAmbassador , setShowContactAmbassador ] = useState(false)
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
    

  if (!residence) {
    return <div>لا توجد بيانات للعقار</div>;
  }

  useEffect(() => {
    if (activeTab !== 'bookings') return;
    if (!residence?.id) return;

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        setBookingsError(null);

        const response = await bookingsApi.getApprovedBookingsByResidence(residence.id);
        setBookings(response);
      } catch (error) {
        console.error(error);
        setBookingsError('حدث خطأ أثناء تحميل الحجوزات');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [activeTab, residence?.id]);


  // Booking Filter :------
  const filteredBookings = bookings.filter((booking: any) => {
    const keyword = search.toLowerCase();

    return (
      booking.id?.toString().includes(keyword) ||
      booking.status?.toLowerCase().includes(keyword)
    );
  });
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  // Booking Filter :------
  

  // get Property Gallery :-----------------
  useEffect(() => {
    if (!residence?.id) return;

    const fetchGallery = async () => {
      try {
        setLoadingImages(true);

        const res = await residencesApi.getPropertyGallery(residence.id);
        console.log('Gallery API response:', res);

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




  const formatPrice = (price: number | undefined | null) => {
    if (!price || isNaN(price)) {
      return t('not_specified');
    }
    return `${price.toLocaleString()}  ${t('currency')}`;
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return t('not_specified') ;
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'تاريخ غير صحيح';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'تاريخ غير صحيح';
    }
  };


  // Residence  Status :-------------
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'approved': { variant: 'default' as const, className: 'bg-[#00A47E] text-[#ffffff] font-[400] text-[12px]', text: t('approved') , icon: <Clock className="w-4 h-4 mx-1 text-[#ffffff]"/>},
      'pending': { variant: 'secondary' as const, className: 'bg-[#FFBB55] text-[#ffffff] font-[400] text-[12px]', text: t('pending') , icon: <CircleCheckBig className="w-4 h-4 mx-1 text-[#ffffff]" />},
      'rejected': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 font-[400] text-[12px]', text: t('rejected') , icon: <X className="w-4 h-4 mx-1 text-red-800"/>},
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };
  // Residence  Status :-------------


  
  return (
    <div className='bg-[#ffffff] rounded-md'>

      <div className="images">
        <div className="relative h-[220px] md:h-[450px] bg-gray-200 rounded-t-md overflow-hidden">
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

      </div>




      <div className="p-2 sm:p-4">

        {/* Taps  */}
        <div className="flex gap-1 md:gap-3 border-b my-4 md:my-6 mb-0 sm:mb-6 rounded-md text-sm font-medium bg-[#2E4166] px-[10px] md:px-[30px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 md:py-4 px-2 sm:px-4 md:px-8 text-xs md:text-sm font-semibold sm:font-bold ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#DDD4BA] text-[#DDD4BA]'
                : 'text-[#ffffff]'
            }`}
          >
           {t('overview')}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 md:py-4 px-4 md:px-8 text-xs md:text-sm font-semibold sm:font-bold  ${
              activeTab === 'bookings'
                ? 'border-b-2 border-[#DDD4BA] text-[#DDD4BA]'
                : 'text-[#ffffff]'
            }`}
          >
            {t('bookings')}
          </button>

          {/* <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 md:py-4 px-4 md:px-8 text-xs md:text-sm font-semibold sm:font-bold  ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#DDD4BA] text-[#DDD4BA]'
                : 'text-[#ffffff]'
            }`}
          >
            {t('reviews')}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 md:py-4 px-4 md:px-8 text-xs md:text-sm font-semibold sm:font-bold  ${
              activeTab === 'contact'
                ? 'border-b-2 border-[#DDD4BA] text-[#DDD4BA]'
                : 'text-[#ffffff]'
            }`}
          >
            {t('contact')}
          </button> */}
        </div> 
        {/* Taps  */}

        {/* Content */}
        <div className="mt-6">


          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-2">

              {/*  */}
              <div>
                <div className="mt-1">{getStatusBadge(residence.status)}</div>
              </div>
              {/*  */}

              {/*  */}
              <div className="flex sm:items-center gap-2 sm:gap-0 sm:justify-between py-4 pt-0 sm:pt-4 flex-col sm:flex-row">
                <div className="flex flex-col ">
                  <h3 className="text-base  sm:text-xl font-bold text-[#2E4166] ">
                    {residence.name}
                  </h3>
                  <div className="flex items-center text-[#5D6772] text-[14px] font-[500] mb-3">
                    <MapPin className="w-4 h-4 ml-1" />
                    <span className="text-xs sm:text-sm">{residence.address}, {residence.city}</span>
                  </div>
                </div>
                <div className="flex flex-col ">
                  { residence.price_period === 'monthly' 
                    ? (
                      <>
                        <p className="text-[#2E4166] font-bold text-xl sm:text-3xl">{formatPrice(residence.price_per_bed)}</p>
                        <span className='text-[#2E4166] font-semibold text-xs sm:text-sm'> {t('person_per_month')} </span>
                      </>
                    )
                    : (
                      <>
                        <p className="text-[#2E4166] font-bold text-xl sm:text-3xl">{formatPrice(residence.price_per_bed )}</p>
                        <span className='text-[#2E4166] font-semibold text-xs sm:text-sm'> {t('per_person_per_year')} </span>
                      </>
                    )
                  }
                </div>
              </div>
              {/*  */}

              {/*  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className='border-none shadow-md'>
                  <CardHeader className='p-2 sm:p-6'>
                    <h2 className='text-[#2E4166] font-bold text-base sm:text-xl'>{t('property_description')}</h2>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xs sm:text-base'>{residence.description}</p>
                  </CardContent>
                </Card>

                <Card className='border-none shadow-md'>
                  <CardHeader className='p-2 sm:p-6'>
                    <h2  className='text-[#2E4166] font-bold text-base sm:text-xl'>{t('basic_details')}</h2>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-3 sm:mb-4'>
                      <p className='text-sm sm:text-base'>{t('type')} :</p>
                      <span className='text-xs sm:text-base'>{residence.residence_type}</span>
                    </div>
                    <div className='flex items-center justify-between mb-3 sm:mb-4'>
                      <p className='text-sm sm:text-base'> {t('rooms_count')} :</p>
                      <span className='text-xs sm:text-base'>{residence.rooms_count}</span>
                    </div>
                    <div className='flex items-center justify-between mb-3 sm:mb-4'>
                      <p className='text-sm sm:text-base'> {t('beds_count')} :</p>
                      <span className='text-xs sm:text-base'>{residence.bed_count}</span>
                    </div>
                    <div className='flex items-center justify-between mb-3 sm:mb-4'>
                      <p className='text-sm sm:text-base'> {t('bathroom_count')} :</p>
                      <span className='text-xs sm:text-base'>{residence.bathroom_count}</span>
                    </div>
                    <div className='flex items-center justify-between mb-3 sm:mb-4'>
                      <p className='text-sm sm:text-base'> {t('kitchen_count')} :</p>
                      <span className='text-xs sm:text-base'>{residence.kitchen_count}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/*  */}

              {/*  */}
              {/* Services */}
              {residence.services?.length > 0 && (
                <div className="py-8 sm:shadow-lg rounded-lg p-2 sm:p-4">
                    <h2  className='text-primary font-bold text-base sm:text-2xl mb-4'>{t('facilities_services')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {residence.services.map((service, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-2 "
                        >
                          <p className="font-medium">
                            {service.name}
                          </p>

                          {service.extra_cost > 0 && (
                            <p className="text-sm text-primary font-medium">
                               {t('additional_cost')}: +{service.extra_cost} {t('currency')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
                )}
              {/*  */}

              {/*  */}
              <div className="py-8 shadow-lg rounded-lg p-2 sm:p-6">
                <h2  className='text-[#2E4166] font-bold text-base sm:text-xl mb-4'>{t('detailed_specifications')}</h2>
                <div className=''>
                    <div className='flex items-center justify-between mb-4 gap-4'>
                      <p className='text-sm sm:text-base'> {t('building_year')} :</p>
                      <span className='text-xs sm:text-base'>{residence.building_year}</span>
                    </div>
                    <div className='flex items-center justify-between mb-4 gap-4'>
                      <p className='text-sm sm:text-base'> {t('building_type')} :</p>
                      <span className='text-xs sm:text-base'>{residence.residence_type}</span>
                    </div>
                    {residence.is_renewed && (
                      <div className='flex items-center justify-between gap-4 mb-4'>
                        <p className='text-sm sm:text-base'> {t('renewed')} :</p>
                        <span className='text-xs sm:text-base'>{ residence.is_renewed === true ? t('yes') : t('no') }</span>
                      </div>
                    )}
                    <div className='flex items-center justify-between mb-4 gap-4'>
                      <p className='text-sm sm:text-base'> {t('advertisement_license_number')} :</p>
                      <span className='text-xs sm:text-base'>{residence.residence_license }</span>
                    </div>
                    <div className='flex items-center justify-between mb-4 gap-4' >
                      <p className='text-sm sm:text-base'> {t('nearby_landmarks')} :</p>
                      <span className='text-xs sm:text-base'>{residence.nearby_landmarks }</span>
                    </div>
                    <div className='flex items-center justify-between mb-4 gap-4'>
                      <p className='text-sm sm:text-base'> {t('price_period')} :</p>
                      <span className='text-xs sm:text-base'>{residence.price_period === "monthly" ? t('monthly') : t('yearly') }</span>
                    </div>
                </div>
              </div>
              {/*  */}

            </div>
          )}
          {/* Overview Tab */}


          {/* Bookings Tab*/}
          {activeTab === 'bookings' && (
            <div className="space-y-2">
              <div className="flex sm:items-center justify-between flex-col sm:flex-row py-4">
                {/* Title */}
                <div>
                  <h3 className="text-base sm:text-2xl font-semibold sm:font-bold mb-2">{t('current_bookings')}</h3>
                  <p className='text-[#5D6772] text-xs sm:text-sm font-normal'>{t('active_bookings_list')}</p>
                </div>
                {/* Title */}

                {/* Search */}
                <div className="flex sm:justify-between gap-2 items-center mb-4 mt-4 sm:mt-0">
                  <label htmlFor="searchProperty" className='text-sm'>{t('search')} : </label>
                  <input
                    id='searchProperty'
                    type="text"
                    placeholder={t('search_bookings')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[80%] sm:w-[300px]"
                  />
                </div>
                {/* Search */}

              </div>

              {/* Boogings Table */}
              <div className='overflow-x-auto'>
                <table className="w-full overflow-x-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px]`}> {t('booking_number')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px]`}>{t('start_date')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px]`}> {t('end_date')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px] `}> {t('monthly_amount')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px] `}>{t('status')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px]`}> {t('check_in_d')}</th>
                      {/* <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-xs sm:text-sm font-[600] text-[#2E4166] min-w-[120px]`}>{t('actions')}</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBookings && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">
                         {t('loading_bookings_now')}
                        </td>
                      </tr>
                    )}

                    {!loadingBookings && bookingsError && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-red-500">
                          {bookingsError}
                        </td>
                      </tr>
                    )}

                    {!loadingBookings && bookings.length === 0 && !bookingsError && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-gray-500">
                         {t('no_bookings_y')}
                        </td>
                      </tr>
                    )}

                    {!loadingBookings &&
                      paginatedBookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-4 px-2 text-[#516180] text-xs sm:text-sm font-[400]">{`${booking.id}#`}</td>
                          <td className="py-4 px-2 text-[#516180] text-xs sm:text-sm font-[400]">
                            {formatDate(booking.start_date)}
                          </td>
                          <td className="py-4 px-2 text-[#516180] text-xs sm:text-sm font-[400]">
                            {formatDate(booking.end_date)}
                          </td>
                          <td className="py-4 px-2 text-[#516180] text-xs sm:text-sm font-[400]">
                            {formatPrice(booking.total_price_with_commission)}
                          </td>
                          <td className="py-4 px-2">
                            <Badge variant="secondary">
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-[#516180] text-xs sm:text-sm font-[400]">
                            {formatDate(booking.created_at)}
                          </td>
                          {/* <td className=''>
                            <button 
                              className="flex items-center justify-center gap-2 border border-[#2E41661A] text-[#2E4166] text-xs sm:text-sm font-[500] rounded-sm px-3 py-2 "
                              onClick={() =>{
                                setShowContactAmbassador(true)
                              }}
                            >
                              <span >{t('contact')}</span>
                              <Mail className="w-4 h-4 "/>
                            </button>
                          </td> */}
                        </tr>
                    ))}
                  </tbody>

                </table>
              </div>
              {/* Boogings Table */}
                
              {/* Booking Pagination */}
              {!loadingBookings && (
                  totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-50"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-full ${
                          currentPage === page
                            ? 'bg-[#2E4166] text-white'
                            : 'bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-50"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                </div>
              )
              ) }
              {/* Booking Pagination */}

            </div>
          )}
          {/* Bookings Tab*/}



          {/* Reviews Tap */}
          {activeTab === 'reviews' && (
            <h1>REVIEWS</h1>
          )}
          {/* Reviews Tap */}


          {/* Contact Tap */}
          {activeTab === 'contact' && (
            <div className="space-y-2">
             
             {/* Title */}
              <div>
                <h3 className="font-bold text-base sm:text-xl mb-2">{t('contact_information')}</h3>
                <p className='text-[#5D6772] text-[14px] font-normal'>{t('contact_ambassador')}</p>
              </div>
              {/* Title */}

              <div className="pt-10">
                  <h3 className="font-bold text-base sm:text-xl mb-2"> {t('detailed_specifications')}</h3>

                  <div className="flex items-center gap-2 py-3">
                    <User className='w-6 h-6' />
                    <div className="flex flex-col">
                      <h6 className='font-semibold text-sm sm:text-base '>أحمد محمد العلي</h6>
                      <span className='text-[14px] font-[400] text-[#516180]'>{t('housing_ambassador')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-3">
                    <Phone className='w-6 h-6' />
                    <div className="flex flex-col ">
                      <h6 className='font-semibold text-sm sm:text-base '> +966501234567</h6>
                      <span className='text-[14px] font-[400] text-[#516180]'>{t('phone')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-3">
                    <Mail className='w-6 h-6' />
                    <div className="flex flex-col ">
                      <h6 className='font-semibold text-sm sm:text-base '>ahmed@grh.sa</h6>
                      <span className='text-[14px] font-[400] text-[#516180]'>{t('email')}</span>
                    </div>
                  </div>
                  
              </div>

              {/* Buttons */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'>
                <button className="flex items-center justify-center gap-2 border border-[#2E41661A] text-[#2E4166] text-[14px] font-[500] rounded-sm px-3 py-2 ">
                  <span >{t('send_message')}</span>
                  <Mail className="w-4 h-4 "/>
                </button>
                <button className="flex items-center justify-center gap-2 border border-[#2E41661A] text-[#ffffff] bg-[#2E4166] text-[14px] font-[500] rounded-sm py-3 ">
                  <span >{t('contact')}</span>
                  <Phone className="w-4 h-4 "/>
                </button>
              </div>
              {/* Buttons */}

            </div>
          )}
          {/* Content  Tap*/}
        </div>

      </div>


      {/* Contact Ambassador */}
      <ContactAmbassador
        showContactAmbassador={showContactAmbassador}
        setShowContactAmbassador={setShowContactAmbassador}
      />
      {/* Contact Ambassador */}

    </div>
  );
};

export default ResidenceDetailsDialog;
