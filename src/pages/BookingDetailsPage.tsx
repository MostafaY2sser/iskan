import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Home, 
  User, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Bed,
  Bath,
  ChefHat,
  CalendarDays,
  ArrowLeft,
  FileText,
  Users,
  ArrowRight,
  Banknote
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/api/api';
import { useTranslation } from 'react-i18next';

interface BookingDetails {
  id: number;
  customer_id: string;
  residence_id: number;
  bed_count: number;
  start_date: string;
  end_date: string;
  status: string;
  is_paid?: boolean;
  created_at: string;
  total_price_with_commission: number;
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
  // Additional fields
  residence?: {
    id: number;
    name: string;
    location: string;
    address: string;
    city: string;
    price_per_bed: number;
    bed_count: number;
    rooms_count: number;
    bathroom_count: number;
    kitchen_count: number;
    building_year: number;
    residence_type: string;
    description: string;
    cover_photo_url?: string;
    user_id?: string;
  };
  customer?: {
    company_name: string;
    responsible_person: string;
    first_phone_number: string;
    email?: string;
  };
}

const BookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approved' | 'rejected' | null>(null);
  const { t , i18n  } = useTranslation()
  const isRTL = i18n.language === 'ar';
  
  // Check if current user is the owner (you might need to get this from auth context)
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
    checkUserRole();
  }, [bookingId]);

  const checkUserRole = () => {
    // Check if the current user is the owner of the property
    const userType = localStorage.getItem('user_type');
    console.log('User type from localStorage:', userType); // Debug log
    
    // Check multiple possible values for property owner and admin
    const ownerTypes = ['owner', 'residence_company', 'property_owner', 'property-owner', 'admin'];
    const isPropertyOwner = ownerTypes.includes(userType?.toLowerCase() || '');
    
    setIsOwner(isPropertyOwner);
    console.log('Is owner:', isPropertyOwner, 'User type:', userType); // Debug log
  };

  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    try {
      setLoading(true);
      
      // Fetch booking details
      const bookingData = await api.get<BookingDetails>(`/bookings/${bookingId}`);
      
      // Fetch residence details
      try {
        const residenceData = await api.get<any>(`/residence/${bookingData.residence_id}`);
        bookingData.residence = residenceData;
      } catch (error) {
        console.error('Error fetching residence details:', error);
      }
      
      // Fetch customer details if owner or admin
      const userType = localStorage.getItem('user_type');
      const userId = localStorage.getItem('user_id');
      
      // Check if current user is the owner of this property's residence or admin
      const ownerTypes = ['owner', 'residence_company', 'property_owner', 'property-owner', 'admin'];
      if (ownerTypes.includes(userType?.toLowerCase() || '')) {
        try {
          // For admin, always set as owner; for others, check if residence belongs to them
          if (userType?.toLowerCase() === 'admin') {
            setIsOwner(true);
          } else if (bookingData.residence && bookingData.residence.user_id === userId) {
            setIsOwner(true);
          }
          
          // Try to fetch customer details (will only work if user is the owner or admin)
          const customerData = await api.get<any>(`/customers/${bookingData.customer_id}`);
          bookingData.customer = customerData;
        } catch (error) {
          console.error('Error fetching customer details:', error);
        }
      }
      
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error(t('failed_to_load_booking_details'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setPendingAction(status);
    setShowConfirmDialog(true);
  };

  const confirmStatusUpdate = async () => {
    if (!booking || !pendingAction) return;
    
    try {
      setProcessingStatus(true);
      
      await api.patch(`/bookings/${booking.id}/status`, { status: pendingAction });
      
      toast.success(
        pendingAction === 'approved' 
          ? t('booking_accepted_successfully')
          : t('booking_rejected')
      );
      
      // Refresh booking details
      await fetchBookingDetails();
      setShowConfirmDialog(false);
      setPendingAction(null);
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      if (error.status === 409) {
        toast.error(t('booking_date_conflict'));
      } else {
        toast.error(error.message || t('failed_to_update_booking_status'));
      }
    } finally {
      setProcessingStatus(false);
    }
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
    const days = [
      t('sunday'),
      t('monday'),
      t('tuesday'),
      t('wednesday'),
      t('thursday'),
      t('friday'),
      t('saturday'),
    ];
    const dayName = days[date.getDay()];
    return `${dayName} ${formatDate(dateString)}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (booking: BookingDetails) => {


      // حالة خاصة: approved + paid => نشط
      if (booking.status === 'approved' && booking.is_paid === true) {
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200 font-medium flex items-center gap-1 px-3 py-1"
          >
            <CheckCircle className="w-4 h-4" />
            {t('booking_status_active')}
          </Badge>
        );
      }

    const statusConfig: Record<string, { variant: any; className: string; text: string; icon: React.ReactNode }> = {
      'pending_bc_approval': { 
        variant: 'secondary' as const, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: t('booking_status_review'),
        icon: <Clock className="w-4 h-4" />
      },
      'agent_assigned': { 
        variant: 'default' as const, 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        text: t('agent_assigned'),
        icon: <Users className="w-4 h-4" />
      },
      'approved': { 
        variant: 'default' as const, 
        className: 'bg-green-100 text-green-800 border-green-200',
        text: t('booking_status_approved'),
        icon: <CheckCircle className="w-4 h-4" />
      },
      'rejected': { 
        variant: 'destructive' as const, 
        className: 'bg-red-100 text-red-800 border-red-200',
        text: t('status_rejected'),
        icon: <XCircle className="w-4 h-4" />
      }
    };
    
    const config = statusConfig[booking.status] || statusConfig['pending_bc_approval'];
    
    return (
      <Badge variant={config.variant} className={`${config.className} font-medium flex items-center gap-1 px-3 py-1`}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('booking_not_found')}</h2>
            <Button onClick={() => navigate(-1)} className="mt-4">
              العودة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 rounded-lg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              { isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" /> }
            </Button>
            <div>
              <h1 className="text-base sm:text-2xl font-bold text-gray-900"> {t('booking_details')} #{booking.id}</h1>
              <p className="text-sm text-gray-600 mt-1">
                  {t('booked_on')} {formatDate(booking.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3  statusBadge">
            {getStatusBadge(booking)}
          </div>
        </div>


        {/* Action Buttons for Owners - Prominent Position */}
        {isOwner && (
          booking.status === 'pending' || 
          booking.status?.toLowerCase() === 'pending' ||
          booking.status?.toLowerCase()?.includes('pending')
        ) && (
          <Card className="mb-6 border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-2xl gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                {t('required_actions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                {t('booking_pending_approval')}
              </p>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-[#2E4166] hover:bg-[#2E4166]/90 text-white"
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={processingStatus}
                >
                  <CheckCircle className="w-5 h-5 ml-2" />
                    {t('accept_booking')}
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={processingStatus}
                >
                  <XCircle className="w-5 h-5 ml-2" />
                 {t('accept_booking')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}



        <div className="print-area">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Information */}
              <Card className="print-section" >
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-2xl gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {t('booking_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('check_in_date')} </p>
                        <p className="font-semibold text-sm sm:text-base">{formatDateWithDay(booking.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('check_out_date')}</p>
                        <p className="font-semibold text-sm sm:text-base">{formatDateWithDay(booking.end_date)}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('stay_duration')}</p>
                        <p className="font-semibold">
                          {calculateDuration(booking.start_date, booking.end_date)} {t('nights')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('beds_count')}</p>
                        <p className="font-semibold">{booking.bed_count} {t('bed')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Information */}
              {booking.residence && (
                <Card className="print-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-2xl">
                      <Home className="w-5 h-5 text-primary" />
                        {t('property_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {booking.residence.cover_photo_url && (
                        <img 
                          src={booking.residence.cover_photo_url.replace(
                            'residence-uploads/residence-uploads',
                            'residence-uploads'
                          )}
                          loading="lazy"
                          alt={booking.residence.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{booking.residence.name}</h3>
                        <p className="text-sm text-gray-600">{booking.residence.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{booking.residence.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{booking.residence.residence_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{booking.residence.rooms_count} {t('rooms')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{booking.residence.bathroom_count} {t('bathrooms')}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('address')}</p>
                        <p className="font-medium">{booking.residence.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Information (for owners only) */}
              {isOwner && booking.customer && (
                <Card className="print-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-2xl">
                      <User className="w-5 h-5 text-primary" />
                        {t('client_information')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1"> {t('company_name')}</p>
                        <p className="font-semibold">{booking.customer.company_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t('responsible_person')} </p>
                        <p className="font-semibold">{booking.customer.responsible_person}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{booking.customer.first_phone_number}</span>
                      </div>
                      
                      {booking.customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{booking.customer.email}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="print-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-2xl">
                    <Banknote className="w-5 h-5 text-primary" />
                      {t('price_details')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600"> {t('beds_count')}</span>
                      <span className="font-medium">{booking.bed_count}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600"> {t('stay_duration')}</span>
                      <span className="font-medium">
                        {calculateDuration(booking.start_date, booking.end_date)} {t('nights')}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold"> {t('total')}</span>
                      <span className="text-xl font-bold text-primary">
                        {booking.total_price_with_commission.toLocaleString()} {t('currency')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Card */}
              {booking.services && booking.services.length > 0 && (
                <Card className="print-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-2xl">
                      <FileText className="w-5 h-5 text-primary" />
                      {t('requested_services')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {booking.services.map((service) => (
                        <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{service.name}</span>
                          <span className="font-medium text-sm">{service.price} {t('currency')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agent Card */}
              {booking.agent && (
                <Card className="print-section">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-2xl">
                      <Users className="w-5 h-5 text-primary" />
                        {t('assigned_agent')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">{booking.agent.name}</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{booking.agent.contact_info}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions Card */}
              <Card className='box_action'>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {!isOwner && booking.status === 'pending_bc_approval' && (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => {
                          // Handle booking cancellation
                          console.log('Cancel booking');
                        }}
                      >
                        {t('cancel_booking')}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full print:hidden"
                      onClick={() => {
                        document.body.classList.add('print-mode');
                        window.print();
                        setTimeout(() => {
                          document.body.classList.remove('print-mode');
                        }, 500);
                      }}
                    >
                     {t('print_details')}
                    </Button>


                  </div>
                </CardContent>
              </Card>
            </div>

            
          </div>
        </div>




      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'approved' ? t('confirm_accept_booking_title') :  t('confirm_reject_booking_title') }
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'approved' 
                ? t('confirm_accept_booking_message')
                : t('confirm_reject_booking_message')
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={processingStatus}
            >
              {t('cancel')}
            </Button>
            <Button
              className={pendingAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={confirmStatusUpdate}
              disabled={processingStatus}
            >
              {processingStatus ? t('processing') : t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      
    </div>
  );
};

export default BookingDetailsPage;
