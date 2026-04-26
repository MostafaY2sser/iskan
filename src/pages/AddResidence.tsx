import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wizard } from '@/components/ui/wizard';
import { ArrowLeft, ArrowRight, Home, MapPin, Building, Calendar, Bed, Bath, ChefHat, Camera, Upload, X, CheckCircle, Settings, RefreshCcw } from 'lucide-react';
// import DashboardLayout from '@/components/shared/DashboardLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { residencesApi } from '@/api/endpoints/residences';
import { CreateResidence } from '@/api/types';
import { toast } from 'sonner';
// import { districtsByCity } from '@/data/districtsByCity';
import { useTranslation } from 'react-i18next';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';
import { adminApi } from '@/api';

// Removed LocationPicker import - using simple manual inputs instead

const AddResidence: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [createdResidenceId, setCreatedResidenceId] = useState<number | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { t , i18n } = useTranslation()
  const isRTL = i18n.language === 'ar';
  // Localization Cities :---
  const districtsByCity = i18n.language === 'ar' ? districtsByCityAr : districtsByCityEn;
  const cities = Object.keys(districtsByCity);
  // Localization Cities :---
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<Array<{ service_id: number; extra_cost: number }>>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [showCreateService, setShowCreateService] = useState(false);
  const [residenceId, setResidenceId] = useState<number | null>(null);
  const userData  = localStorage.getItem('housing_user');
  const userType = JSON.parse(userData || 'null');
  const [commissionRate, setCommissionRate] = useState<number | null>(null);
  const [loadingCommission, setLoadingCommission] = useState(false);
  const [commissionError, setCommissionError] = useState(false);

  // Commission Rate
  useEffect(() => {
    const fetchCommissionRate = async () => {
      setLoadingCommission(true);
      setCommissionError(false);

      try {
        const commissionRes = await adminApi.CommissionRate();

        setCommissionRate(
          commissionRes.commission_rate ??
          commissionRes.data?.commission_rate ??
          null
        );

      } catch (err) {
        toast.error(t('commission_load_error'));
        setCommissionError(true);
      } finally {
        setLoadingCommission(false);
      }
    };

    fetchCommissionRate();
  }, []);
  // Commission Rate

  // Load services on component mount :---
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const services = await residencesApi.getAllServices();
      setAvailableServices(services.results || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };
  // Load services on component mount :---



  // Payload form data :---
  const [formData, setFormData] = useState<CreateResidence>({
    name: '',
    location: '',
    bed_count: 0,
    price_per_bed: 0,
    description: '',
    residence_type: '',
    rooms_count: 0,
    kitchen_count: 0,
    bathroom_count: 0,
    building_year: undefined, 
    is_renewed: false,
    address: '',
    city: '',
    residence_license: '',
    nearby_landmarks: '',
    price_period: 'monthly'
  });
  // Payload form data :---


  // Steps Titles :---
  const wizardSteps = [
    t('basic_info'),
    t('property_details'),
    t('location_address'),
    t('add_photos'),
    t('select_services'),
    t('create_residence')
  ];
  // Steps Titles :---
  

  // Residence Types :---
  const residenceTypes = [
    { value: 'apartment', label: t('apartment') },
    { value: 'building', label: t('building') },
    { value: 'villa', label: t('villa') },
    { value: 'house', label: t('house') },
    { value: 'studio', label: t('studio') },
    { value: 'penthouse', label: t('penthouse') },
    { value: 'duplex', label: t('duplex') },
    { value: 'townhouse', label: t('townhouse') }
  ];
  // Residence Types :---



  // Handle Next Step :---
  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    //  Step 2
    if (currentStep === 2 && !residenceId) { 
      setLoading(true);
      try {
        const response = await residencesApi.createResidence(formData);

        // Id from response
        let id;
        if (response && typeof response === 'object') {
          id = response.id || response.residence_id || response.data?.id || response.data?.residence_id;
        }
        if (!id) throw new Error(t('residence_id_not_received'));

        setResidenceId(id);
        toast.success(t('residence_created_success'));
      } catch (error) {
        console.error(error);
        toast.error(t('residence_creation_error'));
        setLoading(false);
        return; //  Stop Next Step
      } finally {
        setLoading(false);
      }
    }

    // Next Step
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  // Handle Next Step :---




  // Handle Input Change :---
  const handleInputChange = (field: keyof CreateResidence, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // Handle Input Change :---



  // Photo handling functions :---
  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('image_size_limit'));
        return;
      }
      setCoverPhoto(file);
    }
  };
  // Photo handling functions :---




  // Handle Gallery Photos Change :---
  const handleGalleryPhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`صورة ${file.name} كبيرة جداً (أكثر من 5 ميجابايت)`);
        return false;
      }
      return true;
    });

    const totalPhotos = galleryPhotos.length + validFiles.length;
    if (totalPhotos > 10) {
      toast.error(t('max_gallery_photos'));
      return;
    }

    setGalleryPhotos(prev => [...prev, ...validFiles]);
  };
  // Handle Gallery Photos Change :---


  // Remove Photos :---
  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
  };
  // Remove Photos :---


  // Remove Cover Photo :---
  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };
  // Remove Cover Photo :---

 

  // Handle Previous Step :---
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  // Handle Previous Step :---



  // Validate Current Step :---
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) {
          toast.error(t('enter_residence_name'));
          return false;
        }
        if (!formData.residence_type) {
          toast.error(t('select_residence_type'));
          return false;
        }
        if (formData.bed_count <= 0) {
          toast.error(t('enter_bed_count'));
          return false;
        }
        if (formData.price_per_bed <= 0) {
          toast.error(t('enter_price_per_bed'));
          return false;
        }
        if (!formData.description.trim()) {
          toast.error(t('enter_residence_description'));
          return false;
        }
        break;
      case 1:
        if (formData.rooms_count <= 0) {
          toast.error(t('enter_rooms_count'));
          return false;
        }
        if (formData.bathroom_count <= 0) {
          toast.error(t('enter_bathroom_count'));
          return false;
        }
        if (formData.kitchen_count <= 0) {
          toast.error(t('enter_kitchen_count'));
          return false;
        }
        if (formData.building_year && (formData.building_year < 1900 || formData.building_year > new Date().getFullYear() + 5)) {
          toast.error(t('enter_valid_building_year'));
          return false;
        }
        break;
      case 2:
        if (!formData.city.trim()) {
          toast.error(t('select_city'));
          return false;
        }
        if (!formData.location.trim()) {
          toast.error(t('enter_location'));
          return false;
        }
        if (!formData.address.trim()) {
          toast.error(t('enter_address'));
          return false;
        }
        if (!formData.residence_license.trim()) {
          toast.error(t(t('enter_residence_license')));
          return false;
        }

        break;
      case 3:
        if (!coverPhoto) {
          toast.error(t('add_cover_photo'));
          return false;
        }

        if (galleryPhotos.length === 0) {
          toast.error(t('add_at_least_one_gallery_photo'));
          return false;
        }
        break;
      case 4:
        // Services step - no validation required, services are optional
        break;
      case 5:
        // Create residence step - no validation required, this is the final step
        break;
    }
    return true;
  };
  // Validate Current Step :---




  // Handle Submit Residence :---
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    try {
      // Extract only the required API fields
      const residenceData: CreateResidence = {
        name: formData.name,
        location: formData.location,
        bed_count: formData.bed_count,
        price_per_bed: formData.price_per_bed,
        description: formData.description,
        residence_type: formData.residence_type,
        rooms_count: formData.rooms_count,
        kitchen_count: formData.kitchen_count,
        bathroom_count: formData.bathroom_count,
        building_year: formData.building_year,
        is_renewed: false,
        address: formData.address,
        city: formData.city,
        residence_license: formData.residence_license,
        nearby_landmarks: formData.nearby_landmarks,
        price_period:formData.price_period ,
      };

      console.log('Sending residence data:', residenceData);

      
      // Upload cover photo
      if (coverPhoto) {
        try {
          console.log('Uploading cover photo for residence:', residenceId);
          await residencesApi.uploadCoverPhoto(residenceId, coverPhoto);
          toast.success(t('cover_photo_uploaded_success'));
        } catch (photoError) {
          console.error('Error uploading cover photo:', photoError);
          toast.warning(t('residence_created_cover_photo_error'));
        }
      }
      
      // Upload gallery photos
      if (galleryPhotos.length > 0) {
        setUploadingPhotos(true);
        console.log('Uploading gallery photos for residence:', residenceId);
        let successCount = 0;
        let errorCount = 0;
        
        for (const photo of galleryPhotos) {
          try {
            await residencesApi.uploadGalleryPhoto(residenceId, photo);
            successCount++;
          } catch (photoError) {
            console.error('Error uploading gallery photo:', photoError);
            errorCount++;
          }
        }
        
        
        setUploadingPhotos(false);
        
        if (successCount > 0) {
          toast.success(`تم رفع ${successCount} صورة من المعرض بنجاح`);
        }
        if (errorCount > 0) {
          toast.warning(`حدث خطأ في رفع ${errorCount} صورة من المعرض`);
        }
      }
      
       

      // Add services to residence
      if (selectedServices.length > 0 && residenceId && !isNaN(residenceId)) {
        try {
          console.log('Adding services to residence:', residenceId, selectedServices);
          await residencesApi.addServicesToResidence(residenceId, selectedServices);
          toast.success(`تم إضافة ${selectedServices.length} خدمة للسكن بنجاح`);
        } catch (serviceError) {
          console.error('Error adding services to residence:', serviceError);
          toast.warning(t('service_add_error'));
        }
      }
      
      toast.success(`${t('residence_completed_success')} ${formData.city}, ${formData.address}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating residence:', error);
      
      // If residence was created but photo upload failed, still show success for residence creation
      if (createdResidenceId) {
        toast.success(t('residence_created_photos_error'));
        navigate('/dashboard');
      } else {
        toast.error(t('residence_add_error'));
      }
    } finally {
      setLoading(false);
      setUploadingPhotos(false);
    }
  };
  // Handle Submit Residence :---




  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('basic_info')}</h3>
              <p className="text-sm text-muted-foreground"> {t('enter_basic_info')} </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground"> {t('residence_name')} *</Label>
                <Input
                  id="name"
                  placeholder={t('example_residence_name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residence_type" className="text-foreground">{t('residence_type')}  *</Label>
                <Select 
                  value={formData.residence_type} 
                  onValueChange={(value) => handleInputChange('residence_type', value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder={t('select_residence_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {residenceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bed_count" className="text-foreground"> {t('bed_count')} *</Label>
                <Input
                  id="bed_count"
                  type="number"
                  min="1"
                  placeholder={t('example_bed_count')}
                  value={formData.bed_count || ''}
                  onChange={(e) => handleInputChange('bed_count', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_bed" className="text-foreground"> {t('price_per_bed')} *</Label>
                <Input
                  id="price_per_bed"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t('example_price_per_bed')}
                  value={formData.price_per_bed || ''}
                  onChange={(e) => handleInputChange('price_per_bed', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            
            {/* Commission Rate */}
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-8">
              <div className="flex items-center gap-2">
                <p>  {t('platform_commission')} </p>
                :
                <span> 
                  {loadingCommission 
                    ?<span className="animate-pulse">{t('loading_commission')}</span>
                    : commissionRate !== null ? `${(commissionRate * 100).toFixed(0)}%` : t('not_available')
                  }
                </span>
              </div>

              {/* total Price with comissoin */}
              <div className="flex items-center  gap-2">
                <p>  {t('total_price_with_commission')}  </p>
                :
                <span>
                  {formData.price_per_bed && commissionRate !== null
                    ? `${(function() {
                        const total = formData.price_per_bed * (1 + commissionRate);
                        return total % 1 === 0 ? total.toFixed(0) : total.toFixed(1);
                      })()} ${t('currency')}`
                    : t('not_available')}
                </span>
              </div>
            </div>
            {/*Commission Rate */}


            <div className="space-y-2">
              <Label className="text-foreground">
                {t('price_period')}
              </Label>

              <div className="flex items-center gap-6">
                {/* monthly */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price_period"
                    value="monthly"
                    checked={formData.price_period === 'monthly'}
                    onChange={() => handleInputChange('price_period', 'monthly')}
                  />
                  <span className='text-sm sm:text-base'>{t('monthly')}</span>
                </label>

                {/* yearly */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price_period"
                    value="yearly"
                    checked={formData.price_period === 'yearly'}
                    onChange={() => handleInputChange('price_period', 'yearly')}
                  />
                  <span className='text-sm sm:text-base'>{t('yearly')}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              { userType.user_type === 'owner' 
                ? (
                  <Label htmlFor="description" className="text-foreground"> {t('residence_description')} *</Label>
                )
                :(
                  <Label htmlFor="description" className="text-foreground">  {t('residence_description')} <span className='text-green-600 px-1 text-base'> {t('agent_commission')} </span> *</Label>
                )
              }
              <Textarea
                id="description"
                placeholder={t('example_residence_description')}
                className="min-h-[120px] "
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground"> {t('residence_details')}</h3>
              <p className="text-sm text-muted-foreground">{t('enter_residence_details')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rooms_count" className="text-foreground flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  {t('rooms_count')} *
                </Label>
                <Input
                  id="rooms_count"
                  type="number"
                  min="1"
                  placeholder={t('example_10')}
                  value={formData.rooms_count || ''}
                  onChange={(e) => handleInputChange('rooms_count', parseInt(e.target.value) || 0)}

                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathroom_count" className="text-foreground flex items-center gap-2">
                  <Bath className="w-4 h-4" />
                  {t('bathroom_count')} *
                </Label>
                <Input
                  id="bathroom_count"
                  type="number"
                  min="1"
                  placeholder={t('example_5')}
                  value={formData.bathroom_count || ''}
                  onChange={(e) => handleInputChange('bathroom_count', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kitchen_count" className="text-foreground flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  {t('kitchen_count')}  *
                </Label>
                <Input
                  id="kitchen_count"
                  type="number"
                  min="1"
                  placeholder={t('example_2')}
                  value={formData.kitchen_count || ''}
                  onChange={(e) => handleInputChange('kitchen_count', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="building_year" className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('building_year')}
              </Label>
              <Input
                id="building_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder={` ${t('example')}: ${new Date().getFullYear()}`}
                value={formData.building_year || ''}
                onChange={(e) => handleInputChange('building_year', parseInt(e.target.value) || new Date().getFullYear())}
              />
            </div>

            {/* __________________________________________________________ */}
            <div className="space-y-3 mt-4">
              <Label className="text-foreground flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" />
                  {t('renewal_status')}  
              </Label>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_renewed"
                    checked={formData.is_renewed === true}
                    onChange={() => handleInputChange('is_renewed', true)}
                    className="accent-primary"
                  />
                  <span className='text-sm sm:text-base'>{t('renewed')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_renewed"
                    checked={formData.is_renewed === false}
                    onChange={() => handleInputChange('is_renewed', false)}
                    className="accent-primary"
                  />
                  <span className='text-sm sm:text-base'>{t('not_renewed')}</span>
                </label>
              </div>
            </div>
            {/* __________________________________________________________ */}


          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('location_and_address')}</h3>
              <p className="text-sm text-muted-foreground">{t('enter_location_details_manually')}</p>
            </div>

            {/* Simple Location Input Form */}
            <Card>
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-2xl" >{t('location_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 pt-0 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* ---  city --- */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">{t('city')} *</Label>

                    <Select
                      value={formData.city}
                      onValueChange={(value) => {
                        handleInputChange('city', value);

                        // if city change delete  location value :-------
                        handleInputChange('location', '');
                      }}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder={t('select_city')} />
                      </SelectTrigger>

                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ---  location --- */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground">{t('location_neighborhood')} *</Label>

                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange('location', value)}
                      // Select city frist :----
                      disabled={!formData.city}  
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder={formData.city ? t('select_neighborhood') : t('select_city_first') } />
                      </SelectTrigger>

                      <SelectContent>
                        {formData.city &&
                          districtsByCity[formData.city]?.map((dist) => (
                            <SelectItem key={dist} value={dist}>
                              {dist}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground"> {t('details_address')} *</Label>
                  <Textarea
                    id="address"
                    placeholder={t('neighborhood_placeholder')}
                    className="min-h-[100px]"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                {/* --- residence license --- */}
                <div className="space-y-2">
                  <Label htmlFor="residence_license" className="text-foreground">
                    {t('advertisement_license_number')} *
                  </Label>
                  <Input
                    id="residence_license"
                    placeholder={t('advertisement_license_number')}
                    value={formData.residence_license}
                    onChange={(e) => handleInputChange('residence_license', e.target.value)}
                  />
                </div>

                {/* --- nearby landmarks --- */}
                <div className="space-y-2">
                  <Label htmlFor="nearby_landmarks" className="text-foreground">
                    {t('nearby_landmarks')}
                  </Label>
                  <Textarea
                    id="nearby_landmarks"
                    placeholder={t('nearby_landmarks')}
                    className="min-h-[80px]"
                    value={formData.nearby_landmarks}
                    onChange={(e) => handleInputChange('nearby_landmarks', e.target.value)}
                  />
                </div>


              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-muted/10 border-primary/20">
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-center text-primary text-base sm:text-2xl"> {t('residence_summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
                <p className='text-sm sm:text-base'><strong>{t('name')}:</strong> {formData.name}</p>
                <p className='text-sm sm:text-base'><strong>{t('type')}:</strong> {residenceTypes.find(t => t.value === formData.residence_type)?.label}</p>
                <p className='text-sm sm:text-base'><strong> {t('bed_count')}:</strong> {formData.bed_count}</p>
                <p className='text-sm sm:text-base'><strong> {t('price_per_bed')}:</strong> {formData.price_per_bed} {t('currency')}</p>
                <p className='text-sm sm:text-base'><strong>{t('rooms_count')} :</strong> {formData.rooms_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('bathroom_count')} :</strong> {formData.bathroom_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('kitchen_count')} :</strong> {formData.kitchen_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('building_year')} :</strong> {formData.building_year}</p>
                <p className='text-sm sm:text-base'><strong>{t('city')}:</strong> {formData.city}</p>
                <p className='text-sm sm:text-base'><strong>{t('location_label')}:</strong> {formData.location}</p>
                <p className='text-sm sm:text-base'><strong>{t('address')}:</strong> {formData.address}</p>
                <p className='text-sm sm:text-base'> <strong>{t('advertisement_license')}:</strong> {formData.residence_license} </p>
                <p className='text-sm sm:text-base'><strong>{t('nearby_landmarks')}:</strong> {formData.nearby_landmarks || '-'}</p>
              </CardContent>
            </Card>
          </div>
        );



      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('add_images')}</h3>
              <p className="text-sm text-muted-foreground">{t('add_cover_and_gallery')}</p>
            </div>

            {/* Cover Photo Section */}
            <Card>
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-2xl">{t('cover_image')}</CardTitle>
                <p className="text-sm text-muted-foreground ">{t('cover_image_description')}</p>
              </CardHeader>
              <CardContent className='p-3 sm:p-6'>
                <div className="space-y-4">
                  {coverPhoto ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(coverPhoto)}
                        alt="Cover preview"
                        loading="lazy"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 left-2"
                        onClick={removeCoverPhoto}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm sm:text-base">{t('click_to_add_cover')}</p>
                      <p className="text-xs sm:text-sm text-gray-500">JPG, PNG (أقل من 5 ميجابايت)</p>
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPhotoChange}
                    className="hidden"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gallery Photos Section */}
            <Card>
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-2xl" >{t('gallery_images')}</CardTitle>
                <p className="text-sm text-muted-foreground ">
                 {t('gallery_images_description')}
                </p>
              </CardHeader>
              <CardContent className='p-3 sm:p-6'>
                <div className="space-y-4">
                  {galleryPhotos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Gallery ${index + 1}`}
                            loading="lazy"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removeGalleryPhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {galleryPhotos.length < 10 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm sm:text-base">{t('click_to_add_gallery')}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {galleryPhotos.length}/10 صور - JPG, PNG (أقل من 5 ميجابايت لكل صورة)
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryPhotosChange}
                    className="hidden"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('create_residence')}</h3>
              <p className="text-sm text-muted-foreground"> {t('review_and_create_residence')}</p>
            </div>

            {/* Summary Card */}
            <Card className="bg-muted/10 border-primary/20">
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-2xl text-center ">{t('residence_summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2  p-3 sm:p-6 pt-0">
                <p className='text-sm sm:text-base'><strong>{t('name')}:</strong> {formData.name}</p>
                <p className='text-sm sm:text-base'><strong>{t('type')}:</strong> {residenceTypes.find(t => t.value === formData.residence_type)?.label}</p>
                <p className='text-sm sm:text-base'><strong> {t('bed_count')}:</strong> {formData.bed_count}</p>
                <p className='text-sm sm:text-base'><strong> {t('price_per_bed')}:</strong> {formData.price_per_bed} {t('currency')}</p>
                <p className='text-sm sm:text-base'><strong>{t('rooms_count')} :</strong> {formData.rooms_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('bathroom_count')} :</strong> {formData.bathroom_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('kitchen_count')} :</strong> {formData.kitchen_count}</p>
                <p className='text-sm sm:text-base'><strong>{t('building_year')} :</strong> {formData.building_year}</p>
                <p className='text-sm sm:text-base'><strong>{t('city')}:</strong> {formData.city}</p>
                <p className='text-sm sm:text-base'><strong>{t('location_label')}:</strong> {formData.location}</p>
                <p className='text-sm sm:text-base'><strong>{t('address')}:</strong> {formData.address}</p>
                <p className='text-sm sm:text-base'><strong> {t('cover_image')}:</strong> {coverPhoto ? t('cover_image_added') : t('cover_image_not_added')}</p>
                <p className='text-sm sm:text-base'><strong>{t('gallery_images')} :</strong> {galleryPhotos.length} {t('image')}</p>
                <p className='text-sm sm:text-base'><strong> {t('selected_services')}:</strong> {selectedServices.length > 0 ? `${selectedServices.length} ${t('service')} ` : t('no_services_selected')}</p>
                {selectedServices.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-primary"> {t('service_details')} :</p>
                    {selectedServices.map((selected, index) => {
                      const service = availableServices.find(s => s.id === selected.service_id);
                      return (
                        <p key={index} className="text-sm text-gray-600 mr-4">
                          • {service?.name} {selected.extra_cost > 0 ? `(+${selected.extra_cost} ${t('currency')} )` :  t('free')}
                        </p>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    {uploadingPhotos ? t('uploading_images') : t('creating_residence') }
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('select_services')}</h3>
              <p className="text-sm text-muted-foreground">{t('choose_available_services')}</p>
            </div>

            {/* Available Services */}
            <Card>
              <CardHeader className='p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-2xl">{t('available_services')} </CardTitle>
                <p className="text-sm text-muted-foreground ">{t('choose_from_existing')}</p>
              </CardHeader>
              <CardContent className='p-3 sm:p-6 pt-0'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-2 sm:gap-0 p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="تكلفة إضافية"
                          className="w-[70%] sm:w-24"
                          value={selectedServices.find(s => s.service_id === service.id)?.extra_cost || 0}
                          onChange={(e) => {
                            const extraCost = parseInt(e.target.value) || 0;
                            if (extraCost < 0) extraCost = 0;
                            setSelectedServices(prev => {
                              const existing = prev.find(s => s.service_id === service.id);
                              if (existing) {
                                return prev.map(s => 
                                  s.service_id === service.id ? { ...s, extra_cost: extraCost } : s
                                );
                              } else {
                                return [...prev, { service_id: service.id, extra_cost: extraCost }];
                              }
                            });
                          }}
                        />
                        <Button
                          variant={selectedServices.find(s => s.service_id === service.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const isSelected = selectedServices.find(s => s.service_id === service.id);
                            if (isSelected) {
                              setSelectedServices(prev => prev.filter(s => s.service_id !== service.id));
                            } else {
                              setSelectedServices(prev => [...prev, { service_id: service.id, extra_cost: 1 }]);
                            }
                          }}
                        >
                          {selectedServices.find(s => s.service_id === service.id) ? t('selected') : t('select') }
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Service */}
            <Card>
              <CardHeader className='p-3 sm:p-6 '>
                <CardTitle className="text-base sm:text-2xl">{t('add_new_service')}</CardTitle>
                <p className="text-sm text-muted-foreground ">{t('add_new_service_description')}</p>
              </CardHeader>
              <CardContent className='p-3 sm:p-6 pt-0'>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder={t('service_name')}
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateService(!showCreateService);
                        
                        if (showCreateService) {
                          setNewServiceName('');
                          setNewServiceDescription('');
                        }
                      }}
                    >
                      {showCreateService ?  t('cancel') :  t('add_new_service') }
                    </Button>
                  </div>
                  
                  {showCreateService && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <Input
                        placeholder={t('service_description')}
                        value={newServiceDescription}
                        onChange={(e) => setNewServiceDescription(e.target.value)}
                      />
                      <Button
                        onClick={async () => {
                          if (!newServiceName.trim()) {
                            toast.error(t('please_enter_service_name'));
                            return;
                          }
                          try {
                            const newService = await residencesApi.createService({
                              name: newServiceName,
                              description: newServiceDescription
                            });
                            toast.success(t('service_created_successfully'));
                            setNewServiceName('');
                            setNewServiceDescription('');
                            setShowCreateService(false);
                            loadServices(); // Reload services
                          } catch (error) {
                            toast.error(t('service_creation_error'));
                          }
                        }}
                        className="w-full"
                      >
                       {t('create_service')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-right text-primary" dir="rtl">{t('selected_services')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedServices.map((selected) => {
                      const service = availableServices.find(s => s.id === selected.service_id);
                      return (
                        <div key={selected.service_id} className="flex justify-between items-center p-2 bg-white rounded">
                          <span>{service?.name}</span>
                          <span className="text-primary font-medium">
                            {selected.extra_cost > 0 ? `+${selected.extra_cost} ${t('currency')} ` : t('free') }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title={t('add_new_residence')} subtitle={t('add_residence_description')}>

      <div className="mb-6 bg-white rounded-md shadow-md p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('add_new_residence')}</h1>
        <p className=" text-[#516180] text-sm sm:text-base font-[400]">{t('add_residence_description')}</p>
      </div>
      
      <div className="border border-primary rounded-xl bg-card p-4 sm:p-8 shadow-lg">

        {/* Wizard Steps */}
        <div className="mb-8">
          <Wizard steps={wizardSteps} currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {wizardSteps[currentStep]}
            </h2>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border mt-8">
          
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  disabled={loading || uploadingPhotos}
                  className='p-2 sm:p-4 text-xs sm:text-base h-9 sm:h-10'
                >
                  <ArrowRight className={`w-2 h-2 sm:w-4 sm:h-4 ml-2 ${isRTL  ? 'transform rotate-0' : '-transform rotate-180' } `} />
                  {t('previous')}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                disabled={loading || uploadingPhotos}
                className='p-2 sm:p-4 text-xs sm:text-base h-9 sm:h-10'
              >
                {t('cancel')}
              </Button>
            </div>

            <div className={`flex gap-3 `}>
              {currentStep < wizardSteps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading || uploadingPhotos}
                >
                  {t('next')}
                  <ArrowLeft className={`w-4 h-4 mr-2 ${isRTL  ? 'transform rotate-0' : 'transform rotate-180' } `} />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || uploadingPhotos}
                  className='p-2 sm:p-4 text-xs sm:text-base h-9 sm:h-10 bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  {loading ? (uploadingPhotos ? t('uploading_images') :  t('creating_residence') ) : t('create_residence') }
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddResidence;
