import React, { useMemo, useState , useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Calendar,
  Home as HomeLine,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  Plus,
} from 'lucide-react';

// Replace DashboardLayout  from Layouts folder not from Components shared  :----------------
// import DashboardLayout from '@/components/shared/DashboardLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import TotalAssetsCard from '@/components/totalAssets';
import { useDashboard } from '@/hooks/useDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardApi } from '@/api';


const PRIMARY = '#2E4166';
const SECONDARY = '#D9C690';


const KpiMiniCard: React.FC<{
  value: string;
  label: string;
  icon: React.ReactNode;
}> = ({ value, label, icon }) => (
  <Card className="bg-white rounded-2xl shadow-sm border border-border h-full">
    <CardContent className="h-full p-4 sm:p-6">
      <div className="flex h-full items-center justify-between gap-3 sm:gap-4" >
        {/* Right: value + label (aligned like Figma) */}
        <div className=" flex-1">
          <p className="text-lg sm:text-[22px] font-extrabold" style={{ color: PRIMARY }}>{value}</p>
          <p className="text-xs sm:text-[13px] text-muted-foreground mt-1">{label}</p>
        </div>

        {/* Left: icon in soft square */}
        <div className="w-10 h-10 sm:w-12 sm:h-12  flex items-center justify-center bg-white shrink-0">
          <div className="text-[0] leading-none" style={{ color: SECONDARY }}>
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {

  const navigate = useNavigate();
  const { t , i18n } = useTranslation()
  const isRTL = i18n.language === 'ar';
  const { data: dashboardData, loading, error } = useDashboard();
  // const { analytics, loading: analyticsLoading } = useAnalytics();
  const analytics = useAnalytics(
    dashboardData?.userResidences,
    dashboardData?.recentBookings
  );

  // Clicks Analytics State :---------------------
  const [clicksData, setClicksData] = useState<{
    total: number;
    top5: { id: number; clicks: number }[];
  }>({ total: 0, top5: [] });
  const [clicksLoading, setClicksLoading] = useState(true);


  // Get Clicks Analytics :--------------------
  useEffect(() => {
    const fetchClicks = async () => {
      setClicksLoading(true);
      try {
        const res = await dashboardApi.getClicksAnalytics();
        setClicksData({
          total: res.total_clicks_across_all_my_residences,
          top5: res.top_5_residences,
        });
      } catch (err) {
        console.error(err);
        setClicksData({ total: 0, top5: [] });
      } finally {
        setClicksLoading(false);
      }
    };

    fetchClicks();
  }, []);
  // Get Clicks Analytics :--------------------


  //  Pie chart values :---------------------
  const piePercentages = useMemo(() => {
    if (!clicksData.total || clicksData.top5.length === 0) return [];
    return clicksData.top5.map(item => ({
      id: item.id,
      clicks: item.clicks,
      percentage: (item.clicks / clicksData.total) * 100,
    }));
  }, [clicksData]);
//  Pie chart values :---------------------


  //  Legend labels :---------------------
  const getResidenceName = (id: number) => {
    const residence = dashboardData?.userResidences.find(r => r.id === id);
    return residence?.name || t('property_not_defined');
  };
  //  Legend labels :---------------------


  // Get raw monthly amounts for display :-------------------------
  const monthlyAmounts = useMemo(() => {
    if (!dashboardData?.monthlyAnalytics) return new Array(12).fill(0);

    const arr = new Array(12).fill(0);

    dashboardData.monthlyAnalytics.forEach(a => {
      const monthIndex = parseInt(a.month_year.split('-')[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        arr[monthIndex] = a.total_amount;
      }
    });

    return arr;
  }, [dashboardData?.monthlyAnalytics]);
  // Get raw monthly amounts for display :-------------------------



  //  Data processing :---------------------
  const months = [
    t('january'),
    t('february'),
    t('march'),
    t('april'),
    t('may'),
    t('june'),
    t('july'),
    t('august'),
    t('september'),
    t('october'),
    t('november'),
    t('december'),
  ];
  
  
  // Process monthly analytics for chart - NO MORE STATIC DATA
  const barValues = useMemo(() => {
    if (!dashboardData?.monthlyAnalytics) {
      // Return empty array instead of fake data
      return new Array(12).fill(0);
    }
    
    // Create array for 12 months, filling with 0 for missing months
    const monthlyData = new Array(12).fill(0);
    
    dashboardData.monthlyAnalytics.forEach(analytics => {
      const monthIndex = parseInt(analytics.month_year.split('-')[1]) - 1; // Convert MM to 0-based index
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex] = Math.min(100, (analytics.total_amount / 1000)); // Scale to 0-100 range
      }
    });
    
    return monthlyData;
  }, [dashboardData?.monthlyAnalytics]);

  const maxVal = useMemo(() => {
    const max = Math.max(...barValues);
    return max > 0 ? max : 100; // Use 100 as default if no data
  }, [barValues]);

  
  const getStatusText = (booking: any) => {
    if (booking.admin_status === 'approved' && booking.is_paid === true) {
      return t('active');
    }
    if (booking.admin_status === 'rejected') {
      return t('admin_rejected');
    }
    if (booking.admin_status === 'approved') {
      return t('admin_approved');
    }

    switch (booking.status) {
      case 'pending':
        return t('pending_review');

      case 'approved':
        return t('approved');

      case 'rejected':
        return t('rejected');

      default:
        return booking.status;
    }
  };

  const getStatusColor = (booking: any) => {
    if (booking.admin_status === 'rejected') {
      return '#EF4444'; 
    }

    switch (booking.status) {
      case 'pending':
        return '#E89A0F'; 

      case 'approved':
        return '#00A47E'; 

      case 'rejected':
        return '#EF4444'; 

      default:
        return '#6B7280';
    }
  };


  // Process offers data for table
  const offersData = useMemo(() => {
    if (!dashboardData?.recentBookings) return [];

    return dashboardData.recentBookings
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
      .slice(0, 10) 
      .map((booking) => ({
        id: booking.id,
        property: dashboardData.userResidences.find(r => r.id === booking.residence_id)?.name || t('property_not_defined'),
        clients: booking.bed_count,
        monthlyPrice: `${t('currency')} ${booking.total_price_with_commission.toLocaleString()}`,
        status: getStatusText(booking),
        statusColor: getStatusColor(booking),
      }));
  }, [dashboardData?.recentBookings, dashboardData?.userResidences]);

  // ---- Table pagination state ----
const PAGE_SIZE = 5;                      // how many rows per page
const [page, setPage] = useState(1);  

const totalPages = Math.max(1, Math.ceil(offersData.length / PAGE_SIZE));
const start = (page - 1) * PAGE_SIZE;
const pageRows = offersData.slice(start, start + PAGE_SIZE);

// handlers
const goFirst = () => setPage(1);
const goPrev  = () => setPage(p => Math.max(1, p - 1));
const goNext  = () => setPage(p => Math.min(totalPages, p + 1));
const goLast  = () => setPage(totalPages);
const goTo    = (n: number) => setPage(Math.min(Math.max(1, n), totalPages));

  // Get display name from real data
  // Comment it -> get user Type only to show thye only :- 
  // const displayName = userDetails?.responsible_person || 
  //                    userDetails?.company_name || 
  //                    'مستخدم';

  // Show loading state
  if (loading ) {
    return (
      <DashboardLayout title={t('customer_sidebar_dashboard')} subtitle={` ${t('welcome_in_dashboard')}`}>
        <div className="flex items-center justify-center h-[calc(100vh-350px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading_data')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout title="لوحة التحكم" subtitle={` ${t('welcome_in_dashboard')}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{t('loading_data_error')}</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout title={t('customer_sidebar_dashboard')} subtitle={` ${t('welcome_in_dashboard')} `}>
      <div  className="space-y-8">

        <div className="mb-6 bg-white rounded-md shadow-md p-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('customer_sidebar_dashboard')}</h1>
          <p className=" text-[#516180] text-sm sm:text-base font-[400]">{t('welcome_in_dashboard')}</p>
        </div>

        {/* ===== Top KPI row (mobile-first responsive) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch" >
          {/* إجمالي العقارات - Full width on mobile, 2 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-2">
            <TotalAssetsCard 
              count={analytics?.totalResidences || 0} 
              percent={analytics?.capacityPercentage || 0} 
              className="h-full w-full  p-0" 
            />
          </div>

          {/* الحجوزات النشطة */}
          <KpiMiniCard
            value={dashboardData?.kpis.activeBookings?.toString() || "0"}
            label={t('customer_active_booking')}
            icon={<Calendar className="w-6 h-6 sm:w-10 sm:h-10" />}
          />

          {/* الإيرادات الشهرية */}
          <KpiMiniCard
            value={` ${t('currency') } ${(dashboardData?.kpis.monthlyRevenue || 0 ).toLocaleString()}`}
            label={t('monthly_Revenue')}
            icon={<SaudiRiyalIcon className="w-6 h-6 sm:w-10 sm:h-10" />}
          />
            
        </div>


        {/* ===== Revenue big bar card - Mobile optimized ===== */}
        <Card className="bg-white rounded-2xl shadow-sm border border-border ">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="">
                <p className="text-base font-semibold text-[#2E4166]">{t('total_revenue')}</p>
                <div className="flex items-center gap-2">
                  <div className='flex items-center gap-1'>
                    <p className="text-[#2E4166] font-semibold text-base sm:text-2xl">{(dashboardData?.kpis.totalRevenue || 0).toLocaleString()}</p>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 14.6084C15.8943 15.4635 15.848 15.8345 15.4531 16.668L9.38965 17.9199C9.52903 17.0191 9.71461 16.324 10.0166 15.9072L16 14.6084ZM7.55469 8.71191L9.36621 8.31934V2.59375C10.0413 1.8359 10.4566 1.49559 11.2715 1.06543V7.90527L16 6.87891C15.8943 7.73376 15.8478 8.10429 15.4531 8.9375L11.2715 9.82129V11.7451L16 10.7441C15.8943 11.5992 15.848 11.9702 15.4531 12.8037L11.2715 13.667V13.6846L9.36621 14.0781V10.2236L7.55469 10.6064V13.0361L7.52344 13.042C7.10672 13.7727 6.51827 14.6506 5.95117 15.3516L0 16.4854C0.0533615 15.7196 0.164479 15.2879 0.510742 14.5166L5.64941 13.4023V11.0098L0.886719 12.0176C0.940076 11.2519 1.05224 10.821 1.39844 10.0498L5.64941 9.12598V1.52832C6.32454 0.770471 6.73977 0.430158 7.55469 0V8.71191Z" fill="#2E4166"/>
                    </svg>
                  </div>
                  {/* {t('currency')}  */}
                  <p className="text-[13px] text-[#516180]"> {t('cumulative_price')} {(dashboardData?.kpis.monthlyRevenue || 0).toLocaleString()}  {t('saudi_riyal')}</p>
                </div>
              </div>
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-gray-200 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: PRIMARY }} />
              </div> */}
            </div>

            {/* Bars (mobile responsive) */}
            <div className="grid grid-cols-12 gap-1 sm:gap-3 items-end">
              {barValues.map((v, i) => {
                const h = Math.max(0, Math.round((v / maxVal) * (window.innerWidth < 640 ? 80 : 140))); // responsive bar height
                return (
                  <div key={i} className="flex flex-col items-center gap-1 sm:gap-2">
                    <div className="relative w-[8px] sm:w-[14px] h-[90px] sm:h-[150px] rounded-full bg-gray-100 overflow-hidden">
                      {/* fill */}
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-full"
                        style={{ height: `${h}px`, backgroundColor: PRIMARY }}
                      />
                      {/* cap (small lighter top) */}
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: '0px',
                          backgroundColor: '#1f2f4c',
                          borderTopLeftRadius: 999,
                          borderTopRightRadius: 999,
                        }}
                      />
                    </div>
                     <p className="text-[13px] text-primary">{monthlyAmounts[i].toLocaleString()}</p>
                    <span className="text-[9px] sm:text-[11px] text-muted-foreground">{months[i]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ===== Bottom row: Pie + Table (Mobile optimized) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            {/* Table - Mobile card view */}
            <Card className="bg-white rounded-2xl shadow-sm border border-border">
              <CardHeader className="pb-2 p-2 sm:p-6">
                <CardTitle className="text-base sm:text-2xl">{t('latest_bookings')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 p-2 sm:p-6">
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {pageRows.map((row) => (
                    <div key={row.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          className="text-white text-xs px-2.5 py-1 rounded-md"
                          style={{ backgroundColor: row.statusColor }}
                        >
                          {row.status}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">#{row.id}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{row.property}</p>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>العملاء: {row.clients}</span>
                          <span>{row.monthlyPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm" >
                    <thead>
                      <tr className="border-b border-border text-foreground">
                        <th className="py-3  font-medium">#</th>
                        <th className="py-3  font-medium">{t('property')}</th>
                        <th className="py-3  font-medium">{t('clients_count')}</th>
                        <th className="py-3  font-medium">{t('monthly_amount')}</th>
                        <th className="py-3  font-medium">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0 border-border">
                          <td className="py-3  text-foreground">{row.id}</td>
                          <td className="py-3  text-foreground">{row.property}</td>
                          <td className="py-3  text-foreground">{row.clients}</td>
                          <td className="py-3  text-foreground">{row.monthlyPrice}</td>
                          <td className="py-3 min-w-[80px]">
                            <Badge
                              className="text-white text-xs px-2 py-1 rounded-md"
                              style={{ backgroundColor: row.statusColor }}
                            >
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Mobile optimized */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6" >
                  {/* Mobile: Simple prev/next */}
                  <div className="flex sm:hidden items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full disabled:opacity-50"
                      onClick={goPrev}
                      disabled={page === 1}
                      aria-label={t('previous')}
                    >
                      <ChevronRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-0' : 'rotate-180' }`} />
                      {t('previous')}
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {page} {t('from')} {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full disabled:opacity-50"
                      onClick={goNext}
                      disabled={page === totalPages}
                      aria-label={t('next')}
                    >
                      {t('next')}
                      <ChevronsLeft className={`w-4 h-4 mr-1 ${isRTL ? '0' : 'rotate-180' } `} />
                    </Button>
                  </div>

                  {/* Desktop: Full pagination */}
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 disabled:opacity-50"
                      onClick={goFirst}
                      disabled={page === 1}
                      aria-label={t('first_page')}
                    >
                      <ChevronsRight className={`w-4 h-4 mr-1 ${isRTL ? '0' : 'rotate-180' } `} />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 disabled:opacity-50"
                      onClick={goPrev}
                      disabled={page === 1}
                      aria-label={t('previous')}
                    >
                      <ChevronsRight className={`w-4 h-4 mr-1 ${isRTL ? '0' : 'rotate-180' } `} />
                    </Button>

                    {/* Dots (pages) */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => goTo(n)}
                          aria-label={`الصفحة ${n}`}
                          className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-medium transition
                            ${n === page
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-foreground border-border hover:bg-muted'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 disabled:opacity-50"
                      onClick={goNext}
                      disabled={page === totalPages}
                      aria-label={t('next')}
                    >
                      <ChevronsLeft className={`w-4 h-4 mr-1 ${isRTL ? '0' : 'rotate-180' } `} />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 disabled:opacity-50"
                      onClick={goLast}
                      disabled={page === totalPages}
                      aria-label={t('last_page')}
                    >
                      <ChevronsLeft className={`w-4 h-4 mr-1 ${isRTL ? '0' : 'rotate-180' } `} />
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Pie Chart - Mobile optimized */}
            <Card className="bg-white rounded-2xl shadow-sm border border-border">
              <CardHeader className="pb-2 p-2 sm:p-6">
                <CardTitle className="text-base sm:text-2xl">{t('total_clicks')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 p-2 sm:p-6">
                {clicksLoading ? (
                  <p className="text-center text-muted-foreground">{t('loading_data')}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-center">
                      <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gray-100 overflow-hidden">
                        {/* Conic gradient for top 5 residences */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(${piePercentages
                              .map((p, i, arr) => {
                                const start = arr.slice(0, i).reduce((sum, x) => sum + x.percentage, 0);
                                const end = start + p.percentage;
                                return `${COLORS[i % COLORS.length]} ${start}% ${end}%`;
                              })
                              .join(', ')})`,
                            boxShadow: '0 0 0 6px rgba(46,65,102,0.08)',
                          }}
                        />

                        {/* Inner circle */}
                        <div className="absolute inset-[22%] rounded-full bg-white" />
                        {/* Center label */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">{clicksData.total}</p>
                            <p className="text-xs text-muted-foreground">{t('total_clicks')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className='mt-4'>
                      <h4 className='text-center mt-3 mb-3'>{t('most_clicked_properties')}</h4>
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2">
                        {piePercentages.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-sm text-foreground">
                              {getResidenceName(p.id)}: {p.clicks} ({p.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

        
        </div>
      </div>
    </DashboardLayout>
  );
};


const SaudiRiyalIcon = ({ className = "w-6 h-6 sm:w-7 sm:h-7" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M176 176C176 211.3 147.3 240 112 240L112 400C147.3 400 176 428.7 176 464L464 464C464 428.7 492.7 400 528 400L528 240C492.7 240 464 211.3 464 176L176 176zM64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM320 208C381.9 208 432 258.1 432 320C432 381.9 381.9 432 320 432C258.1 432 208 381.9 208 320C208 258.1 258.1 208 320 208zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" />
  </svg>
);


const COLORS = ['#2E4166', '#D9C690', '#00A47E', '#EF4444', '#E89A0F'];
export default Dashboard;
