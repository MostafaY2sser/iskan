import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar, 
  Home, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  User,
  MapPin,
  Plus,
  ArrowDownWideNarrow,
  ChevronsRight,
  ChevronsLeft,
  Mail,
  Edit,
  CreditCard,
  Banknote
} from 'lucide-react';
import { useCustomerBookings } from '@/hooks/useCustomerBookings';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { bookingsApi } from '@/api/endpoints/bookings';
import type { BookingResponse } from '@/api/types';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';
import ContactHost from '@/components/dashboard/ContactHost';
import UpdateBooking from '@/components/UpdateBooking';
import Pagination from '@/components/Pagination';

const CustomerBookingsPage: React.FC = () => {
  const { t , i18n  } = useTranslation();
  const navigate = useNavigate();
  const { bookings, loading, error, refetch } = useCustomerBookings();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);
  const isRTL = i18n.language === 'ar';
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 
  const [ showContactHost , setShowContactHost ] = useState(false)
  const [updateBookingId, setUpdateBookingId] = useState<number | null>(null);
  const [updateResidenceId, setUpdateResidenceId] = useState<number | null>(null);
  const [ showUpdateBooking , setShowUpdateBooking ] = useState(false)


  // Handle cancel booking
  const handleCancelBooking = (booking: BookingResponse) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };


  // Confirm cancel booking
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      setCancellingBookingId(bookingToCancel.id);
      await bookingsApi.deleteBooking(bookingToCancel.id);
      toast.success(t('booking_cancelled_successfully'));
      setShowCancelDialog(false);
      setBookingToCancel(null);
      refetch(); // Refresh the bookings list
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || t('booking_cancel_error'));
    } finally {
      setCancellingBookingId(null);
    }
  };


  // Sort bookings by creation date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sortOrder === 'newest'
      ? dateB - dateA   
      : dateA - dateB; 
  });


  // Filter bookings Cart by status to Show in the list :-------
  const filteredBookings = (() => {
    if (selectedStatus === 'all') {
      return sortedBookings;
    }

    if (selectedStatus === 'active') {
      return sortedBookings.filter(
        booking => booking.is_paid === true 
      );
    }

    if (selectedStatus === 'pending_bc_approval') {
      return sortedBookings.filter(
        booking =>
          booking.status === 'pending' ||
          booking.status?.toLowerCase()?.includes('pending')||
          (booking.status === 'approved' && booking.admin_status === "pending")
      );
    }

    if (selectedStatus === 'approved') {
      return sortedBookings.filter(
        booking =>
          booking.status === 'approved' &&
          booking.admin_status === "approved" &&
          booking.is_paid === false
      );
    }

    if (selectedStatus === 'rejected') {
      return sortedBookings.filter(
        booking => booking.status === 'rejected' || booking.admin_status === "rejected"
      );
    }

    return sortedBookings;
  })();
  

  // Calculate statistics
  const totalBookings = bookings.length;
  
  const now = new Date();

  // Active bookings: IS Paid :------
  const activeBookings = bookings.filter(b => {
      const isApproved = b.is_paid ===  true ;
      return isApproved ;
    }).length;
  

  // bookings Length in Tap  :------
  const pendingBookings = bookings.filter(b => 
    b.status === 'pending' || 
    (b.status === 'approved' && b.admin_status === "pending")
  ).length;


  // Rejected bookings Length in Tap  :------
  const rejectedBookings = bookings.filter(b => b.status === 'rejected' || b.admin_status === "rejected").length;


  // Badge for booking status :------ 
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
      text = t('admin_rejected_booking');
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="w-4 h-4" />;
    } else if ( booking.status === 'approved'  ){
      text = t('awaiting_approval');
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



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    const days = [ t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName} ${day}/${month}/${year}`;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ${t('currency')}`;
  };


  // Status Filter Options with counts :------
  const getStatusFilterOptions = () => {
    const now = new Date();
    const activeBookingsCount = bookings.filter(
      b => b.is_paid === true
    ).length;

    return [
      { value: 'all', label: t('all_booking') , count: totalBookings },
      { value: 'active', label: t('active_booking'), count: activeBookingsCount },
      { value: 'pending_bc_approval', label: t('booking_status_review'), count: pendingBookings },
      { value: 'approved', label: t('approved_booking'), 
          count: bookings.filter( b => b.status === 'approved' && b.admin_status === "approved" && b.is_paid === false ).length },
      { value: 'rejected', label: t('rejected_booking'), count: rejectedBookings },
    ];

  };


  // Pagination calculations :----
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentResidences = filteredBookings.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
  // Pagination calculations :----

  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold">{t('error_loading_bookings')}</h2>
              <p className="text-gray-600 mt-2">{error}</p>
              <Button onClick={refetch} className="mt-4">
                {t('retry')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white rounded-md shadow-md p-2 md:p-4">
      <div className="">
        {/* Header */}
        <div className="flex justify-between sm:items-center mb-4 flex-col sm:flex-row sm:mb-8 ">
          <div className="mb-fluid-lg sm:mb-fluid-xl">
            <h1 className="text-xl sm:text-3xl font-bold mb-2">{t('booking_page_title')}</h1>
            <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">{t('booking_page_subtitle')}</p>
          </div>
          <Button onClick={() => navigate('/customer-properties')} className="flex items-cente text-base gap-2 text-[#DDD4BA]">
            <Plus className="w-4 h-4 hidden sm:block" />
            {t('customer_add_new_booking')}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className='border-none shadow-md'>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('customer_total_bookings')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-md'>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('customer_active_booking')}</p>
                  <p className="text-2xl font-bold text-green-600">{activeBookings}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-md'>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('customer_pending_bookink')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-md'>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('customer_rejected_booking')}</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedBookings}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm sm:p-6 p-2  mb-8 ">
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
            <h3 className="sm:text-xl font-semibold text-primary">{t('booking_filter')}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={sortOrder === 'newest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('newest')}
                className="flex items-center gap-1 text-xs sm:text-base"
              >
                <ArrowDownWideNarrow className="w-4 h-4 hidden sm:block" />
                {t('newest')}
              </Button>

              <Button
                variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('oldest')}
                className="flex items-center gap-1 text-xs sm:text-base"
              >
                <ArrowDownWideNarrow className="w-4 h-4 hidden sm:block" />
                {t('oldest')}
              </Button>
            </div>

          </div>
          {/* <div className="flex flex-wrap gap-2 mt-8"> */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:flex sm:flex-wrap mt-8">
            {getStatusFilterOptions().map((option) => (
              <Button
                key={option.value}
                variant={selectedStatus === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(option.value)}
                className="flex items-center gap-2 text-xs sm:text-base"
              >
                {option.label}
                <Badge variant="secondary" className="ml-1">
                  {option.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        { loading 
          ?(
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
          :(
            <>
              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedStatus === 'all' ? t('no_bookings') : t('no_bookings_with_status')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedStatus === 'all' 
                      ? t('start_new_booking')
                      : t('try_change_status_filter')
                    }
                  </p>
                  {selectedStatus === 'all' && (
                    <Button onClick={() => navigate('/customer-properties')}>
                      {t('add_new_booking')}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentResidences.map((booking) => {
                    const now = new Date();
                    const isCurrentlyRunning = new Date(booking.start_date) <= now && new Date(booking.end_date) >= now;
                    const isActive = (booking.status === 'approved' || booking.status === 'agent_assigned') || isCurrentlyRunning;
                    const isAccepted = booking.status === 'approved' || booking.status === 'agent_assigned' ;
                    const isRejected = booking.status === 'rejected' ||  booking.admin_status === "rejected" ;
                    // const admon_rejected = booking.admin_status === "rejected" ;
                    const admin_approved = booking.admin_status === "approved" && booking.status === 'approved';
                    const isPending = booking.status === 'pending';
                    
                    return (
                      <Card 
                        key={booking.id} 
                        className={`hover:shadow-lg transition-shadow duration-200 ${
                          admin_approved ? 'bg-green-50' : 
                          isRejected ? 'bg-red-50' : 
                          isAccepted ? 'bg-yellow-50' : 
                          isPending ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <CardContent className="sm:p-6 p-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between sm:gap-4 relative">
                          {/* Booking Info */}
                          <div className="flex-1 ">
                            <div className="flex items-start justify-between mb-3 ">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                  {t('ustomer_booking')} #{booking.id}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                  <Calendar className="w-4 h-4 ml-1" />
                                  <span className="text-xs sm:text-sm">
                                    {t('from')} {formatDateWithDay(booking.start_date)} {t('to')} {formatDateWithDay(booking.end_date)}
                                  </span>
                                </div>
                              </div>
                              <div className={`absolute top-0 ${ isRTL ? 'left-0' : 'right-0' } `}>
                                {getStatusBadge(booking)}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Home className="w-4 h-4 ml-2" />
                                <span className="text-xs sm:text-sm">{t('property')}: #{booking.residence_id}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 ml-2" />
                                <span className="text-xs sm:text-sm">{booking.bed_count} {t('bed')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Banknote    className="w-4 h-4 ml-2" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {formatPrice(booking.total_price_with_commission)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 ml-2" />
                                <span className="text-xs sm:text-sm">
                                {t('booking_date')}
                                  {formatDate(booking.created_at)}
                                </span>
                              </div>
                            </div>

                            {/* Services */}
                            {(booking as any).services && (booking as any).services.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                {t('requested_services')}
                                  </p>
                                <div className="flex flex-wrap gap-1">
                                  {(booking as any).services.map((service: any, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {service.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Agent Info */}
                            {booking.agent && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                  {t('assigned_agent')}
                                  </p>
                                <p className="text-sm text-blue-700">{booking.agent.name}</p>
                                <p className="text-xs text-blue-600">{booking.agent.contact_info}</p>
                              </div>
                            )}
                            
                            {/* Message:  If Owner Approved Booking */}
                            { booking.status === "approved" && booking.admin_status === "pending" && (
                              <p className='mt-4 text-sm sm:text-base'><p>{t('owner_approved_booking')}</p></p>
                            ) }

                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 lg:w-48 mt-4 sm:mt-8">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/booking/${booking.id}`)}
                            >
                              {t('view_details')}
                            </Button>
                            {(booking.status === 'pending' || 
                              booking.status?.toLowerCase() === 'pending' ||
                              booking.status?.toLowerCase()?.includes('pending')) && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancelBooking(booking)}
                                disabled={cancellingBookingId === booking.id}
                              >
                                {cancellingBookingId === booking.id ? t('canceling_bookingcanceling_booking') : t('cancel_booking')}
                              </Button>
                            )}
                            {/* <Button 
                              variant='outline' 
                              className="flex items-center justify-center gap-2 border border-[#2E41661A] text-[#2E4166] text-[14px] font-[500] rounded-sm px-3 py-1 "
                              onClick={()=>{
                                setShowContactHost(true)
                              }}
                            >
                                <span >{t('contact')}</span>
                                <Mail className="w-4 h-4 "/>
                            </Button> */}

                            {(booking.status === 'pending' || 
                              booking.status?.toLowerCase() === 'pending' ||
                              booking.status?.toLowerCase()?.includes('pending')) && (
                              <Button 
                                variant='outline' 
                                className="flex items-center justify-center gap-2 border border-[#2E41661A] text-[#2E4166] text-[14px] font-[500] rounded-sm px-3 py-1 "
                                onClick={()=>{
                                  setUpdateBookingId(booking.id);
                                  setUpdateResidenceId(booking.residence_id);
                                  setShowUpdateBooking(true);
                                }}
                            > 
                                <span > {t('edit_booking')}</span>
                                <Edit className="w-4 h-4 "/>
                            </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination :----------- */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
              {/* Pagination :----------- */}
            </>
          )
        }

      </div>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader className='items-center'>
            <DialogTitle>{t('cancel_booking_confirmation_title')}</DialogTitle>
            <DialogDescription>
              {t('cancel_booking_confirmation_description')}
            </DialogDescription>
          </DialogHeader>
          {bookingToCancel && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{t('booking_details')}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><strong> {t('booking_number')}:</strong> #{bookingToCancel.id}</p>
                  <p><strong> {t('start_date')}:</strong> {new Date(bookingToCancel.start_date).toLocaleDateString('ar-SA')}</p>
                  <p><strong> {t('end_date')}:</strong> {new Date(bookingToCancel.end_date).toLocaleDateString('ar-SA')}</p>
                  <p><strong> {t('total_price')}:</strong> {bookingToCancel.total_price_with_commission.toLocaleString()} {t('currency')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center  gap-3 ">
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
              disabled={cancellingBookingId !== null}
              className='w-full'
            >
              {t('cancel')}
            </Button>

            <Button 
              variant="destructive" 
              onClick={confirmCancelBooking}
              disabled={cancellingBookingId !== null}
              className='w-full'
            >
              {cancellingBookingId !== null ? t('canceling_booking') : t('confirm_cancellation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Contact Host Dialog  */}
      <ContactHost
        showContactHost={showContactHost}
        setShowContactHost={setShowContactHost}
      />

      <UpdateBooking
        bookingId={updateBookingId!}        
        // residence_id={updateResidenceId!} 
        residence_id={updateResidenceId!} 
        showUpdateBooking={showUpdateBooking}
        setShowUpdateBooking={setShowUpdateBooking}
        refetchBookings={refetch}
      />


    </div>
  );
};

export default CustomerBookingsPage;