import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { adminApi } from '@/api';

type CustomerDetailsType = {
  company_name: string;
  registration_number: string;
  approx_employee_count: number;
  business_activity: string;
  responsible_person: string;
  responsible_position: string;
  first_phone_number: string;
  second_responsible_person?: string;
  second_phone_number?: string;
  favorite_area?: string;
  user_id: string;
  status: string;
  reason?: string | null;
  created_at: string;
  updated_at: string;
};

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<CustomerDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getCustomerDetailsById(id);
        setData(res);
      } catch (err) {
        console.error(err);
        setError('فشل في جلب بيانات العميل');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

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

  if (!data) {
    return <div className="text-center">لا توجد بيانات</div>;
  }

  return (
    <div>
        <Card className="border-none shadow-md">
        <CardContent className="p-6 space-y-6">

            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">تفاصيل العميل</h2>
            <Badge
                className={
                data.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
            >
                {data.status === 'approved' ? 'نشط' : 'قيد المراجعة'}
            </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <Info label="اسم الشركة" value={data.company_name} />
            <Info label="رقم السجل التجاري" value={data.registration_number} />
            <Info label="عدد الموظفين التقريبي" value={data.approx_employee_count} />
            <Info label="النشاط التجاري" value={data.business_activity} />
            <Info label="المسؤول الرئيسي" value={data.responsible_person} />
            <Info label="المنصب" value={data.responsible_position} />
            <Info label="رقم الهاتف" value={data.first_phone_number} />
            <Info label="المنطقة المفضلة" value={data.favorite_area || '-'}/>
            <Info label="تاريخ الإنشاء" value={new Date(data.created_at).toLocaleDateString()} />

            {data.reason && (
                <Info label="سبب الحالة" value={data.reason} />
            )}
            </div>
        </CardContent>
        </Card>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: any }) => (
  <div className="bg-muted/40 p-3 rounded-md">
    <p className="text-base text-primary mb-1">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

export default CustomerDetails;
