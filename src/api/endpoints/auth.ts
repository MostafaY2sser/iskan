/**
 * Authentication API endpoints
 */

import { api, ApiError } from '../api';
import type {
  LoginRequest,
  AuthResponse,
  CustomerRegister,
  OwnerRegister,
  ResidenceCompanyRegister,
  ResetPasswordRequest,
} from '../types';

// Registration response type
export interface RegistrationResponse {
  message: string;
  user_id?: string;
  email?: string;
}

export const authApi = {
  // Customer registration
  registerCustomer: async (userData: CustomerRegister): Promise<RegistrationResponse> => {
    try {
      const response = await api.post<RegistrationResponse>('/auth/register/customer', userData);
      return {
        message: 'Customer registered successfully',
        user_id: response.user_id,
        email: userData.email,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed due to network error');
    }
  },

  // Property owner registration
  registerOwner: async (userData: OwnerRegister): Promise<RegistrationResponse> => {
    try {
      console.log('Attempting owner registration with data:', userData);
      const response = await api.post<RegistrationResponse>('/auth/register/owner', userData);
      console.log('Owner registration successful:', response);
      return {
        message: 'Property owner registered successfully',
        user_id: response.user_id,
        email: userData.email,
      };
    } catch (error) {
      console.error('Owner registration error details:', error);
      if (error instanceof ApiError) {
        // throw new Error(`Registration failed: ${error.message} (Status: ${error.status})`);
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed due to network error');
    }
  },

  // Residence company registration
  registerResidenceCompany: async (userData: ResidenceCompanyRegister): Promise<RegistrationResponse> => {
    try {
      const response = await api.post<RegistrationResponse>('/auth/register/residence_company', userData);
      return {
        message: 'Residence company registered successfully',
        user_id: response.user_id,
        email: userData.email,
      };
    } 
    catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed due to network error');
    }
  },

  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens in localStorage
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed due to network error');
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      await api.post('/auth/reset-password', data);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Password reset failed: ${error.message}`);
      }
      throw new Error('Password reset failed due to network error');
    }
  },

  // Logout (clear tokens)
  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('housing_user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Get stored access token
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },
};