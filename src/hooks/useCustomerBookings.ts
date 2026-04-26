import { useState, useEffect } from 'react';
import { customersApi } from '@/api/endpoints/customers';
import type { BookingResponse } from '@/api/types';

interface UseCustomerBookingsReturn {
  bookings: BookingResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCustomerBookings = (): UseCustomerBookingsReturn => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customersApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
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
