import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/api/api';
import { adminApi } from '@/api';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await adminApi.getBooingDetailsById(id);
        setBooking(res);
      } catch (error) {
        console.error('Error fetching booking details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="h-full flex items-center justify-center flex-col gap-4">
            <LoadingSpinner />
            <p className="p-6">جاري تحميل تفاصيل الحجز...</p>
        </div>
  }

  if (!booking) {
    return <div className="p-6 text-red-500">لم يتم العثور على بيانات الحجز</div>;
  }

  return (
    <div className="p-6 space-y-8  bg-white rounded-lg shadow-md">

        {/* العنوان */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
            تفاصيل الحجز
            <span className="text-gray-500 text-base ms-2">
                #{booking.id}
            </span>
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.admin_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : booking.admin_status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : booking.admin_status === 'approved' && !booking.is_paid
                  ? 'bg-blue-100 text-blue-700'
                  : booking.admin_status === 'approved' && booking.is_paid
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {booking.admin_status === 'pending'
                ? 'قيد مراجعة الإدارة'
                : booking.admin_status === 'rejected'
                ? 'مرفوض من الإدارة'
                : booking.admin_status === 'approved' && !booking.is_paid
                ? 'موافق عليه (غير مدفوع)'
                : booking.admin_status === 'approved' && booking.is_paid
                ? 'نشط / مدفوع'
                : 'غير معروف'}
            </span>

        </div>

        {/* بيانات الحجز */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard label="عدد الأسرة" value={booking.bed_count} />
            <InfoCard label="تاريخ البداية" value={booking.start_date} />
            <InfoCard label="تاريخ النهاية" value={booking.end_date} />
            <InfoCard label="مدفوع" value={booking.is_paid ? 'نعم' : 'لا'} />
            <InfoCard label="موافقة الأدمن" value={booking.is_admin_approved ? 'نعم' : 'لا'} />
            <InfoCard label="موافقة الماللك" value={booking.status ? 'نعم' : 'لا'} />
        </div>

        {/* السعر */}
        <div className="p-5 rounded-lg shadow-md flex items-center justify-between">
            <p className="text-base text-primary">السعر الإجمالي مع العمولة</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {booking.total_price_with_commission !== null && booking.total_price_with_commission !== undefined
                ? parseFloat(Number(booking.total_price_with_commission).toFixed(1))
                : '-'} ر.س
            </p>
        </div>

        {/* الخدمات */}
        <div>
            <h2 className="text-lg font-semibold mb-3">
            الخدمات المضافة
            </h2>

            {booking.services?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {booking.services.map((service, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between bg-white border rounded-lg px-4 py-3 shadow-sm"
                >
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-600">
                    {service.price} ر.س
                    </span>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-sm text-gray-500">لا توجد خدمات مضافة</p>
            )}
        </div>

    </div>

  );
};


const InfoCard = ({ label, value }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex items-center gap-2 flex-col">
      <p className="text-base text-primary mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
};


export default BookingDetails;
