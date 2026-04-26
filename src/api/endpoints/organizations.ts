/**
 * Organization management API endpoints
 */

import { api } from '../api';
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';
import type { Organization } from '@/entities/organization/types';

export const organizationsApi = {
  // Get all organizations
  getOrganizations: (params?: SearchParams): Promise<PaginatedResponse<Organization>> => {
    return api.get('/organizations', params);
  },

  // Get organization by ID
  getOrganizationById: (id: string): Promise<ApiResponse<Organization>> => {
    return api.get(`/organizations/${id}`);
  },

  // Create new organization
  createOrganization: (orgData: CreateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    return api.post('/organizations', orgData);
  },

  // Update organization
  updateOrganization: (id: string, orgData: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> => {
    return api.put(`/organizations/${id}`, orgData);
  },

  // Delete organization
  deleteOrganization: (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/organizations/${id}`);
  },

  // Upload organization logo
  uploadLogo: (orgId: string, file: File): Promise<ApiResponse<{ logoUrl: string }>> => {
    return api.upload(`/organizations/${orgId}/logo`, file);
  },

  // Get organization members
  getOrganizationMembers: (orgId: string, params?: SearchParams): Promise<PaginatedResponse<any>> => {
    return api.get(`/organizations/${orgId}/members`, params);
  },

  // Add member to organization
  addMember: (orgId: string, userId: string, role?: string): Promise<ApiResponse<void>> => {
    return api.post(`/organizations/${orgId}/members`, { userId, role });
  },

  // Remove member from organization
  removeMember: (orgId: string, userId: string): Promise<ApiResponse<void>> => {
    return api.delete(`/organizations/${orgId}/members/${userId}`);
  },

  // Update member role
  updateMemberRole: (orgId: string, userId: string, role: string): Promise<ApiResponse<void>> => {
    return api.put(`/organizations/${orgId}/members/${userId}/role`, { role });
  },

  // Get organization settings
  getSettings: (orgId: string): Promise<ApiResponse<any>> => {
    return api.get(`/organizations/${orgId}/settings`);
  },

  // Update organization settings
  updateSettings: (orgId: string, settings: Record<string, any>): Promise<ApiResponse<any>> => {
    return api.put(`/organizations/${orgId}/settings`, settings);
  },

  // Get organization statistics
  getStatistics: (orgId: string, period?: string): Promise<ApiResponse<any>> => {
    return api.get(`/organizations/${orgId}/statistics`, { period });
  },
};