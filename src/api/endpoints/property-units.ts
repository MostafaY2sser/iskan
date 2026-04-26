/**
 * Property Unit management API endpoints
 */

import { api } from '../api';
import type {
  CreatePropertyUnitRequest,
  UpdatePropertyUnitRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '../types';
import type { PropertyUnit } from '@/entities/property/types';

export const propertyUnitsApi = {
  // Get all units for a property
  getUnitsByProperty: (propertyId: string, params?: SearchParams): Promise<PaginatedResponse<PropertyUnit>> => {
    return api.get(`/properties/${propertyId}/units`, params);
  },

  // Get unit by ID
  getUnitById: (unitId: string): Promise<ApiResponse<PropertyUnit>> => {
    return api.get(`/units/${unitId}`);
  },

  // Create new unit
  createUnit: (unitData: CreatePropertyUnitRequest): Promise<ApiResponse<PropertyUnit>> => {
    return api.post('/units', unitData);
  },

  // Update unit
  updateUnit: (unitId: string, unitData: UpdatePropertyUnitRequest): Promise<ApiResponse<PropertyUnit>> => {
    return api.put(`/units/${unitId}`, unitData);
  },

  // Delete unit
  deleteUnit: (unitId: string): Promise<ApiResponse<void>> => {
    return api.delete(`/units/${unitId}`);
  },

  // Get available units
  getAvailableUnits: (propertyId?: string, params?: SearchParams): Promise<PaginatedResponse<PropertyUnit>> => {
    const endpoint = propertyId ? `/properties/${propertyId}/units/available` : '/units/available';
    return api.get(endpoint, params);
  },

  // Toggle unit availability
  toggleAvailability: (unitId: string, isAvailable: boolean): Promise<ApiResponse<PropertyUnit>> => {
    return api.patch(`/units/${unitId}/availability`, { isAvailable });
  },

  // Upload unit images
  uploadUnitImages: (unitId: string, files: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> => {
    return api.upload(`/units/${unitId}/images`, files[0], { unitId });
  },

  // Delete unit image
  deleteUnitImage: (unitId: string, imageUrl: string): Promise<ApiResponse<void>> => {
    return api.delete(`/units/${unitId}/images?imageUrl=${encodeURIComponent(imageUrl)}`);
  },

  // Search units
  searchUnits: (query: string, params?: SearchParams): Promise<PaginatedResponse<PropertyUnit>> => {
    return api.get('/units/search', { q: query, ...params });
  },

  // Get unit analytics
  getUnitAnalytics: (unitId: string, period?: string): Promise<ApiResponse<any>> => {
    return api.get(`/units/${unitId}/analytics`, { period });
  },

  // Bulk update units
  bulkUpdateUnits: (unitIds: string[], updateData: UpdatePropertyUnitRequest): Promise<ApiResponse<PropertyUnit[]>> => {
    return api.put('/units/bulk', { unitIds, updateData });
  },

  // Get units by type
  getUnitsByType: (type: string, params?: SearchParams): Promise<PaginatedResponse<PropertyUnit>> => {
    return api.get(`/units/type/${type}`, params);
  },
};