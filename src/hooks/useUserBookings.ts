import { useState, useEffect } from 'react';
import { bookingsApi } from '@/api/endpoints/bookings';
import type { BookingResponse } from '@/api/types';

interface UseUserBookingsReturn {
  bookings: BookingResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserBookings = (): UseUserBookingsReturn => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getBookingsByUser();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};
