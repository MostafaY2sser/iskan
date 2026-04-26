
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { api } from "@/api/api";
import { toast } from "sonner";
import { adminApi } from "@/api";


const SpecialRequestDetails: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Fetch request details
  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // const res = await api.get(`/admin/special_requests/${id}`);
      const res = await adminApi.getSingleSpecialRequests(Number(id));
      setRequest(res);
      setStatus(res.status);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل تفاصيل الطلب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!status) return toast.warning("اختر الحالة أولاً");
    try {
      setUpdating(true);
      await adminApi.updateSpecialRequestStatus(Number(id), status);
      toast.success("تم تحديث حالة الطلب بنجاح");
      fetchRequestDetails();
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحديث حالة الطلب");
    } finally {
      setUpdating(false);
    }
  };


  const getStatusBadge = (status: string) => {
    const normalized = status?.trim().toLowerCase();
    switch (normalized) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case "in review":
        return <Badge className="bg-blue-100 text-blue-800">تحت المراجعة</Badge>;
      case "contacted":
        return <Badge className="bg-green-100 text-green-800">تم التواصل</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">مغلق</Badge>;
      default:
        return <Badge variant="secondary">غير معروف</Badge>;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] flex-col gap-4">
        <LoadingSpinner />
        <p>جاري عرض تفاصيل الطلب</p>
      </div>
    );

  if (!request)
    return <div className="text-center text-red-600 py-10">لم يتم العثور على الطلب</div>;

  return (
    <div className="bg-muted min-h-screen">

      <div className='mb-6 bg-white p-4 rounded-md shadow-md'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">تفاصيل الطلب الخاص</h1>
        <p className="text-muted-foreground mb-6">
          عرض جميع التفاصيل الخاصة بالطلب رقم {request.id}
        </p>
      </div>

      <Card className="bg-card shadow-lg border-none">
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold">اسم الشركة:</h3>
              <p>{request.customer?.company_name || "-"}</p>
            </div>

            <div>
              <h3 className="font-bold">الشخص المسؤول:</h3>
              <p>{request.customer?.responsible_person || "-"}</p>
            </div>

            <div>
              <h3 className="font-bold">رقم الهاتف:</h3>
              <p>{request.customer?.first_phone_number || "-"}</p>
            </div>

            <div>
              <h3 className="font-bold">عدد الغرف:</h3>
              <p>{request.bed_count}</p>
            </div>

            <div>
              <h3 className="font-bold">المناطق المفضلة:</h3>
              <div className="flex flex-col space-y-1">
                <span>{request.preferred_area1}</span>
                <span>{request.preferred_area2}</span>
                <span>{request.preferred_area3}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold">الخدمات المطلوبة:</h3>
              <p>{request.services_required}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-bold">المتطلبات الخاصة:</h3>
              <p>{request.special_requirements || "-"}</p>
            </div>

            <div>
              <h3 className="font-bold">تاريخ الإنشاء:</h3>
              <p>{new Date(request.created_at).toLocaleDateString("en")}</p>
            </div>

            <div>
              <h3 className="font-bold">الحالة الحالية:</h3>
              {getStatusBadge(request.status)}
            </div>
          </div>

          {/* Update Status */}
          <div className="mt-8 border-t pt-4">
            <h3 className="font-bold mb-2">تحديث الحالة</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Select onValueChange={(v) => setStatus(v)} value={status}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">قيد المراجعة</SelectItem>
                  <SelectItem value="In Review">تحت المراجعة</SelectItem>
                  <SelectItem value="Contacted">تم التواصل</SelectItem>
                  <SelectItem value="Closed">مغلق</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleUpdateStatus} disabled={updating}>
                {updating ? "جاري التحديث..." : "تحديث الحالة"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialRequestDetails;
