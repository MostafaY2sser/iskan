import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { bookingsApi } from '@/api/endpoints/bookings';
import { servicesApi } from '@/api/endpoints/services';
import { matchServices, type AllService, type MatchedService } from '@/utils/serviceMatching';
import { toast } from 'sonner';
import { residencesApi } from '@/api/endpoints/residences';
import type { ResidencePublicResponse } from '@/api/types';
import { useTranslation } from 'react-i18next';

interface UpdateBookingProps {
  bookingId: number;
  residence_id: number;
  showUpdateBooking: boolean;
  setShowUpdateBooking: (open: boolean) => void;
  refetchBookings?: () => Promise<void>;
}

export const UpdateBooking: React.FC<UpdateBookingProps> = ({
    bookingId,
    residence_id,
    showUpdateBooking,
    setShowUpdateBooking,
    refetchBookings
}) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [bedCount, setBedCount] = useState<number>(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allServices, setAllServices] = useState<AllService[]>([]);
    const [matchedServices, setMatchedServices] = useState<MatchedService[]>([]);
    const [serviceIds, setServiceIds] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [residence, setResidence] = useState<ResidencePublicResponse | null>(null);
    const [residenceLoading, setResidenceLoading] = useState(false);
    const [bookedRanges, setBookedRanges] = useState<any[]>([]);
    const [availableBeds, setAvailableBeds] = useState<number | null>(null);
    const [bedsLoading, setBedsLoading] = useState(false);
    const { t } = useTranslation()

    

    // Select Day to be Disable :-----------------
    const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
        return result;
    };
    const today = new Date();
    const minStartDate = addDays(today, 7);
    // Select Day to be Disable :-----------------


    // Select End Data to be Select :--------------- 
    const isEndDateDisabled = (date: Date) => {
        if (!startDate) return true;

        const start = new Date(startDate);

        if (residence?.price_period === 'yearly') {
            const end = new Date(start);
            end.setFullYear(end.getFullYear() + 1);
            return date.getTime() !== end.getTime(); 
        }

        // Monthly
        if (date <= start) return true;

        return date.getDate() !== start.getDate();
    };

    // Select End Data to be Select :---------------

    //  handle Start Date Select in price_period === 'yearly'  -> to Booking full year :---------------
    const handleStartDateSelect = (d: Date) => {
        if (!d) return;
        const formatted = format(d, 'yyyy-MM-dd');
        setStartDate(formatted);

        if (residence?.price_period === 'yearly') {
            const end = new Date(d);
            end.setFullYear(end.getFullYear() + 1);
            setEndDate(format(end, 'yyyy-MM-dd'));
        } else {
            setEndDate('');
        }
    };
    
    
    // Blocked Date :--------------------
    useEffect(() => {
        if (!showUpdateBooking || !residence_id) return;

        const fetchAvailability = async () => {
            try {
            const res = await bookingsApi.getAvailability(residence_id);
            setBookedRanges(res);
            } catch (err) {
            console.error(err);
            }
        };

        fetchAvailability();
    }, [showUpdateBooking, residence_id]);
    
    // Disable Blocked Date :-
    const isDateBooked = (date: Date) => {
        return bookedRanges.some(range => {
            const start = new Date(range.start_date);
            const end = new Date(range.end_date);
            return date >= start && date <= end;
        });
    };
    // Blocked Date :--------------------


    //  Get Available Beds :-----------------------
    useEffect(() => {
        if (!startDate || !endDate) return;

        const fetchAvailableBeds = async () => {
            try {
            setBedsLoading(true);

            const res = await bookingsApi.getAvailableBeds(
                residence_id,
                startDate,
                endDate
            );

            setAvailableBeds(res.available_beds);

            if (bedCount > res.available_beds) {
                setBedCount(res.available_beds);
            }
            } catch (err) {
            toast.error(t('error_loading_available_beds'));
            } finally {
            setBedsLoading(false);
            }
        };

        fetchAvailableBeds();
    }, [startDate, endDate]);
    //  Get Available Beds :-----------------------


    // Get Residence Details :----------------
    useEffect(() => {
        if (!showUpdateBooking || !residence_id) return;

        const fetchResidence = async () => {
            try {
                setResidenceLoading(true);
                const res = await residencesApi.getResidenceById(residence_id);
                setResidence(res);
            } catch (error) {
                toast.error(t('failed_to_load_property_data'));
            } finally {
                setResidenceLoading(false);
            }
        };

        fetchResidence();
    }, [showUpdateBooking, residence_id]);
    // Get Residence Details :----------------


    // Load all services on open :----------------
    useEffect(() => {
        if (!showUpdateBooking || !residence) return;

        const fetchServices = async () => {
            try {
            setServicesLoading(true);
            const res = await servicesApi.getResidenceServices(residence_id);

            if (res?.results) {
                setAllServices(res.results);

                let matched: MatchedService[] = [];
                if (residence.services?.length > 0) {
                matched = matchServices(res.results, residence.services);
                } else {
                matched = res.results.map(s => ({
                    id: s.id,
                    service_id: s.id,
                    name: s.name,
                    extra_cost: s.extra_cost || 0
                }));
                }

                setMatchedServices(matched);
            }
            } catch {
            toast.error(t('error_loading_services'));
            } finally {
            setServicesLoading(false);
            }
        };

        fetchServices();
    }, [residence]);
    // Load all services on open :----------------

    
    // Handle service checkbox :----------------
    const handleServiceChange = (id: number, checked: boolean) => {
        if (checked) {
        setServiceIds(prev => [...prev, id]);
        } else {
        setServiceIds(prev => prev.filter(sid => sid !== id));
        }
    };
    // Handle service checkbox :----------------



    // Calculate total price :------------------
   useEffect(() => {
    if (
        bedCount > 0 &&
        startDate &&
        endDate &&
        residence &&
        matchedServices
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let total = 0;

        // Yearly Booking :-
        if (residence.price_period === 'yearly') {
        total = residence.price_with_commission * bedCount;

        // services :-
        if (serviceIds.length > 0) {
            const servicesTotal = serviceIds.reduce((sum, serviceId) => {
            const service = matchedServices.find(
                s => s.service_id === serviceId
            );
            return sum + (service?.extra_cost || 0);
            }, 0);

            total += servicesTotal;
        }
        }

        // Monthly Booking :-
        else {
        const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        if (months >= 1) {
            total = residence.price_with_commission * bedCount * months;

            if (serviceIds.length > 0) {
            const servicesTotal = serviceIds.reduce((sum, serviceId) => {
                const service = matchedServices.find(
                s => s.service_id === serviceId
                );
                return sum + (service?.extra_cost || 0) * months;
            }, 0);

            total += servicesTotal;
            }
        }
        }

        setTotalPrice(Math.round(total));
    }
    }, [ bedCount, startDate, endDate, serviceIds, residence, matchedServices ]);
    // Calculate total price :------------------


    //  Handle Update Booking :-----------------
    const handleUpdate = async () => {
        if (!startDate || !endDate) {
            setError(t('please_enter_dates'));
            return;
        }

        //  Handel the booking should be Monthly :-
        if (!isValidMonthlyBooking(startDate, endDate)) {
            setError(t('booking_must_be_monthly'));
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const data = {
            bed_count: bedCount,
            start_date: startDate,
            end_date: endDate,
            total_price_with_commission: totalPrice,
            service_ids: serviceIds,
            };

            console.log('UPDATE DATA', data);

            await bookingsApi.upDateBookingById(bookingId, data);

            toast.success(t('booking_updated_successfully'));
            setShowUpdateBooking(false);
             if (refetchBookings) await refetchBookings();
        } catch (err: any) {
            console.error(err?.response?.data || err);
            setError(t('booking_update_error'));
        } finally {
            setSubmitting(false);
        }
    };
    //  Handle Update Booking :-----------------


    // Handel Confilict :-------------------------
    const isValidMonthlyBooking = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);

        if (s.getDate() !== e.getDate()) return false;

        const months =
            (e.getFullYear() - s.getFullYear()) * 12 +
            (e.getMonth() - s.getMonth());

        return months >= 1;
    };
    // Handel Confilict :-------------------------



    useEffect(() => {
        if (!startDate || !endDate || bookedRanges.length === 0) return;

        const userStart = new Date(startDate);
        const userEnd = new Date(endDate);

        const hasConflict = bookedRanges.some(range => {
            const start = new Date(range.start_date);
            const end = new Date(range.end_date);
            return userStart <= end && userEnd >= start;
        });

        if (hasConflict) {
            toast.error(t('selected_dates_not_available'));
        }
    }, [startDate, endDate, bookedRanges]);


    // Reset data when dialog opens or close :--------------
    useEffect(() => {
        if (!showUpdateBooking) {
            setStartDate('');
            setEndDate('');
            setBedCount(1);
            setServiceIds([]);
            setTotalPrice(0);
            setError(null);
            setMatchedServices([]);
            setAvailableBeds(null);
        } 
    }, [showUpdateBooking]);
    // Reset data when dialog opens or close :--------------


  return (
    <Dialog open={showUpdateBooking} onOpenChange={setShowUpdateBooking}>

      <DialogContent className="max-w-xl p-4 space-y-4">

        <p className='text-sm sm:text-lg'>  {t('update_booking')} #{bookingId}</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-right">{error}</div>}

        {/* Start Date */}
        <div className="space-y-1">
          <Label>{t('start_date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {startDate || t('select_start_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    className='bg-white'
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => date < minStartDate || isDateBooked(date)}
                />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <Label>{t('end_date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {endDate || t('select_end_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                    mode="single"
                    className="bg-white"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(d) => {
                        if (!d) return;
                        setEndDate(format(d, 'yyyy-MM-dd'));
                    }}
                    disabled={isEndDateDisabled}
                />
            </PopoverContent>
          </Popover>
          {residence?.price_period === 'yearly' && startDate && (
    <p className="text-sm text-gray-500 mt-1">
      {t('yearly_booking_notice') || 'سيتم حجز العقار لمدة سنة كاملة بدءاً من تاريخ البداية.'}
    </p>
  )}
        </div>

        {/* Bed Count */}
        <div className="space-y-1">
            <Label> {t('bed_count')}</Label>
            <Input
                type="number"
                min={1}
                max={availableBeds || 1} 
                value={bedCount}
                onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                if (availableBeds && value > availableBeds) {
                    setBedCount(availableBeds);
                } else {
                    setBedCount(value);
                }
                }}
            />
            {availableBeds !== null && (
                <p className="text-sm text-gray-600">
                {t('property_bed_count')} : {availableBeds}
                </p>
            )}
        </div>


        {availableBeds !== null && (
            <p className="text-sm text-gray-600">
                {t('available_beds_in_period')}  : {availableBeds}
            </p> 
        )}


        {/* Services */}
        {servicesLoading ? (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin w-6 h-6  " />
            </div>
        ) : matchedServices.length > 0 ? (
            <div className="space-y-2 flex flex-col gap-2">
            <Label>{t('available_services')}</Label>
            <div className='flex items-center gap-4 flex-wrap'>
                {matchedServices.map(s => (
                <div key={s.id} className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={serviceIds.includes(s.service_id)}
                    onChange={e => handleServiceChange(s.service_id, e.target.checked)}
                    />
                    <span>{s.name}</span>
                    {s.extra_cost && <span className="text-primary bg-gray-200 rounded-full px-1 text-sm ">+{s.extra_cost}</span>}
                </div>
                ))}
            </div>
        </div>
        ) : null}



        {/* Total Price */}
        <div className="bg-blue-50 p-2 rounded text-sm">
            <span>{t('total')}: {totalPrice}</span>
        </div>



        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={()=>setShowUpdateBooking(false)} disabled={submitting}>إلغاء</Button>
          <Button onClick={handleUpdate} disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin w-4 h-4 ml-2" /> : t('update_booking')}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default UpdateBooking;
