/**
 * Residence API endpoints
 */

import { api } from '../api';
import type {
  CreateResidence,
  ResidencePublicResponse,
  ResidenceOwnerResponse,
} from '../types';




export const residencesApi = {
  // Create new residence
  createResidence: (residenceData: CreateResidence): Promise<any> => {
    return api.post('/residence', residenceData);
  },

  // Get all residences
  getAllResidences: (): Promise<ResidencePublicResponse[]> => {
    return api.get('/residence/all');
  },


  // Get residences by user ID
  getResidencesByUserId: (userId: string): Promise<ResidenceOwnerResponse[]> => {
    return api.get(`/residence/user/${userId}`);
  },

  // Get all approved residences (public)
  // getApprovedResidences: (): Promise<ResidencePublicResponse[]> => {
  //   return api.get('/residence/approved_residences');
  // },  
  
  
  // Get Approved Residences :----- 
  getApprovedResidences: (
    skip = 0,
    limit = 12
  ): Promise<{ data: ResidencePublicResponse[]; total: number }> => {
    return api.get(
      `/residence/approved_residences?skip=${skip}&limit=${limit}`
    );
  },

  // Get Residences By Price Range :-----
  getResidencesByPriceRange: (
    min: number,
    max: number
  ): Promise<{ data: ResidencePublicResponse[] }> => {
    return api.get(
      `/residence/by_price_range?min_price=${min}&max_price=${max}`
    );
  },

  // Get Approved Residences By Date Range :-----
  getApprovedResidencesByDateRange: (
    startDate: string,
    endDate: string
  ): Promise<{ data: ResidencePublicResponse[] }> => {
    return api.get(
      `/residence/approved_residences?start_date=${startDate}&end_date=${endDate}`
    );
  },


  // Get owner approved residences
  getOwnerApprovedResidences: (userId: string): Promise<ResidenceOwnerResponse[]> => {
    return api.get(`/residence/approved_residence/${userId}`);
  },

  // Search residences by area
  searchResidencesByArea: (area: string): Promise<ResidencePublicResponse[]> => {
    return api.get('/residence/search_by_area', { area });
  },

  // Get residence by ID
  getResidenceById: (residenceId: number): Promise<ResidencePublicResponse> => {
    return api.get(`/residence/${residenceId}`);
  },

  getResidenceDetailsOwnweById: (residenceId: number) : Promise<ResidencePublicResponse> => {
    return api.get(`/residence/${residenceId}/owner`);
  },

  // Update residence status
  updateResidenceStatus: (bookingId: number, status: string): Promise<any> => {
    return api.post(`/residence/update_status/${bookingId}`, null, { status });
  },

  // Upload residence cover photo
  uploadCoverPhoto: (residenceId: number, file: File): Promise<any> => {
    return api.upload(`/uploads/residences/${residenceId}/cover`, file);
  },

  // Upload residence gallery photo
  uploadGalleryPhoto: (residenceId: number, file: File): Promise<any> => {
    return api.upload(`/uploads/residences/${residenceId}/gallery`, file);
  },

  // Service-related endpoints
  // Get all services
  getAllServices: (): Promise<any> => {
    return api.get('/service/all');
  },

  // Create new service
  createService: (serviceData: { name: string; description: string }): Promise<any> => {
    return api.post('/service/add', serviceData);
  },

  // Add services to residence
  addServicesToResidence: (residenceId: number, services: Array<{ service_id: number; extra_cost: number }>): Promise<any> => {
    return api.post('/service/add_to_residence', {
      residence_id: residenceId,
      services: services
    });
  },

  // Get residence services
  getResidenceServices: (residenceId: number): Promise<any> => {
    return api.get(`/service/residence/${residenceId}`);
  },


  // Updata  Residence  :----------
  updateResidence: (residenceId: number, data: any, token?: string) => {
    return api.patch(`/residence/${residenceId}`, data, {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    });
  },

  // Delete Residence :----------
  deleteResidence: (residenceId: number) => {
    const token = localStorage.getItem("access_token");
    return api.delete(`/residence/${residenceId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
    });
  },


  // Get property gallery images
  getPropertyGallery: (propertyId: string): Promise<ApiResponse<{ public_url: string }[]>> => {
    return api.get(`/uploads/residences/${propertyId}/gallery`);
  },


};
