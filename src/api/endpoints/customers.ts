import { api, ApiError } from '../api';
import type { 
  CustomerDetailsResponse, 
  CustomerDetailsUpdate,
  BookingResponse 
} from '../types';

export const customersApi = {
  // Get customer details for the authenticated user
  getMyDetails: async (): Promise<CustomerDetailsResponse> => {
    try {
      const response = await api.get<CustomerDetailsResponse>('/customers/me');
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch customer details: ${error.message}`);
      }
      throw new Error('Failed to fetch customer details due to network error');
    }
  },

  // Update customer details for the authenticated user
  updateMyDetails: async (data: CustomerDetailsUpdate): Promise<CustomerDetailsResponse> => {
    try {
      console.log('customersApi.updateMyDetails called with data:', data);
      const response = await api.patch<CustomerDetailsResponse>('/customers/me', data);
      console.log('API response received:', response);
      return response;
    } catch (error) {
      console.error('API error in updateMyDetails:', error);
      if (error instanceof ApiError) {
        throw new Error(`Failed to update customer details: ${error.message}`);
      }
      throw new Error('Failed to update customer details due to network error');
    }
  },

  // Get customer bookings
  getMyBookings: async (): Promise<BookingResponse[]> => {
    try {
      const response = await api.get<BookingResponse[]>('/customers/me/bookings');
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch customer bookings: ${error.message}`);
      }
      throw new Error('Failed to fetch customer bookings due to network error');
    }
  },

  // Get customer details by user ID (admin only)
  getCustomerById: async (userId: string): Promise<CustomerDetailsResponse> => {
    try {
      const response = await api.get<CustomerDetailsResponse>(`/customers/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch customer details: ${error.message}`);
      }
      throw new Error('Failed to fetch customer details due to network error');
    }
  },


};