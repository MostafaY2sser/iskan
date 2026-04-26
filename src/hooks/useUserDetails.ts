/**
 * Custom hook to fetch user details from API
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/api/api';
import { customersApi } from '@/api/endpoints/customers';

export interface UserDetails {
  company_name?: string | null;
  registration_number?: string | null;
  approx_employee_count?: number | null;
  business_activity?: string | null;
  responsible_person?: string | null;
  first_phone_number?: string | null;
  responsible_position?: string | null;
  second_responsible_person?: string | null;
  second_phone_number?: string | null;
  favorite_area?: string | null;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchUserDetails = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use customer API if user type is customer, otherwise use general endpoint
      if (user.user_type === 'customer') {
        const response = await customersApi.getMyDetails();
        setUserDetails(response);
      } else {
        // For other user types, use the general endpoint
        const response = await api.get<UserDetails>('/customers/me');
        setUserDetails(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      console.error('User details fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [isAuthenticated, user?.id]);

  const refetch = () => {
    fetchUserDetails();
  };

  const updateUserDetails = async (data: Partial<UserDetails>) => {
    console.log('updateUserDetails called with data:', data);
    console.log('User authentication status:', { isAuthenticated, userId: user?.id, userType: user?.user_type });
    
    if (!isAuthenticated || !user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use customer API if user type is customer, otherwise use general endpoint
      if (user.user_type === 'customer') {
        console.log('Using customer API for update');
        const response = await customersApi.updateMyDetails(data);
        console.log('Customer API response:', response);
        setUserDetails(response);
        return response;
      } else {
        console.log('Using general API for update');
        const response = await api.patch<UserDetails>('/customers/me', data);
        console.log('General API response:', response);
        setUserDetails(response);
        return response;
      }
    } catch (err) {
      console.error('Update error in hook:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return {
    userDetails,
    loading,
    error,
    refetch,
    updateUserDetails,
  };
};

