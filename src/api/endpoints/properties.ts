/**
 * Property management API endpoints
 */

import { api } from '../api';
import type {
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertySearchParams,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import type { Property } from '@/entities/property/types';

export const propertiesApi = {
  // Get all properties
  getProperties: (params?: PropertySearchParams): Promise<PaginatedResponse<Property>> => {
    return api.get('/properties', params);
  },

  // Get property by ID
  getPropertyById: (id: string): Promise<ApiResponse<Property>> => {
    return api.get(`/properties/${id}`);
  },

  // Create new property
  createProperty: (propertyData: CreatePropertyRequest): Promise<ApiResponse<Property>> => {
    return api.post('/properties', propertyData);
  },

  // Update property
  updateProperty: (id: string, propertyData: UpdatePropertyRequest): Promise<ApiResponse<Property>> => {
    return api.put(`/properties/${id}`, propertyData);
  },

  // Delete property
  deleteProperty: (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/properties/${id}`);
  },

  // Get properties by owner
  getPropertiesByOwner: (ownerId: string, params?: PropertySearchParams): Promise<PaginatedResponse<Property>> => {
    return api.get(`/properties/owner/${ownerId}`, params);
  },

  // Search properties
  searchProperties: (query: string, params?: PropertySearchParams): Promise<PaginatedResponse<Property>> => {
    return api.get('/properties/search', { q: query, ...params });
  },

  // Upload property images
  uploadPropertyImages: (propertyId: string, files: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    formData.append('propertyId', propertyId);
    
    return api.upload('/properties/images', files[0], { propertyId });
  },

  // Delete property image
  deletePropertyImage: (propertyId: string, imageUrl: string): Promise<ApiResponse<void>> => {
    return api.delete(`/properties/${propertyId}/images?imageUrl=${encodeURIComponent(imageUrl)}`);
  },

  // Get property analytics
  getPropertyAnalytics: (propertyId: string, period?: string): Promise<ApiResponse<any>> => {
    return api.get(`/properties/${propertyId}/analytics`, { period });
  },

  // Toggle property availability
  toggleAvailability: (propertyId: string, isAvailable: boolean): Promise<ApiResponse<Property>> => {
    return api.patch(`/properties/${propertyId}/availability`, { isAvailable });
  },

  // Get featured properties
  getFeaturedProperties: (limit?: number): Promise<ApiResponse<Property[]>> => {
    return api.get('/properties/featured', { limit });
  },

  // Set property as featured
  setFeatured: (propertyId: string, isFeatured: boolean): Promise<ApiResponse<Property>> => {
    return api.patch(`/properties/${propertyId}/featured`, { isFeatured });
  },

  

};