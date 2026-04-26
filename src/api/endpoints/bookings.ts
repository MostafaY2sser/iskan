/**
 * Bookings API endpoints
 */

import { api } from '../api';
import type {
  BookingCreate,
  BookingResponse,
  AssignAgentRequest,
  UpdateBookingStatusRequest,
  MonthlyAnalyticsResponse,
} from '../types';

export const bookingsApi = {
  // Create a new booking
  createBooking: (bookingData: BookingCreate): Promise<BookingResponse> => {
    return api.post('/bookings/', bookingData);
  },

  // Get booking by ID
  getBookingById: (bookingId: number): Promise<BookingResponse> => {
    return api.get(`/bookings/${bookingId}`);
  },

  // UpDate booking by ID :----------
  upDateBookingById: (id: number, data: any) => {
    return api.patch(`/bookings/${id}`, data);
  },


  // Delete booking by ID
  deleteBooking: async (bookingId: number): Promise<void> => {
    await api.delete(`/bookings/${bookingId}`);
  },

  // Assign agent to booking (Admin only)
  assignAgent: (bookingId: number, agentData: AssignAgentRequest): Promise<BookingResponse> => {
    return api.post(`/bookings/${bookingId}/assign-agent`, agentData);
  },

  // Get bookings by residence ID
  getBookingsByResidence: (residenceId: number): Promise<BookingResponse[]> => {
    return api.get(`/bookings/by_residence/${residenceId}`);
  },

  // Get bookings by residence ID
  getApprovedBookingsByResidence: (residenceId: number): Promise<BookingResponse[]> => {
    return api.get(`/bookings/by_residence/${residenceId}/admin-approved`);
  },

  // Get bookings for user's residences
  getBookingsByUser: (): Promise<BookingResponse[]> => {
    return api.get('/bookings/by/user');
  },

  // Get monthly analytics
  getMonthlyAnalytics: (): Promise<MonthlyAnalyticsResponse[]> => {
    return api.get('/bookings/me/monthly-analytics');
  },

  // Update booking status (Owner/Residence company)
  updateBookingStatus: (
    bookingId: number,
    statusData: UpdateBookingStatusRequest
  ): Promise<BookingResponse> => {
    return api.patch(`/bookings/${bookingId}/status`, statusData);
  },


  // Get availability for property
  getAvailability: (propertyId: number | string) => {
    return api.get(`/bookings/${propertyId}/availability`);
  },


  // Get available beds for residence in date range
  getAvailableBeds: (
    residenceId: number,
    fromDate: string,
    toDate: string
  ): Promise<{
    residence_id: number;
    available_beds: number;
    from_date: string;
    to_date: string;
  }> => {
    return api.get(
      `/bookings/${residenceId}/available-beds`,
      {
        from_date: fromDate,
        to_date: toDate,
      }
    );
  },



};
