

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, AlertCircle, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/api';
import { useLanguage } from "@/providers/LanguageProvider";
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/components/ui/button';



const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t, language } = useLanguage();
  const [commissionRate, setCommissionRate] = useState<number | null>(null);
  const [updatingCommission, setUpdatingCommission] = useState(false);
  const [clicksAnalytics, setClicksAnalytics] = useState<{
    top_10_residences: { id: number; total_clicks: number }[];
    monthly_platform_performance: { month: string; clicks: number }[];
  } | null>(null);



  useEffect(() => {
    const fetchDashboardData = async () => {
     setLoading(true);
     setError(false);
      try {
        const locale = 'ar';
        const statsData = await adminApi.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        toast.error('فشل في تحميل بيانات لوحة التحكم');
        setError(true);
      } finally {
        setLoading(false);
      }

    };

    fetchDashboardData();
  }, [language]);

  // Commission Rate
   useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [statsData, commissionRes, clicksRes] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.CommissionRate(),
          adminApi.getResidencesClicksAnalytics(),
        ]);

        setStats(statsData);

        setCommissionRate(
          commissionRes.commission_rate ??
          commissionRes.data?.commission_rate ??
          null
        );

        setClicksAnalytics(clicksRes);

      } catch (err) {
        toast.error('فشل في تحميل بيانات لوحة التحكم');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [language]);


  const handleUpdateCommission = async () => {
  if (commissionRate === null) return;

  try {
    setUpdatingCommission(true);

    await adminApi.updateCommissionRate({
      commission_rate: commissionRate,
    });

    toast.success('تم تحديث معدل العمولة');

  } catch (err) {
    toast.error('فشل في تحديث معدل العمولة');
  } finally {
    setUpdatingCommission(false);
  }
};
  // Commission Rate

  

  // Total Monthly Revenue
  const totalMonthlyRevenue = stats?.monthly_revenue_analytics
    ? stats.monthly_revenue_analytics.reduce((total: number, item: any) => total + Number(item.revenue), 0)
    : 0;


  if (loading)
   return (
        <div className="h-full flex items-center justify-center flex-col gap-4">
          <LoadingSpinner />
          <p>{t("common.loading")}</p>
        </div>
    );

  if (error) {
    return <p className="text-center mt-10 text-red-500">فشل في تحميل البيانات</p>;
  }

  if (!stats) {
    return <p className="text-center mt-10 text-yellow-500"> لم يتم العثور على بيانات</p>;
  }

  return (
    <div className="space-y-8 bg-[#ffffffc7] p-4 rounded-lg shadow-lg">
      <div className="mb-4 p-4 bg-white shadow-sm rounded-md">
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">{t("nav.dashboard")}</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">{t("dashboard.dashboard_overview")}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {stats.key_metrics.map((metric: any, i: number) => {
            const Icon =
              i === 0
                ? Users
                : i === 1
                ? Building
                : i === 2
                ? Banknote
                : AlertCircle;

            return (
              <Card key={i} className='border-none shadow-md '>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold ltr-content">
                    {metric.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">

        <Card className="border-none shadow-md">
          <CardHeader className="flex justify-center items-center">
            <CardTitle className="text-lg font-bold">
              معدل العمولة
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">

            <input
              type="number"
              min={0}
              max={0.5}
              step={0.1}
              value={commissionRate ?? ''}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-32 text-center border rounded-md p-2"
            />

            <Button
              onClick={handleUpdateCommission}
              disabled={commissionRate === null || updatingCommission}
            >
              {updatingCommission ? t('saving') :  t('save') }
            </Button>

          </CardContent>
        </Card>


        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-center space-y-0">
            <CardTitle className="text-lg font-bold">{t("dashboard.monthly_income")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            <p className="text-4xl font-bold mb-2">
              {/* {stats.monthly_revenue_analytics.reduce((acc: number, item: any) => acc + item.revenue, 0).toLocaleString()} ر.س */}
              <p className="text-4xl font-bold mb-2">
                {totalMonthlyRevenue.toLocaleString()} ر.س
              </p>
            </p>
            <p className="text-lg text-muted-foreground">{t("dashboard.total_monthly_income")}</p>
          </CardContent>
        </Card>
      </div>

        

      {/* USer & Residence  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">{t("dashboard.users_per_type")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.user_breakdown_by_type.map((user: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-lg font-bold">{user.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">{t("dashboard.units_by_status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.residence_breakdown_by_status.map((res: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm font-medium">{res.name}</span>
                  <span className="text-lg font-bold">{res.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">{t("dashboard.users_pending_approval")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.actionable_queues.pending_users.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm font-medium">{user.user_type}</span>
                   <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={user.email}>
                      {user.email}
                    </span>
                </div>
              ))}
              {stats.actionable_queues.pending_users.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">{t("dashboard.no_users_pending_approval")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">{t("dashboard.units_pending_approval")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.actionable_queues.pending_residences.slice(0, 5).map((res: any) => (
                <div key={res.id} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm font-medium">{res.name}</span>
                  <span className="text-xs text-muted-foreground">{res.status}</span>
                </div>
              ))}
              {stats.actionable_queues.pending_residences.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">{t("dashboard.no_units_pending_approval")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='border-none shadow-md '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">{t("dashboard.bookings_without_agent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.actionable_queues.unassigned_bookings.slice(0, 5).map((b: any) => (
                <div key={b.id} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm font-medium">{b.residence_name}</span>
                  <span className="text-xs text-muted-foreground">{t("dashboard.without_agent")}</span>
                </div>
              ))}
              {stats.actionable_queues.unassigned_bookings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">{t("dashboard.no_bookings_without_agent")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
             {t('most_viewed_properties')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {clicksAnalytics?.top_10_residences.map((item, index) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm border-b border-b-gray-400 py-2"
              >
                <span className="font-medium">
                  #{index + 1} عقار {item.id}
                </span>
                <span className="font-bold">
                  {item.total_clicks} زيارة
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t('platform_monthly_performance')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {clicksAnalytics?.monthly_platform_performance.map(item => (
              <div
                key={item.month}
                className="flex justify-between items-center text-sm border-b border-b-gray-400 py-2"
              >
                <span>
                  {new Date(item.month).toLocaleDateString('ar-EG', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="font-bold">
                  {item.clicks} زيارة
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;
