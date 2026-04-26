/**
 * Services API endpoints
 */

import { api } from '../api';
import type {
  CreateService,
  CreateResidenceService,
} from '../types';

export const servicesApi = {
  // Get all services
  getAllServices: (): Promise<any> => {
    return api.get('/service/all');
  },

  // Add new service
  addService: (serviceData: CreateService): Promise<any> => {
    return api.post('/service/add', serviceData);
  },

  // Add service to residence
  addServiceToResidence: (residenceServiceData: CreateResidenceService): Promise<any> => {
    return api.post('/service/add_to_residence', residenceServiceData);
  },

  // Get residence services
  getResidenceServices: (residenceId: number): Promise<any> => {
    return api.get(`/service/residence/${residenceId}`);
  },

  // Search residences by services
  searchResidencesByServices: (serviceIds: number[]): Promise<any> => {
    return api.post('/service/residence_by_services', serviceIds);
  },
};
