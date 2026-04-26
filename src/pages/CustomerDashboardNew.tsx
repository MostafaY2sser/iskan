import React, { useEffect, useMemo, useState, useTransition } from 'react';
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
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  XCircle,
  Mail,
} from 'lucide-react';
import CustomerDashboardLayoutNew from '@/layouts/CustomerDashboardLayoutNew';
import { useCustomerBookings } from '@/hooks/useCustomerBookings';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';
import ContactHost from '@/components/dashboard/ContactHost';
import { BookingResponse, dashboardApi } from '@/api';

const PRIMARY = '#2E4166';
const SECONDARY = '#D9C690';

const KpiMiniCard: React.FC<{
  value: string;
  label: string;
  icon: React.ReactNode;
}> = ({ value, label, icon }) => (
  <Card className="bg-white rounded-2xl shadow-sm border border-border h-full">
    <CardContent className="h-full p-4 sm:p-6">
      <div className="flex h-full items-center justify-between gap-3 sm:gap-4" dir="rtl">
        {/* Right: value + label (aligned like Figma) */}
        <div className="text-right flex-1">
          <p className="text-lg sm:text-[22px] font-extrabold" style={{ color: PRIMARY }}>{value}</p>
          <p className="text-xs sm:text-[13px] text-muted-foreground mt-1">{label}</p>
        </div>

        {/* Left: icon in soft square */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-gray-200 flex items-center justify-center bg-white shrink-0">
          <div className="text-[0] leading-none" style={{ color: SECONDARY }}>
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomerDashboardNew: React.FC = () => {

  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading } = useCustomerBookings();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { t , i18n  } = useTranslation()
  const isRTL = i18n.language === 'ar';
  const [ showContactHost , setShowContactHost ] = useState(false)
  const [monthlyData, setMonthlyData] = useState<{month: string, amount: number}[]>([]);
  const [lastMonthAmount, setLastMonthAmount] = useState(0);
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
  t('december')
];



  // Total Bookings :---------------------
  const totalBookings = bookings.length;

  // Active Bookings :---------------------
  const activeBookings = bookings.filter(booking => 
    booking.is_paid === true 
  ).length;
  // Active Bookings :---------------------
  

  // ؛ending Bookings :---------------------
  const pendingBookings = bookings.filter(booking => 
    booking.status === 'pending'
  ).length;
  // ؛ending Bookings :---------------------

  
  // const totalSpent = bookings
  //   .filter(booking => booking.status === 'approved')
  //   .reduce((sum, booking) => sum + booking.total_price_with_commission, 0);


  // Get recent bookings for the table :---------------------
  const recentBookings = bookings
    .slice() 
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
    .slice(0, 8);
   // Get recent bookings for the table :--------------------- 


  //  Pagination Bookings in Table :---------------------
  const totalPages = Math.ceil(recentBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = recentBookings.slice(startIndex, endIndex);
  //  Pagination Bookings in Table :---------------------

  // Badge for booking status :------------------------ 
  const getStatusBadge = (booking: BookingResponse) => {
    const now = new Date();
    let text = '';
    let color = '';
    let icon: React.ReactNode = null;

    if (booking.is_paid) {
      // If Admin Approved
      text = (t('active')); ;
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircle className="w-4 h-4" />;
    } 
    else if (booking.status === 'approved'  && booking.admin_status === "approved" ){ 
      // If Owner Approved Only
      text = (t('booking_status_approved'));
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircle className="w-4 h-4" />;
    } else if( booking.admin_status === 'rejected') {
      // text = t('booking_status_rejected');
      text = (t('admin_rejected_booking'));
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="w-4 h-4" />;
    } else if ( booking.status === 'approved'  ){
      text = (t('awaiting_approval'));
      color = 'bg-yellow-100 text-yellow-800';
      icon = <Clock className="w-4 h-4" />;
    }
    else if (
      booking.status === 'pending' ||
      booking.status?.toLowerCase()?.includes('pending')
    ) {
      text = (t('booking_status_review'));
      color = 'bg-yellow-100 text-yellow-800';
      icon = <Clock className="w-4 h-4" />;
    } else if (booking.status === 'rejected' ) {
      text = (t('booking_status_rejected'));
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="w-4 h-4" />;
    } else {
      text = booking.status;
      color = 'bg-gray-100 text-gray-800';
      icon = <AlertCircle className="w-4 h-4" />;
    }

    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {text}
      </Badge>
    );
  };
  // Badge for booking status :------------------------ 


  // Format Date :------------------------
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };
  // Format Date :------------------------


  // Format Price :------------------------
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency')}`;
  };
  // Format Price :------------------------

  

  // Get Monthly Analytics  :--------------------- 
  useEffect(() => {
    const fetchMonthlyAnalytics = async () => {
      try {
        const data = await dashboardApi.getMonthlyAnalytics(); 
        const fullYearData = months.map((monthKey, index) => {
        const month_year = `${new Date().getFullYear()}-${String(index + 1).padStart(2, '0')}`;
        const monthData = data.find(d => d.month_year === month_year);
        return {
          month_year,
          month: t(monthKey),
          amount: monthData ? monthData.total_amount : 0
        };
      });
      setMonthlyData(fullYearData);



        // Last Month Data :-----------------
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        const lastMonthData = data.find(d => d.month_year === lastMonthKey);
        setLastMonthAmount(lastMonthData?.total_amount || 0);

      } catch (error) {
        console.error('Failed to fetch monthly analytics:', error);
      }
    };

    fetchMonthlyAnalytics();
  }, [t]);

  const maxVal = Math.max(...monthlyData.map(d => d.amount), 1); 
  const totalAmount = monthlyData.reduce((sum, item) => sum + item.amount, 0);


  // Current Month Amount :----------------------
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthData = monthlyData.find(d => d.month_year === currentMonthKey);
  const currentMonthAmount = currentMonthData ? currentMonthData.amount : 0;
 // Current Month Amount :----------------------

  return (
    <CustomerDashboardLayoutNew title={t('customer_sidebar_dashboard')} subtitle={t('welcome_in_dashboard')}>
      <div className="space-y-8">

        <div className="bg-white p-4 rounded-md shadow-md ">
          <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">{t('customer_sidebar_dashboard')}</h1>
          <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">{t('welcome_in_dashboard')}</p>
        </div>


        { bookingsLoading 
          ?(
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">{t('customer_loading_data')}</p>
                </div>
              </div>
          )
          :(
            <>
              {/* ===== Top KPI row (mobile-first responsive) ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
                {/* Total Bookings  */}
                <KpiMiniCard
                  value={totalBookings.toString()}
                  label={t('customer_total_bookings')}
                  icon={<Calendar className="w-6 h-6 sm:w-7 sm:h-7" />}
                />

                {/*  Active Bookings */}
                <KpiMiniCard
                  value={activeBookings.toString()}
                  label={t('customer_active_booking')}
                  icon={<CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
                />

                {/* Active Bookings */}
                <KpiMiniCard
                  value={pendingBookings.toString()}
                  label={t('customer_pending_bookink')}
                  icon={<AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
                />

                {/* Total Spent*/}
                <KpiMiniCard
                  value={formatPrice(currentMonthAmount)}
                  label={t('monthly_budget')}
                  icon={<SaudiRiyalIcon />}
                />
              </div>

              {/* ===== Monthly Revenue Chart ===== */}
              <Card className="bg-white rounded-2xl shadow-sm border border-border ">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="text-right">
                      <p className="text-[16px] font-[600] text-primary text-start">{t('total_budget')}</p>
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-1'>
                          <p className="text-primary font-[600] text-[24px]">{totalAmount.toLocaleString()}</p>
                          {isRTL
                            ? (
                              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 14.6084C15.8943 15.4635 15.848 15.8345 15.4531 16.668L9.38965 17.9199C9.52903 17.0191 9.71461 16.324 10.0166 15.9072L16 14.6084ZM7.55469 8.71191L9.36621 8.31934V2.59375C10.0413 1.8359 10.4566 1.49559 11.2715 1.06543V7.90527L16 6.87891C15.8943 7.73376 15.8478 8.10429 15.4531 8.9375L11.2715 9.82129V11.7451L16 10.7441C15.8943 11.5992 15.848 11.9702 15.4531 12.8037L11.2715 13.667V13.6846L9.36621 14.0781V10.2236L7.55469 10.6064V13.0361L7.52344 13.042C7.10672 13.7727 6.51827 14.6506 5.95117 15.3516L0 16.4854C0.0533615 15.7196 0.164479 15.2879 0.510742 14.5166L5.64941 13.4023V11.0098L0.886719 12.0176C0.940076 11.2519 1.05224 10.821 1.39844 10.0498L5.64941 9.12598V1.52832C6.32454 0.770471 6.73977 0.430158 7.55469 0V8.71191Z" fill="#2E4166"/>
                              </svg>
                            ) 
                            : ( <span className='text-primary font-medium'>SR</span> )
                          }
                          
                        </div>
                        {/* {t('currency')}  */}
                        {/* <p className="text-[13px] text-[#516180]"> الشهر الماضي 45343  {t('saudi_riyal')}</p> */}
                        <p className="text-[13px] text-[#516180]">
                           {t('last_month')} {lastMonthAmount.toLocaleString()} {t('saudi_riyal')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bars (mobile responsive) */}
                  <div className="grid grid-cols-12 gap-1 sm:gap-3 items-end">
                    {monthlyData.map((d, i) => {
                      const h = Math.max(0, Math.round((d.amount / maxVal) * (window.innerWidth < 640 ? 80 : 140)));
                      return (
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <div className="relative w-[8px] sm:w-[14px] h-[90px] sm:h-[150px] rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="absolute bottom-0 left-0 right-0 rounded-t-full"
                              style={{ height: `${h}px`, backgroundColor: PRIMARY }}
                            />
                         
                          </div>
                          <span className="text-[6px] sm:text-[12px] text-primary ">{d.amount.toLocaleString()}</span>
                          <span className="text-[5px] sm:text-[12px] text-muted-foreground">{d.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {/* ===== Monthly Revenue Chart ===== */}


              {/* Table */}
              <div className="">
                <div className="overflow-x-auto bg-[#ffffff] mt-6 rounded-md shadow-md p-4">
                  <h1 className='text-primary text-[16px] font-[600] mb-6'>{t('latest_bookings')}</h1>
                  <table className="w-full"  dir={`${isRTL ? 'rtl' : 'ltr' }`}>
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('booking_number')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('property')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px] `}>{t('beds_count')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('start_date')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}> {t('end_date')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('amount')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('status')}</th>
                        <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('check_in_d')}</th>
                        {/* <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[80px]`}>{t('actions')}</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-gray-500">
                            {t('no_bookings')}
                          </td>
                        </tr>
                      ) : (
                        currentBookings.map((booking) => {
                          const now = new Date();
                          const isCurrentlyRunning = new Date(booking.start_date) <= now && new Date(booking.end_date) >= now;
                          const isAccepted = booking.status === 'approved' || booking.status === 'agent_assigned';
                          const isPending = booking.status === 'pending_bc_approval';
                          
                          return (
                            <tr 
                              key={booking.id} 
                              className={`border-b border-gray-100 hover:bg-gray-50  ${
                                isAccepted ? 'bg-green-50' : 
                                isPending ? 'bg-yellow-50' : ''
                              }`}
                            >
                            <td className="py-3 px-4 text-sm font-medium text-gray-900 " >#{booking.id}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 ">
                              { ` #${booking.residence_id}`}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{booking.bed_count}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 min-w-[140px]">{formatDate(booking.start_date)}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 min-w-[140px]">{formatDate(booking.end_date)}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                              {booking.total_price_with_commission !== null && booking.total_price_with_commission !== undefined
                              ? parseFloat(Number(booking.total_price_with_commission).toFixed(1))
                              : '-'} {t('currency')}
                            </td>
                            <td className="py-3 px-4 flex justify-normal min-w-[114px]">
                              {getStatusBadge(booking)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 min-w-[140px]">{formatDate(booking.start_date)}</td>
                            {/* <td className=''>
                              <button 
                                className="flex items-center justify-center gap-2 border border-[#2E41661A] text-primary text-[14px] font-[500] rounded-sm px-3 py-1 "
                                onClick={()=>{
                                  setShowContactHost(true)
                                }}  
                              >
                                  <span >{t('contact')}</span>
                                  <Mail className="w-4 h-4 "/>
                              </button>
                            </td> */}
                          </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Table */} 

              {/* ===== Quick Actions ===== */}
              <Card className="bg-white rounded-2xl shadow-sm border border-border hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">{t('ustomer_quick_actions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Hide "Add new booking" button on mobile */}
                    <Button 
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-primary"
                      onClick={() => navigate('/create-booking')}
                      // onClick={() => navigate('/customer-properties')}
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-sm">{t('customer_add_new_booking')}</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/customer-properties')}
                    >
                      <HomeLine className="w-6 h-6" />
                      <span className="text-sm">{t('customer_Properties_search')}</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/customer-bookings')}
                    >
                      <Calendar className="w-6 h-6" />
                      <span className="text-sm">{t('customer_show_all_bookings')}</span>
                    </Button>
                    
                    {/* Hide "Messages" button on mobile */}
                    {/* <Button 
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hidden sm:flex"
                      onClick={() => navigate('/messages-new')}
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-sm">{t('cutomer_messages')}</span>
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </>
          )
        }


        {/* Contact Host Dialog  */}
        <ContactHost
          showContactHost={showContactHost}
          setShowContactHost={setShowContactHost}
        />


      </div>
    </CustomerDashboardLayoutNew>
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

export default CustomerDashboardNew;
