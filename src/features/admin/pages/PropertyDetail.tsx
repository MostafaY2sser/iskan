
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home as HomeIcon, Eye, Edit, ChevronRight, ChevronLeft } from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { adminApi, residencesApi } from '@/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';



const PropertyDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;
  const [status, setStatus] = useState(property?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(''); 
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [propertyData, setPropertyData] = useState<ResidencePublicResponse | null>(property || null);
  const [loadingData, setLoadingData] = useState(false);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);


  // SLider of Images :-------
  const next = () =>
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  
  const prev = () =>
    setCurrentImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
  );
  // SLider of Images :-------



  // Get some Date for Property :-
  useEffect(() => {
  if (!property?.id) return;

  setLoadingData(true);
    residencesApi.getResidenceById(property.id)
      .then((res) => {
        setPropertyData(res);
      })
      .catch((err) => {
        console.error('Error fetching property details:', err);
      })
      .finally(() => setLoadingData(false));
  }, [property?.id]);
 

  
  useEffect(() => {
    if (!initialLoad && (status === 'changes_requested' || status === 'rejected')) {
      setNotesDialogOpen(true);
    } else if (initialLoad) {
      setInitialLoad(false); 
    }
  }, [status]);


  if (!property) {
    return (
      <DashboardLayout title="تفاصيل العقار">
        <p className="text-center py-10 text-red-600">
          لا توجد بيانات لعرض هذا العقار. يرجى العودة من صفحة العقارات.
        </p>
      </DashboardLayout>
    );
  }



  const updateStatus = async () => {
    if ((status === 'changes_requested' || status === 'rejected') && !notes.trim()) {
      toast.error('يرجى كتابة السبب قبل الإرسال');
      return;
    }

    try {
      setLoading(true);

      await adminApi.updateResidenceStatus(
        property.id,
        status,
        notes   
      );

      toast.success('تم تحديث حالة العقار بنجاح');
      navigate('/admin/properties');
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setLoading(false);
    }
  };


  const handleSaveClick = () => {
    if (status === 'changes_requested' || status === 'rejected') {
      setNotesDialogOpen(true);
      return;
    }

    updateStatus(); 
  };



   // get Property Gallery :-----------------
    useEffect(() => {
      if (!propertyData?.id) return;
  
      const fetchGallery = async () => {
        try {
          setPropertyData(true);
  
          const res = await residencesApi.getPropertyGallery(propertyData.id);
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
          setPropertyData(false);
        }
      };
  
      fetchGallery();
    }, [propertyData?.id]);
  // get Property Gallery :-----------------



  
  return (
    <div>
      <div className='mb-6 bg-[#ffffff] p-4 rounded-md shadow-md'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">تفاصيل العقار</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">عرض تفاصيل العقار المحدد</p>
      </div>  
      <div className="bg-muted min-h-screen">
        <div className="">
          <Card className="bg-card shadow-lg rounded-xl overflow-hidden border-none ">
            <CardContent className="py-6">
              {/* Property Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {property.name}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
                  <HomeIcon className="w-5 h-5" />
                  {property.location}
                </p>
              </div>

              {/* Property Image */}
            <div className="relative h-[450px] bg-gray-200 rounded-t-md overflow-hidden mt-6 mb-8">
              {loadingImages ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {t('loading')}...
                </div>
                ) : galleryImages.length > 0 ? (
                  <img
                    src={galleryImages[currentImage]}
                    alt={`residence ${currentImage + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    لا يوجد صور
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

              {/* Description */}
              {propertyData?.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">الوصف</h3>
                  <p className="text-muted-foreground">{propertyData.description}</p>
                </div>
              )}

              

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">النوع:</span>
                    <span className="text-foreground font-semibold">{property.residence_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">عدد الغرف:</span>
                    <span className="text-foreground font-semibold">{property.rooms_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">عدد الأسرة:</span>
                    <span className="text-foreground font-semibold">{property.bed_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">عدد الحمامات:</span>
                    <span className="text-foreground font-semibold">{property.bathroom_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">عدد المطابخ:</span>
                    <span className="text-foreground font-semibold">{property.kitchen_count}</span>
                  </div>
                    <div className='flex justify-between items-center py-3 border-b border-border'>
                      <p className='text-muted-foreground'> مجدد :</p>
                      <span  className='text-foreground font-semibold'>{ property.is_renewed === true ? "نعم" : "لا" }</span>
                    </div>
                    <div className='flex justify-between items-center py-3 border-b border-border'>
                      <p className='text-muted-foreground'>  أشهر المعالم القريبة :</p>
                      <span  className='text-foreground font-semibold'>{property.nearby_landmarks }</span>
                    </div>
                    <div className='flex justify-between items-center py-3 border-b border-border'>
                      <p className='text-muted-foreground'>  فترة السعر :</p>
                      <span className='text-foreground font-semibold'>{property.price_period }</span>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">سعر السرير:</span>
                    <span className="text-foreground font-semibold">
                      {property.price_per_bed !== null && property.price_per_bed !== undefined
                          ? parseFloat(Number(property.price_per_bed).toFixed(1))
                          : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">سنة البناء:</span>
                    <span className="text-foreground font-semibold">{property.building_year}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">العنوان:</span>
                    <span className="text-foreground font-semibold">{property.address}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">المدينة:</span>
                    <span className="text-foreground font-semibold">{property.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">الحالة:</span>
                    <span className="text-foreground font-semibold">{property.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                    <span className="text-foreground font-semibold">{new Date(property.created_at).toLocaleDateString('en')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">رقم رخصة الاعلان   : </span>
                    <span className="text-foreground font-semibold">{property.residence_license}</span>
                  </div>
                </div>
              </div>


                {/* Services */}
                {loadingData ? (
                    <div className="flex items-center justify-center mb-6">
                      <LoadingSpinner/>
                    </div>
                  ) : (
                  propertyData?.services?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">الخدمات</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {propertyData.services.map((service, index) => (
                          <Card key={service.id} className="p-3 bg-muted shadow-sm rounded-lg">
                            <h4 className="font-medium text-foreground mb-1">
                              {index + 1}. {service.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                            {service.extra_cost && (
                              <p className="text-sm text-foreground mt-1">
                                تكلفة إضافية: {service.extra_cost}
                              </p>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                )}

            

              {/*  Status Selector */}
              { (property.status === "pending" || property.status === "changes_requested") &&(
                <div className="mb-6 f border-t pt-4">
                    <label className="text-muted-foreground font-medium pb-6">حالة العقار:</label>

                    <div className="flex items-center justify-between mt-2 flex-col md:flex-row gap-4">
                    <Select value={status} onValueChange={setStatus} >
                      <SelectTrigger className="w-[180px] text-right">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                          {/* <SelectItem value="pending">قيد المراجعة</SelectItem> */}
                          <SelectItem value="approved">قبول</SelectItem>
                          <SelectItem value="rejected">رفض</SelectItem>
                          <SelectItem value="changes_requested">بحاجة إلى تعديل</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSaveClick}
                      disabled={loading}
                      variant="default"
                      size="lg"
                      className="text-lg py-3"
                    >
                      <Edit className="w-5 h-5 ml-2" />
                      {loading ? 'جارٍ الحفظ...' : 'حفظ التعديل'}
                    </Button>
                  </div>

                </div>
              ) }

            </CardContent>
          </Card>


          {/* -------------------------- */}
          {/* Dialog Notes */}
            <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>الملاحظات</DialogTitle>
                </DialogHeader>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أدخل الملاحظات التي يجب إرسالها للمالك/الوسيط"
                  className="w-full p-2 border rounded resize-none mt-2"
                  rows={6}
                />
                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    onClick={() => {
                      setNotesDialogOpen(false);
                      updateStatus(); 
                    }}
                    variant="default"
                  >
                    إرسال السبب
                  </Button>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          {/* -------------------------- */}


        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;












