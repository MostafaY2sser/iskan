import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { bookingsApi } from '@/api/endpoints/bookings';
import { servicesApi } from '@/api/endpoints/services';
import type { BookingCreate, ResidencePublicResponse } from '@/api/types';
import { matchServices, type AllService, type MatchedService } from '@/utils/serviceMatching';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/api';

interface BookingDialogProps {
  residence: ResidencePublicResponse;
  trigger?: React.ReactNode;
  onBookingCreated?: (bookingId: number) => void;
}


export const BookingDialog: React.FC<BookingDialogProps> = ({
  residence,
  trigger,
  onBookingCreated,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BookingCreate>({
    residence_id: residence.id,
    bed_count: 1,
    start_date: '',
    end_date: '',
    total_price_with_commission: residence.price_with_commission,
    service_ids: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<AllService[]>([]);
  const [matchedServices, setMatchedServices] = useState<MatchedService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [availableBeds, setAvailableBeds] = useState<number | null>(null);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [bookedRanges, setBookedRanges] = useState<
    { start_date: string; end_date: string }[]
  >([]);

  // Selete Start Date:-----
  const MIN_BOOKING_DAYS = 6;
  const minBookingDate = new Date();
  minBookingDate.setDate(minBookingDate.getDate() + MIN_BOOKING_DAYS);


  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        residence_id: residence.id,
        bed_count: 1,
        start_date: '',
        end_date: '',
        total_price_with_commission: residence.price_with_commission,
        service_ids: [],
      });
      setError(null);
    }
  }, [open, residence.id, residence.price_with_commission]);


  // Fetch all services and match with residence services when dialog opens
  useEffect(() => {
    const fetchAndMatchServices = async () => {
      if (!open || !residence.services || residence.services.length === 0) {
        setMatchedServices([]);
        return;
      }

      try {
        setServicesLoading(true);
        
        // Fetch all services
        const allServicesResponse = await servicesApi.getAllServices();
        console.log('All services:', allServicesResponse);
        
        if (allServicesResponse && allServicesResponse.results) {
          setAllServices(allServicesResponse.results);
          
          // Match residence services with all services
          const matched = matchServices(allServicesResponse.results, residence.services);
          console.log('Matched services:', matched);
          setMatchedServices(matched);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error(t('error_loading_services'));
      } finally {
        setServicesLoading(false);
      }
    };

    fetchAndMatchServices();
  }, [open, residence.services]);


  // Calculate total price when bed count or services change
  // useEffect(() => {
  //   if (
  //     formData.bed_count > 0 &&
  //     formData.start_date &&
  //     formData.end_date
  //   ) {
  //     const startDate = new Date(formData.start_date);
  //     const endDate = new Date(formData.end_date);

  //     // Calculate total Month :-
  //     const months =
  //       (endDate.getFullYear() - startDate.getFullYear()) * 12 +
  //       (endDate.getMonth() - startDate.getMonth());

  //     if (months >= 1) {
  //       let totalPrice =
  //         residence.price_with_commission *
  //         formData.bed_count *
  //         months;

  //       // Calculate Service Price :-
  //       if (matchedServices && formData.service_ids.length > 0) {
  //         const serviceCosts = formData.service_ids.reduce(
  //           (total, serviceId) => {
  //             const service = matchedServices.find(
  //               s => s.service_id === serviceId
  //             );
  //             return total + (service?.extra_cost || 0) * months;
  //           },
  //           0
  //         );

  //         totalPrice += serviceCosts;
  //       }

  //       setFormData(prev => ({
  //         ...prev,
  //         total_price_with_commission: Math.round(totalPrice),
  //       }));
  //     }
  //   }
  // }, [
  //   formData.bed_count,
  //   formData.start_date,
  //   formData.end_date,
  //   formData.service_ids,
  //   residence.price_with_commission,
  //   matchedServices,
  // ]);

  useEffect(() => {
  if (formData.bed_count > 0 && formData.start_date && formData.end_date) {
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    let multiplier = 1;

    if (residence.price_period === 'monthly') {
      multiplier =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
    } else if (residence.price_period === 'yearly') {
      multiplier = endDate.getFullYear() - startDate.getFullYear();
    }

    if (multiplier < 1) multiplier = 1;

    let totalPrice = residence.price_with_commission * formData.bed_count * multiplier;

    if (matchedServices && formData.service_ids.length > 0) {
      const serviceCosts = formData.service_ids.reduce((total, serviceId) => {
        const service = matchedServices.find(s => s.service_id === serviceId);
        return total + ((service?.extra_cost || 0) * multiplier);
      }, 0);

      totalPrice += serviceCosts;
    }

    setFormData(prev => ({
      ...prev,
      total_price_with_commission: Math.round(totalPrice),
    }));
  }
}, [formData.bed_count, formData.start_date, formData.end_date, formData.service_ids, residence.price_with_commission, matchedServices]);




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date) {
      setError(t('fill_required_fields'));
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError(t('start_date_before_end_date'));
      return;
    }

    if (!isValidMonthlyBooking(formData.start_date, formData.end_date)) {
      setError(t('monthly_booking_required'));
      return;
    }

    if ( !formData.bed_count || formData.bed_count < 1 ){
      toast.error(('عدد الأسرّة يجب أن يكون 1 على الأقل'))
    }

    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Submitting booking data:', formData);
      console.log('Service IDs being sent:', formData.service_ids);
      
      const booking = await bookingsApi.createBooking(formData);
      
      toast.success(t('booking_success'));
      
      if (onBookingCreated) {
        onBookingCreated(booking.id);
      }
      
      setOpen(false);
    } 
    catch (err: any) {
      const detailMessage =
        err?.response?.detail || 
        err?.data?.detail ||     
        err?.message ||         
        t('booking_error');

      setError(detailMessage);
    } 
    finally {
      setSubmitting(false);
    }
  };


  const handleServiceChange = (serviceId: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        service_ids: [...prev.service_ids, serviceId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        service_ids: prev.service_ids.filter(id => id !== serviceId)
      }));
    }
  };


  // Available Dates :-------------------------------
    useEffect(() => {
      if (!open) return;

      const fetchAvailability = async () => {
        try {
          const res = await bookingsApi.getAvailability(residence.id);
          setBookedRanges(res);
        } catch (err) {
          console.error(err);
        }
      };

    fetchAvailability();
    }, [open, residence.id]);

    const isDateBooked = (date: Date) => {
      return bookedRanges.some(range => {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        return date >= start && date <= end;
      });
    };

    

    // const hasConflict = bookedRanges.some(range => {
    //   const start = new Date(range.start_date);
    //   const end = new Date(range.end_date);

    //   const userStart = new Date(formData.start_date);
    //   const userEnd = new Date(formData.end_date);

    //   return userStart <= end && userEnd >= start;
    // });

    // if (hasConflict) {
    //   toast.error(t('selected_dates_unavailable'));
    //   return;
    // }
    useEffect(() => {
      if (!formData.start_date || !formData.end_date) return;
      if (bookedRanges.length === 0) return;

      const userStart = new Date(formData.start_date);
      const userEnd = new Date(formData.end_date);

      const hasConflict = bookedRanges.some(range => {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        return userStart <= end && userEnd >= start;
      });

      if (hasConflict) {
        toast.error(t('selected_dates_unavailable'));
      }
    }, [formData.start_date, formData.end_date, bookedRanges]);

  // Available Dates :-------------------------------



  // Handel Available Beds :------------------------
    useEffect(() => {
    if (!formData.start_date || !formData.end_date) return;

    // In  yearly should be end data is set
    if (residence.price_period === 'yearly' && !formData.end_date) return;

    // In monthly two end and  start data are set :-
    if (residence.price_period === 'monthly' && !formData.end_date) return;

    const fetchAvailableBeds = async () => {
      try {
        setBedsLoading(true);

        const res = await bookingsApi.getAvailableBeds(
          residence.id,
          formData.start_date,
          formData.end_date
        );

        setAvailableBeds(res.available_beds);

        if (formData.bed_count > res.available_beds) {
          setFormData(prev => ({
            ...prev,
            bed_count: res.available_beds
          }));
        }

      } catch (err) {
        console.error(err);
        toast.error(t('error_fetching_available_beds'));
      } finally {
        setBedsLoading(false);
      }
    };

    fetchAvailableBeds();
    }, [formData.start_date, formData.end_date]);


    // Delete Last Value 
    useEffect(() => {
      if (!formData.start_date || !formData.end_date) {
        setAvailableBeds(null);
      }
    }, [formData.start_date, formData.end_date]);
    
  // Handel Available Beds :------------------------



    
    const isValidMonthlyBooking = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // The Same  Day of Month
      if (startDate.getDate() !== endDate.getDate()) return false;

      const months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      return months >= 1;
    };



  // Handle Start Date Change :-------
  const handleStartDateChange = (date?: Date) => {
    if (!date) {
      setFormData(prev => ({
        ...prev,
        start_date: '',
        end_date: '',
      }));
      return;
    }

    const start = format(date, 'yyyy-MM-dd');
    let end = '';

    if (residence.price_period === 'yearly') {
      const endDate = new Date(date);
      endDate.setFullYear(endDate.getFullYear() + 1);
      end = format(endDate, 'yyyy-MM-dd');
    }

    setFormData(prev => ({
      ...prev,
      start_date: start,
      end_date: end,
    }));
  };
  // Handle Start Date Change :-------





  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {t('book_this_property')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right"> {t('book_this_property')}: {residence.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-right">
              {error}
            </div>
          )}

          {/* Residence Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{residence.name}</h3>
            <p className="text-gray-600 text-sm mb-2"> {residence.city} , {residence.location}</p>
            { residence.price_period  === 'monthly' 
              ? (
                <p className="text-blue-600 font-semibold"> {parseFloat((residence.price_with_commission).toFixed(1))} {t('monthly_price')} </p>
              )
              : (
                <p className="text-blue-600 font-semibold"> {parseFloat((residence.price_with_commission).toFixed(1))} {t('per_year_sar')} </p>
              )
            }
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label className="">{t('start_date')}</Label>
            <p className='text-gray-600 text-sm'>{t('after_7_day')}</p>  
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.start_date ? format(new Date(formData.start_date), "yyyy-MM-dd", { locale: ar }) : t('select_date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                <div className="bg-white">
                  <Calendar
                    mode="single"
                    selected={formData.start_date ? new Date(formData.start_date) : undefined}
                    // onSelect={(date) =>
                    //   setFormData(prev => ({
                    //     ...prev,
                    //     start_date: date ? format(date, "yyyy-MM-dd") : ""
                    //   }))
                    // }
                    onSelect={handleStartDateChange}
                    disabled={(date) =>
                      date < minBookingDate || isDateBooked(date)
                    }
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {residence.price_period === 'yearly' && formData.start_date && (
            <p className="text-sm sm:text-base text-primary mt-0">
              {t('automatically_booked_full_year')}
            </p>
          )}


          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-right">{t('end_date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={residence.price_period === 'yearly'}
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.end_date
                    ? format(new Date(formData.end_date), "yyyy-MM-dd", { locale: ar })
                    : t('select_date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
                <div className="bg-white">
                  <Calendar
                    mode="single"
                    selected={formData.end_date ? new Date(formData.end_date) : undefined}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        end_date: date ? format(date, "yyyy-MM-dd") : "",
                      }))
                    }
                    // disabled={(date) => {
                    //   if (!formData.start_date) return true;

                    //   const start = new Date(formData.start_date);

                    //   // لازم نفس رقم اليوم
                    //   // Shoud be the same Day in next month:-
                    //   if (date.getDate() !== start.getDate()) return true;

                    //   const months =
                    //     (date.getFullYear() - start.getFullYear()) * 12 +
                    //     (date.getMonth() - start.getMonth());

                    //   return months < 1;
                    // }}
                    disabled={(date) => {
                      if (!formData.start_date) return true;

                      const start = new Date(formData.start_date);

                      // Shoud be the same Day in next month:-
                      if (date.getDate() !== start.getDate()) return true;

                      const months =
                        (date.getFullYear() - start.getFullYear()) * 12 +
                        (date.getMonth() - start.getMonth());

                      if (residence.price_period === 'monthly') {
                        // Month or more :- 
                        return months < 1;
                      }

                      if (residence.price_period === 'yearly') {
                        // Year or more :-
                        return months !== 12;
                      }

                      return true;
                    }}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Bed Count */}
          <div className="space-y-2">
            <Label htmlFor="bed_count" className="text-right">{t('bed_count')}</Label>
            {/* <Input
              id="bed_count"
              type="number"
              min="1"
              max={availableBeds ?? residence.bed_count}
              value={formData.bed_count}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                bed_count: parseInt(e.target.value) || 1
              }))}
              required
            /> */}

            <Input
              id="bed_count"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.bed_count}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');

                setFormData(prev => ({
                  ...prev,
                  bed_count: value
                }));
              }}
              required
            />


              <p className="text-primary text-sm sm:text-base">
                {t('max_bed_count')} {residence.bed_count} {t('bed')}
              </p>
          </div>

         {/* Loading available beds (only when end date is set) */}
          {bedsLoading && formData.end_date && (
            <p className="text-base text-primary">
              {t('checking_available_beds')}
            </p>
          )}


          {/* View Available Beds */}
          {formData.start_date && formData.end_date && availableBeds !== null && (
            <p className="text-sm sm:text-base text-primary">
             {t('available_beds_count')} :
              <span className="font-medium text-base sm:text-xl">{availableBeds}</span>
            </p>
          )}


          {/* Services */}
          {servicesLoading ? (
            <div className="space-y-2">
              <Label className="text-right">{t('optional_services')}</Label>
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span className="text-sm text-gray-600"> {t('loading_services')}</span>
              </div>
            </div>
          ) : matchedServices && matchedServices.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-right"> {t('optional_services')}</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {matchedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={formData.service_ids.includes(service.service_id)}
                        onChange={(e) => {
                          console.log('Service checkbox changed:', service);
                          console.log('Service service_id:', service.service_id);
                          handleServiceChange(service.service_id, e.target.checked);
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">
                        {service.name}
                      </label>
                    </div>
                    {service.extra_cost && service.extra_cost > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        +{service.extra_cost} {t('currency')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : residence.services && residence.services.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-right">{t('optional_services')}</Label>
              <div className="text-sm text-gray-500 text-center p-4">
                {t('cannot_load_services')}
              </div>
            </div>
          ) : null}

          {/* Price Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm sm:text-lg mb-2 ">{t('price_summary')}</h3>
            <div className="space-y-1 text-right">
              <div className="flex justify-between">
                <span className='text-sm sm:text-base'> {t('base_price')}:</span>
                { residence.price_period === 'monthly' 
                  ? (
                    <span className='text-sm sm:text-base'>{(residence.price_with_commission).toFixed(1)}  {t('currency')} ( {t('per_month')} ) × {formData.bed_count} {t('bed')} </span>
                    
                  )
                  : (
                    <span className='text-sm sm:text-base'>{(residence.price_with_commission ).toFixed(1)} {t('currency') } ( {t('per_year')} ) × {formData.bed_count} {t('bed')} </span>
                  )
                }
              </div>
              {/*  {t('currency')} */}
              {formData.service_ids.length > 0 && matchedServices && (
                <div className="text-sm text-gray-600">
                  <div> {t('extra_services')}:</div>
                  {matchedServices
                    .filter(service => formData.service_ids.includes(service.service_id))
                    .map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{service.name}</span>
                        <span className="font-semibold text-green-600">
                          +{service.extra_cost || 0} {t('currency')}
                        </span>
                      </div>
                    ))}
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span className='text-sm sm:text-base'>{t('total')}:</span>
                { residence.price_period === 'monthly' 
                  ?(
                    <span className='text-primary text-base'>{formData.total_price_with_commission.toFixed(1)} {t('currency')}</span>
                  )
                  :(
                    <span className="text-primary text-base">
                      {(
                        // Base price for a year (without services)
                        residence.price_with_commission * formData.bed_count 
                        // + selected services (without multiplying by 12)
                        + matchedServices
                            .filter(service => formData.service_ids.includes(service.service_id))
                            .reduce((sum, service) => sum + (service.extra_cost || 0), 0)
                      ).toFixed(1)} {t('currency')}
                    </span>
                  )
                }
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-[#DDD4BA]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  {t('booking_in_progress')}
                </>
              ) : (
                t('confirm_booking')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
