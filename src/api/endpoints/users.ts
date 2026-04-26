/**
 * User management API endpoints
 */

import { api, request } from '../api';
import type {
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';
import type { User } from '@/entities/user/types';

export const usersApi = {
  // Get user by ID
  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return api.get(`/users/${id}`);
  },

  // Get all users (admin only)
  getUsers: (params?: SearchParams): Promise<PaginatedResponse<User>> => {
    return api.get('/users', params);
  },

  // Update user profile
  updateUser: (id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return api.put(`/users/${id}`, userData);
  },

  // Delete user (admin only)
  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/users/${id}`);
  },

  // Update user avatar
  updateAvatar: (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    return api.upload('/users/avatar', file);
  },

  // Get users by organization
  getUsersByOrganization: (organizationId: string, params?: SearchParams): Promise<PaginatedResponse<User>> => {
    return api.get(`/users/organization/${organizationId}`, params);
  },

  // Assign user to organization
  assignToOrganization: (userId: string, organizationId: string): Promise<ApiResponse<User>> => {
    return api.put(`/users/${userId}/organization`, { organizationId });
  },

  // Remove user from organization
  removeFromOrganization: (userId: string): Promise<ApiResponse<User>> => {
    return api.delete(`/users/${userId}/organization`);
  },

  // Update user permissions (admin only)
  updatePermissions: (userId: string, permissions: string[]): Promise<ApiResponse<User>> => {
    return api.put(`/users/${userId}/permissions`, { permissions });
  },

  // Activate/deactivate user account (admin only)
  toggleUserStatus: (userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
    return api.patch(`/users/${userId}/status`, { isActive });
  },



  // Get current owner profile
  getOwnerDetails: (): Promise<any> =>{
    return api.get('/owners/me');
  },

   // Update owner profile
  updateOwnerDetails: (data: any) => {
    return api.patch('/owners/me/owner', data);
  },

  // Update company profile
  updateCompanyDetails: (data: any) => {
    return api.patch('/owners/me/company', data);
  },


  // Deactivate owner profile
  deactivateOwner: (reason: string): Promise<ApiResponse<void>> => {
    return api.patch('/profile/deactivate', { reason });
  },

  // Request reactivation for owner profile
  requestOwnerReactivation: (user_id: string): Promise<ApiResponse<void>> => {
    return api.post('/profile/request-reactivation', { user_id });
  },


  // Get user notifications
  getNotifications: (): Promise<ApiResponse<any[]>> => {
    const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';

    return request<ApiResponse<any[]>>('/notifications/', {
      method: 'GET',
      headers: {
        'Accept-Language': lang,
      },
    });
  },

  // Mark notification as read
  markNotificationAsRead: (notificationId: string): Promise<ApiResponse<void>> => {
    return api.put(`/notifications/${notificationId}/read`);
  },




};