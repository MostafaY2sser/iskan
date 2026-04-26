import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { adminApi, residencesApi } from '@/api';
import { Bath, Bed, ChevronLeft, ChevronRight, Home, MapPin } from 'lucide-react';

const OwnerDetails = () => {
    const { id } = useParams<{ id: string }>();

    const [owner, setOwner] = useState<any>(null);
    const [residences, setResidences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<Record<number, number>>({});
    const [galleryImages, setGalleryImages] = useState<Record<number, string[]>>({});
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

    // SLider of Images :-------
    const next = (residenceId: number) =>
        setCurrentImage((prev) => ({
            ...prev,
            [residenceId]:
            ((prev[residenceId] ?? 0) + 1) %
            (galleryImages[residenceId]?.length || 1),
        }));

    const prev = (residenceId: number) =>
        setCurrentImage((prev) => ({
            ...prev,
            [residenceId]:
            (prev[residenceId] ?? 0) === 0
                ? (galleryImages[residenceId]?.length || 1) - 1
                : (prev[residenceId] ?? 0) - 1,
        }));
    // SLider of Images :-------
      


    // Get Residences By UserId  && Residences ByU serId :---------------
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
        try {
            setLoading(true);

            const [ownerRes, residencesRes] = await Promise.all([
            adminApi.getOwnerDetailsById(id),
            adminApi.getResidencesByUserId(id),
            ]);

            setOwner(ownerRes);
            setResidences(residencesRes || []);
        } catch (err) {
            console.error(err);
            setError('فشل في جلب البيانات ');
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [id]);
    // Get Residences By UserId  && Residences ByU serId :---------------

    

    // get Property Gallery :-----------------
    useEffect(() => {
        if (!residences.length) return;

        residences.forEach((residence) => {
            const fetchGallery = async () => {
            try {
                setLoadingImages((prev) => ({ ...prev, [residence.id]: true }));

                const res = await residencesApi.getPropertyGallery(residence.id);
                const results = res.results || res.data?.results || [];

                if (Array.isArray(results) && results.length > 0) {
                setGalleryImages((prev) => ({
                    ...prev,
                    [residence.id]: results.map((img: any) => img.public_url),
                }));
                setCurrentImage((prev) => ({ ...prev, [residence.id]: 0 }));
                } else {
                setGalleryImages((prev) => ({ ...prev, [residence.id]: [] }));
                }
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                setGalleryImages((prev) => ({ ...prev, [residence.id]: [] }));
            } finally {
                setLoadingImages((prev) => ({ ...prev, [residence.id]: false }));
            }
            };

            fetchGallery();
        });
    }, [residences]);
    // get Property Gallery :-----------------


    
    if (loading) {
        return (
        <div className="h-64 flex items-center justify-center">
            <LoadingSpinner />
        </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Owner Status */}
            {owner && (
                <Card className="border-none shadow-md">
                <CardContent className="p-6 space-y-3">
                    <h2 className="text-xl font-semibold">  
                        { !owner.gender && (
                            "بيانات الوسيط العقاري"
                        )}
                        { owner.gender && (
                            " بيانات المالك "
                        )}

                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {owner.company_name &&(
                            <Info label="اسم الشركة" value={owner.company_name} />
                        )}
                        {owner.name &&(
                            <Info label="الاسم" value={owner.name} />
                        )}
                        <Info label="الحالة" value={owner.status} badge />
                        { owner.registration_number && (
                            <Info label="رقم السجل" value={owner.registration_number} />
                        )}
                        { owner.val_license_number && (
                            <Info label="رقم رخصة فال" value={owner.val_license_number} />
                        )}
                        { owner.business_activity && (
                            <Info label="النشاط التجاري" value={owner.business_activity} />
                        )}
                        { owner.responsible_person && (
                            <Info label="المسؤول" value={owner.responsible_person} />
                        )}
                        { owner.phone_number && (
                            <Info label="رقم الهاتف" value={owner.phone_number} />
                        )}
                        { owner.region && (
                            <Info label="المنطقة" value={owner.region} />
                        )}
                        { owner.city && (
                            <Info label="المدينة" value={owner.city} />
                        )}
                        { owner.address && (
                            <Info label="العنوان" value={owner.address} />
                        )}
                        { owner.gender && (
                            <Info label="نوع الجنس" value={owner.gender} />
                        )}
                        { owner.reason && (
                            <Info label="سبب الحالة" value={owner.reason} />
                        ) }
                        <Info label="تاريخ الإنشاء" value={formatDate(owner.created_at)} />
                        <Info label="آخر تحديث" value={formatDate(owner.updated_at)} />
                    </div>
                </CardContent>
                </Card>
            )}
            

            {/* Residences */}
            <div className="space-y-6 bg-white sm:p-4 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold">العقارات</h3>

                {residences.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">
                    لا يوجد عقارات مسجلة
                    </p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {residences.map((residence, idx) => {
                    

                    return (
                        <Card key={residence.id} className="border-none shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                            <CardContent className="p-0 flex flex-col h-full">

                                {/* Property Image :------------ */}
                                <div className="relative h-[230px] bg-gray-200 rounded-t-lg overflow-hidden">
                                    {loadingImages[residence.id] ? (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        جاري التحميل...
                                        </div>
                                    ) : galleryImages[residence.id]?.length > 0 ? (
                                        <img
                                        src={galleryImages[residence.id][currentImage[residence.id] ?? 0]}
                                        alt={`residence ${currentImage[residence.id] + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-all duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        لا توجد صور
                                        </div>
                                    )}

                                    {/* arrows */}
                                    {galleryImages[residence.id]?.length > 1 && (
                                        <>
                                        <button
                                            onClick={() => next(residence.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#DDD4BA] text-primary w-[40px] h-[40px] rounded-full flex items-center justify-center"
                                        >
                                            <ChevronRight />
                                        </button>

                                        <button
                                            onClick={() => prev(residence.id)}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#DDD4BA] text-primary w-[40px] h-[40px] rounded-full flex items-center justify-center"
                                        >
                                            <ChevronLeft />
                                        </button>
                                        </>
                                    )}
                                </div>
                                 {/* Property Image :------------ */}


                                {/* Property Details */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex flex-col mb-2">
                                        <h3 className="text-[18px] font-[700] text-[#2E4166]">{residence.name}</h3>
                                        <div className="flex items-center text-[#5D6772] text-[14px] font-[500] mb-3">
                                            <MapPin className="w-4 h-4 ml-1" />
                                            <span className="text-sm">{residence.address}, {residence.city}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mb-5 text-[#516180] font-normal text-[13px]">
                                        <div className="flex justify-between">
                                            <span>الوصف :</span>
                                            <p className="text-gray-600 text-sm">{residence.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4" />
                                            <span>عدد الأسرة :</span>
                                            </div>
                                            <span>{residence.bed_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4" />
                                            <span>عدد الحمّامات :</span>
                                            </div>
                                            <span>{residence.bathroom_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Home className="w-4 h-4" />
                                                <span>عدد الغرف :</span>
                                            </div>
                                            <span>{residence.rooms_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Home className="w-4 h-4" />
                                                <span> سنة الباء :</span>
                                            </div>
                                            <span>{residence.building_year}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4 text-[13px] font-[600] text-[#2E4166] p-[16px] bg-[#F7F8FA] rounded-sm">
                                    <span className="text-sm text-gray-700">السعر لكل سرير:</span>
                                    <p>{residence.price_per_bed} ريال</p>
                                    </div>

                                    {/* Services */}
                                    <div>
                                    <p className="font-medium mb-2">الخدمات</p>
                                    {residence.services?.length ? (
                                        <div className="flex flex-wrap gap-2">
                                        {residence.services.map((s) => (
                                            <Badge key={s.id} variant="secondary">{s.name} (+{s.extra_cost})</Badge>
                                        ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">لا توجد خدمات</p>
                                    )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                    })}
                </div>

            )}
            </div>


        </div>
    );
};

const Info = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: any;
  badge?: boolean;
}) => (
  <div className="p-3 rounded-md shadow-md ">
    <p className="text-base text-primary mb-1">{label}</p>
    {badge ? <Badge>{value}</Badge> : <p className="font-bold">{value}</p>}
  </div>
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en');

export default OwnerDetails;
