import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, CheckCircle, XCircle, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar, tr } from 'date-fns/locale';
import { api } from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import ContactAmbassador from '@/components/dashboard/ContactAmbassador';
import Pagination from '@/components/Pagination';

interface Booking {
  id: number;
  customer_id: string;
  residence_id: number;
  bed_count: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  total_price_with_commission: number;
  admin_status: string;
  is_paid: boolean;
  services: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  agent?: {
    id: number;
    name: string;
    contact_info: string;
  };
}

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ bookingId: number; status: 'approved' | 'rejected' } | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [ showContactAmbassador , setShowContactAmbassador ] = useState(false)
  const [rejectReason, setRejectReason] = useState('');
  // Check if user is owner/admin
  const userType = localStorage.getItem('user_type');
  const userRole = user?.role || userType;
  const { t , i18n  } = useTranslation()
  const isRTL = i18n.language === 'ar';


  // Fetch bookings for the owner
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.get<Booking[]>('/bookings/by/user');
      setBookings(data);
    } catch {
      toast.error(t('failed_to_load_bookings'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);



  // Handle status update with confirmation
  const handleStatusUpdate = (bookingId: number, status: 'approved' | 'rejected') => {
    setPendingAction({ bookingId, status });
    setShowConfirmDialog(true);
  };

  // Update booking status (approve/reject)
  const updateBookingStatus = async () => {
    if (!pendingAction) return;

    if (
      pendingAction.status === 'rejected' &&
      !rejectReason.trim()
    ) {
      toast.error(t('reject_reason_required'));
      return;
    }
    
    try {
      setProcessingId(pendingAction.bookingId);
      setShowConfirmDialog(false);
      
      // await api.patch(`/bookings/${pendingAction.bookingId}/status`, { status: pendingAction.status });
      await api.patch(`/bookings/${pendingAction.bookingId}/status`, {
        status: pendingAction.status,
        ...(pendingAction.status === 'rejected' && {
          reason: rejectReason
        }),
      });

      toast.success(
        pendingAction.status === 'approved' 
          ? t('booking_accepted_successfully') 
          : t('booking_rejected')
      );
      
      // Refresh bookings
      await fetchBookings();
      setShowDetailsModal(false);
      setPendingAction(null);
      setRejectReason('');
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      if (error.status === 409) {
        toast.error(t('booking_date_conflict'));
      } else {
        toast.error(error.message || t('failed_to_update_booking_status'));
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Get status badge component
  const getStatusBadge = (booking: Booking) => {

  if (booking.is_paid) {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 border-green-200 font-normal text-xs"
      >
        {t('active')}
      </Badge>
    );
  }

  if (booking.admin_status === 'approved') {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 border-green-200 font-normal text-xs"
      >
        {t('admin_approved')}
      </Badge>
    );
  }
  if (booking.admin_status === 'rejected') {
    return (
      <Badge
        variant="default"
        className="bg-red-100 text-red-800 border-red-200 font-normal text-xs"
      >
       {t('admin_rejected_message')}
      </Badge>
    );
  }

  const statusConfig: Record<string, { variant: any; className: string; text: string }> = {
    pending_bc_approval: {
      variant: 'secondary',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 font-normal text-xs',
      text: t('status_pending'),
    },
    agent_assigned: {
      variant: 'default',
      className: 'bg-blue-100 text-blue-800 border-blue-200 font-normal text-xs',
      text: t('agent_assigned'),
    },
    approved: {
      variant: 'default',
      className: 'bg-green-100 text-green-800 border-green-200 font-normal text-xs',
      text: t('approved'),
    },
    rejected: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 border-red-200 font-normal text-xs',
      text: t('rejected'),
    },
  };

  const config = statusConfig[booking.status] || statusConfig.pending_bc_approval;

  return (
    <Badge variant={config.variant} className={`${config.className} font-normal text-xs`}>
      {config.text}
    </Badge>
  );
};


type BookingFilterStatus = 'all'| 'pending'| 'approved' | 'rejected' | 'active'| 'admin_approved' | 'paid'  | 'admin_rejected';;


const getBookingFilterStatus = (booking: Booking): BookingFilterStatus => {
  if (booking.is_paid) return 'active';
  if (booking.admin_status === 'approved') return 'admin_approved';
  if (booking.admin_status === 'rejected') return 'admin_rejected';

  switch (booking.status) {
    case 'pending':
      return 'pending';

    case 'approved':
    case 'agent_assigned':
      return 'approved';

    case 'rejected':
      return 'rejected';

    default:
      return 'pending';
  }
};


// Filter bookings based on status and search
 const filteredBookings = bookings
  .filter((booking) => {
    const bookingFilterStatus = getBookingFilterStatus(booking);

    const matchesStatus =
      statusFilter === 'all' || bookingFilterStatus === statusFilter;

    const matchesSearch =
      searchQuery === '' ||
      booking.id.toString().includes(searchQuery) ||
      booking.residence_id.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  })
  .sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return dateSort === 'newest'
      ? dateB - dateA
      : dateA - dateB;
  });



  // Format date in Arabic
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch {
      return dateString;
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);


  return (
    <div className="space-y-6">

      {/* Page Header */}
       <div className="bg-[#ffffff] p-4 rounded-md shadow-md">
          <h1 className="responsive-heading text-[24px] font-[700] mb-2">{t('bookings')}</h1>
          <p className="text-[#828690] text-[14px] font-[400]"> {t('manage_all_bookings_requests')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('total_bookings')}</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('status_pending')}</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('approved')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('rejected')}</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'rejected' || b.admin_status  === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 right-3" />
              <Input
                placeholder={t('search_bookings')}
                className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_status')}</SelectItem>
                <SelectItem value="pending">{t('booking_status_review')}</SelectItem>
                <SelectItem value="approved">{t('booking_status_approved')}</SelectItem>
                <SelectItem value="rejected">{t('customer_rejected_booking')}</SelectItem>
                <SelectItem value="active">{t('booking_status_active')}</SelectItem>
                <SelectItem value="admin_approved">{t('admin_approved')}</SelectItem>
                <SelectItem value="admin_rejected">{t('admin_rejected_tow')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateSort} onValueChange={(v) => setDateSort(v as 'newest' | 'oldest')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('sort_by_date')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('newest')}</SelectItem>
              <SelectItem value="oldest">{t('oldest')}</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('bookings_list')}</h3>
        </div>
        

        { loading 
          ?(
            <div className="flex items-center flex-col gap-4 mt-32 mb-32 ">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('loading_bookings')}</p>
            </div>
          )
          :(
            <div className='pb-6 '>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 `}>{t('booking_number')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 `}>{t('property')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600  `}>{t('beds_count')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 `}>{t('start_date')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 `}> {t('end_date')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[100px]`}>{t('amount')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[139px]`}>{t('status')}</th>
                      <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 min-w-[100px]`}>{t('actions')}</th>
                      {/* <th className={` ${isRTL ? 'text-right' : 'text-left'} py-3 px-2 text-sm font-medium text-gray-600 `}>{t('contact')}</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
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
                            className={`border-b border-gray-100 hover:bg-gray-50 ${
                              isAccepted ? 'bg-green-50' : 
                              isPending ? 'bg-yellow-50' : ''
                            }`}
                          >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 ">
                            { ` ${booking.residence_id}`}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{booking.bed_count}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 min-w-[140px]">{formatDate(booking.start_date)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 min-w-[140px]">{formatDate(booking.end_date)}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {booking.total_price_with_commission.toLocaleString()} {t('currency')}
                          </td>
                          <td className="py-3 px-4 min-w-[114px]">
                            {getStatusBadge(booking)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-2"
                                onClick={() => {
                                  console.log('Selected booking:', booking);
                                  console.log('Booking status:', booking.status);
                                  console.log('Status check results:', {
                                    'pending_bc_approval': booking.status === 'pending_bc_approval',
                                    'pending': booking.status === 'pending',
                                  });
                                  setSelectedBooking(booking);
                                  setShowDetailsModal(true);
                                }}
                                title="عرض التفاصيل"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-2"
                                onClick={() => navigate(`/booking/${booking.id}`)}
                                title="عرض الصفحة الكاملة"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              {(
                                booking.status === 'pending_bc_approval' || 
                                booking.status === 'pending' || 
                                booking.status?.toLowerCase() === 'pending' ||
                                booking.status?.toLowerCase()?.includes('pending')
                              ) && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-[#2E4166] hover:bg-[#2E4166]/90 text-white px-3 py-1"
                                    onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                    disabled={processingId === booking.id}
                                    title="قبول الحجز"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="mr-1 hidden lg:inline">{t('accept')}</span>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                    disabled={processingId === booking.id}
                                    title="رفض الحجز"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span className="mr-1 hidden lg:inline">{t('reject')}</span>
                                  </Button>
                                </>
                              )}
                              {booking.admin_status === 'approved' && !booking.is_paid && (
                                <p>{t('pending_payment')}</p>
                              )}
                            </div>
                          </td>
                          {/* <td>
                            <button 
                              onClick={() => {
                                setShowContactAmbassador(true);
                              }}
                              className="flex items-center justify-center gap-2 border hover:bg-gray-200 border-[#2E41661A] text-[#2E4166] text-[14px] font-[500] rounded-sm px-3 py-2 ">
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
              {/* Table */}

              {/* Pagination :----------- */}
              {totalPages > 1 && (
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                />
              )}
              {/* Pagination :----------- */}
            </div>
          )
        }

      </div>

      {/* Booking Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className=''>
            <DialogTitle> {t('booking_details')} #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>
             {t('booking_details')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('status')}:</span>
                {getStatusBadge(selectedBooking)}
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('property')}</p>
                  <p className="font-medium">
                    {selectedBooking.residence_name || `${t('Property')} #${selectedBooking.residence_id}`}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1"> {t('beds_count')}</p>
                  <p className="font-medium">{selectedBooking.bed_count}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('start_date')}</p>
                  <p className="font-medium">{formatDate(selectedBooking.start_date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('end_date')}</p>
                  <p className="font-medium">{formatDate(selectedBooking.end_date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('total_amount')}</p>
                  <p className="font-medium text-lg text-primary">
                    {selectedBooking.total_price_with_commission.toLocaleString()}{t('currency')} {t('currency')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('booking_date')}</p>
                  <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                </div>
              </div>

              {/* Services if any */}
              {selectedBooking.services && selectedBooking.services.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2"> {t('requested_services')}</p>
                  <div className="space-y-2">
                    {selectedBooking.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{service.name}</span>
                        <span className="font-medium">{service.price}{t('currency')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent info if assigned */}
              {selectedBooking.agent && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('assigned_agent')}</p>
                  <div className="space-y-1">
                    <p className="font-medium">{selectedBooking.agent.name}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.agent.contact_info}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className='flex items-center gap-2 mt-4'>
            {selectedBooking && (
              selectedBooking.status === 'pending_bc_approval' || 
              selectedBooking.status === 'pending' || 
              selectedBooking.status === 'قيد المراجعة' ||
              selectedBooking.status?.toLowerCase() === 'pending' ||
              selectedBooking.status?.toLowerCase() === 'pending_bc_approval' ||
              selectedBooking.status?.toLowerCase()?.includes('pending')
            ) && (
              <div className='flex items-center gap-2'>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}
                  disabled={processingId === selectedBooking.id}
                >
                  <XCircle className="w-4 h-4 ml-2" />
                  {t('reject_booking')}
                </Button>
                <Button
                  className="bg-[#2E4166] hover:bg-[#2E4166]/90 text-white"
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'approved')}
                  disabled={processingId === selectedBooking.id}
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                 {t('accept_booking')}
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Status Update */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className='flex items-center justify-center flex-col'>
          <DialogHeader>
            <DialogTitle className='text-center'>
              {pendingAction?.status === 'approved' ? t('confirm_accept_booking_title') : t('confirm_reject_booking_title')}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.status === 'approved' 
                ? t('confirm_accept_booking_message')
                : t('confirm_reject_booking_message')
              }
            </DialogDescription>
          </DialogHeader>
          {pendingAction?.status === 'rejected' && (
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                  سبب الرفض
              </label>
              <Textarea
                placeholder="إدخل سبب الرفض"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}
          <DialogFooter className='flex items-center gap-2 flex-row'>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setPendingAction(null);
                setRejectReason('');
              }}
              disabled={processingId !== null}
            >
              {t('cancel')}
            </Button>
            <Button
              className={pendingAction?.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={updateBookingStatus}
              disabled={processingId !== null}
            >
              {processingId !== null ? t('processing') : t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/*  Show Contact Ambassador */}
      <ContactAmbassador
        showContactAmbassador={showContactAmbassador}
        setShowContactAmbassador={setShowContactAmbassador}
      />
      


    </div>
  );
};

export default BookingsPage;