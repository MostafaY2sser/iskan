import React, { useEffect, useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Bed, Bath, Home, Filter,Grid,List,ChevronsRight,ChevronsLeft,} from 'lucide-react';
import { useApprovedResidences } from '@/hooks/useApprovedResidences';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropertiesSkeleton from '@/components/Skeleton';
import * as Slider  from '@radix-ui/react-slider';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';


const CustomerPropertiesPage: React.FC = () => {
  const { t , i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [area, setArea] = useState<string>('');
  // const [selectedCity, setSelectedCity] = useState('');
  const { residences, loading, error, page, setPage, hasNextPage, } = useApprovedResidences(
    itemsPerPage, 
    minPrice, 
    maxPrice, 
    startDate, 
    endDate, 
    area 
    // selectedCity
  );

 
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Home className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">خطأ في تحميل العقارات</h2>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      <div className="">

        {/* Header */}
        <div className="bg-[#ffffff] p-4 rounded-md shadow-md mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('properties_page_title')}</h1>
          <p className="text-[#828690] text-sm font-normal"> {t('properties_page_subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 py-6 sm:py-6 sm:p-6  mb-8 relative">

          {/* Filter Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-primary text-xl font-bold mb-3 sm:mb-6 ">
              <Filter className="w-4 h-4 "/>
              <h1>{t('filters')}</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-4  ">
              <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
            </div>
          </div>

          {/* Search By Area */} 
          <div className="flex flex-col mb-4">
            <label className="text-sm sm:text-base font-medium sm:font-bold pb-2">{t('city')}</label>
            <input
              type="text"
              placeholder={t('Search_residences_area')}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border rounded-md p-2"
            />
          </div>
          {/* ______________________________________________________________ */}
            {/* Select City */}
            {/* <div className="flex flex-col mb-4">
              <label className="text-sm sm:text-base font-medium sm:font-bold pb-2">
                {t('city')}
              </label>

              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setPage(1);
                }}
                className="border rounded-md p-2"
              >
                <option value="">{t('select_city')}</option>
                {Object.keys(isRTL ? districtsByCityAr : districtsByCityEn ).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div> */}
          {/* ______________________________________________________________ */}


          {/*Filter Price & Date  */}
          <div className="flex justify-between flex-col sm:flex-row gap-6 sm:gap-36 items-end  mt-8">
            {/*  Filter Date */}
            <div className="flex w-[100%] sm:w-[50%] gap-4 justify-center flex-col sm:flex-row   ">
              {/* Start Date */}
              <div className="flex flex-col sm:w-1/2">
                <label className="text-sm sm:text-base font-medium sm:font-bold  text-gray-700 mb-1">{t('start_date')}</label>
                <input
                  type="date"
                  className="border rounded-md p-2 w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col sm:w-1/2">
                <label className="text-sm sm:text-base font-medium sm:font-bold text-gray-700 mb-1">{t('end_date')}</label>
                <input
                  type="date"
                  className="border rounded-md p-2 w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Price  */}
            <div className="w-full sm:flex-1 space-y-3 flex gap-4" dir='rtl'>
              <Button
                className="mt-2 w-22"
                onClick={() => {
                  setPage(1); 
                  setMinPrice(priceRange[0]);
                  setMaxPrice(priceRange[1]);
                }}
              >
                {t('search')}
              </Button>
              <div className="flex-1">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{priceRange[1]} {t('currency')}</span>
                  <label className="text-primary text-sm sm:text-base font-medium sm:font-bold ">
                    {t('price')}
                  </label>
                  <span>{priceRange[0]} {t('currency')}</span>
                </div>

                <Slider.Root
                  className="relative flex w-full touch-none select-none items-center"
                  min={0}
                  max={100000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                >
                  <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <Slider.Range className="absolute h-full bg-primary" />
                  </Slider.Track>

                  <Slider.Thumb className="block h-5 w-5 rounded-full bg-primary focus:outline-none" />
                  <Slider.Thumb className="block h-5 w-5 rounded-full bg-primary focus:outline-none" />
                </Slider.Root>
              </div>
            </div>
          </div>

        </div>


        {/* Properties Grid/List */}
        {loading && residences.length === 0 ? (
          <PropertiesSkeleton />
          ) : residences.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('no_properties_title')} <br />
                {t('no_properties_subtitle')}
              </h3>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              {loading ? (
                <div className="mb-6">
                  <PropertiesSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {residences.filter((residence) => residence.status === 'approved').map((residence) => (
                    <Card key={residence.id} className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col overflow-hidden shadow-md">
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Property Image */}
                      <div className="relative h-[230px] bg-gray-200 overflow-hidden">
                        { residence.cover_photo_url === null 
                          ?<div className="w-full h-full flex items-center justify-center" style={{ display: residence.cover_photo_url ? 'none' : 'flex' }}>
                            <Home className="w-12 h-12 text-gray-400" />
                          </div>
                          : <div className="w-full h-full">
                            <img
                              src={residence.cover_photo_url}
                              alt={residence.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-all duration-300"
                            />
                          </div>
                        }
                      </div>

                      {/* Property Details */}
                      <div className=" px-2 sm:px-6 pt-3 pb-4 flex flex-col flex-grow">

                        {/* Residence Type */} 
                        <div className="mb-2">
                          <span className='bg-primary rounded-sm py-1 px-2 text-[#DDD4BA] text-sm'>
                            {residence.residence_type}
                          </span>
                        </div>

                        {/* Property Name */}
                        <div className="flex flex-col mb-1">
                          <h3 className="text-[18px] font-[700] text-primary line-clamp-1">
                            {residence.name}
                          </h3>
                          {/* Property Location */}
                          <div className="flex items-center text-[14px] font-[500]] text-[#5D6772] mb-3">
                            <MapPin className="w-4 h-4 ml-1" />
                            <span className="text-sm"> {residence.city} , {residence.location}</span>
                          </div>
                        </div>

                        {/* Property Features */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-600 bg-[#F7F8FA] p-4 rounded-md">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 ml-1" />
                            <span>{residence.bed_count} {t('bed')}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 ml-1" />
                            <span>{residence.bathroom_count} {t('baths')}</span>
                          </div>
                          <div className="flex items-center">
                            <Home className="w-4 h-4 ml-1" />
                            <span>{residence.rooms_count} {t('rooms')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 ">
                          <h4 className='text-primary text-md font-semibold'>{residence.price_period === 'monthly' ? t('monthly_price') : t('per_year_sar') } :</h4>
                          
                          <div className="">
                            <p className="text-[22px] font-bold text-primary">
                              {parseFloat(residence.price_with_commission.toFixed(1))}
                            </p>
                            <p className="text-sm text-[#516180]">
                              {residence.price_period === 'monthly'
                                ? t('person_per_month')
                                : t('per_person_per_year')}
                            </p>
                          </div>

                        </div> 

                        {/* Services */}
                        {residence.services && residence.services.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2"> {t('available_services')}:</p>
                            <div className="flex flex-wrap gap-1">
                              {residence.services.slice(0, 3).map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service.name}
                                </Badge>
                              ))}
                              {residence.services.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{residence.services.length - 3} {t('others')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Button - Always at bottom */}
                        <div className="mt-auto">
                          <Button 
                            className="w-full"
                            onClick={() => navigate(`/residence/${residence.id}`)}
                          >
                            {t('view_details')}
                          </Button>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="mb-6">
                  <PropertiesSkeleton />
                </div>
              ) : (
                <div className="space-y-4">
                  {residences.filter((residence) => residence.status === 'approved').map((residence) => (
                    <Card key={residence.id} className="shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row h-100 sm:h-[21rem] overflow-hidden">

                          {/* Image Slider */}
                          <div className="relative sm:w-[40%] h-52 sm:h-full bg-gray-200 overflow-hidden">
                            { residence.cover_photo_url === null 
                              ?<div className="w-full h-full flex items-center justify-center" style={{ display: residence.cover_photo_url ? 'none' : 'flex' }}>
                                <Home className="w-12 h-12 text-gray-400" />
                              </div>
                              : <div className="w-full h-full">
                                <img
                                  src={residence.cover_photo_url}
                                  alt={residence.anme}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-all duration-300"
                                />
                              </div>
                            }
                          </div>

                          {/* Property Details */}
                          <div className="flex-1 p-6 flex flex-col relative">

                            {/* Residence Type */}
                            <div className="mb-2">
                              <span className="bg-primary rounded-sm py-1 px-2 text-[#DDD4BA] text-sm">
                                {residence.residence_type}
                              </span>
                            </div>

                            {/* Property Name & Location */}
                            <div className="mb-3">
                              <h3 className="text-[18px] font-[700] text-primary line-clamp-1">
                                {residence.name}
                              </h3>
                              <div className="flex items-center text-[14px] text-[#5D6772]">
                                <MapPin className="w-4 h-4 ml-1" />
                                <span>{residence.address}, {residence.city}</span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex sm:w-1/2 items-center justify-between mb-4 text-sm text-gray-600 bg-[#F7F8FA] p-4 rounded-md">
                              <div className="flex items-center">
                                <Bed className="w-4 h-4 ml-1" />
                                <span>{residence.bed_count} {t('bed')}</span>
                              </div>
                              <div className="flex items-center">
                                <Bath className="w-4 h-4 ml-1" />
                                <span>{residence.bathroom_count} {t('baths')}</span>
                              </div>
                              <div className="flex items-center">
                                <Home className="w-4 h-4 ml-1" />
                                <span>{residence.rooms_count} {t('rooms')}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-primary text-md font-semibold">
                                {t('monthly_price')} :
                              </h4>
                              <div>
                                <p className="text-[22px] font-bold text-primary">
                                  {formatPrice(residence.price_with_commission)}
                                </p>
                                <p className="text-sm text-[#516180]">
                                  {t('person_per_month')}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between gap-4 sm:gap-0 flex-col sm:flex-row">
                              {/* Services */}
                              {residence.services && residence.services.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    {t('available_services')}:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {residence.services.slice(0, 3).map((service, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {service.name}
                                      </Badge>
                                    ))}
                                    {residence.services.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{residence.services.length - 3} {t('others')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Action Button */}
                              <div className={``}>
                                <Button
                                  className="w-full sm:w-auto"
                                  onClick={() => navigate(`/residence/${residence.id}`)}
                                >
                                  {t('view_details')}
                                </Button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </CardContent>
                  </Card>
                  ))}
                </div>
              )}
            </>
        )}
        
        {/* Pagination Controls */}
        {minPrice === undefined && maxPrice === undefined && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1 || loading}
                >
                  <ChevronsRight className={` ${ isRTL ? 'rotate-0' : 'rotate-180' } `}/>
                </Button>

                <span className="text-sm font-medium">
                  {t('page')} {page} 
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasNextPage || loading}
                >
                  <ChevronsLeft className={` ${ isRTL ? 'rotate-0' : 'rotate-180' } `}/>
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerPropertiesPage;