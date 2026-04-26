/**
 * API module barrel exports
 * Centralizes all API exports for easy importing
 */

// Core API client and types
export { api, ApiError, request } from './api';
export type * from './types';

// Endpoint collections
export { authApi, type RegistrationResponse } from './endpoints/auth';
export { usersApi } from './endpoints/users';
export { propertiesApi } from './endpoints/properties';
export { organizationsApi } from './endpoints/organizations';
export { propertyUnitsApi } from './endpoints/property-units';
export { uploadsApi } from './endpoints/uploads';
export { residencesApi } from './endpoints/residences';
export { bookingsApi } from './endpoints/bookings';
export { customersApi } from './endpoints/customers';
export { adminApi } from './endpoints/admin';
export { servicesApi } from './endpoints/services';
export { messagesApi } from './endpoints/messages';
export { dashboardApi, type DashboardData, type DashboardKPIs } from './endpoints/dashboard';

// Import for re-export
import { authApi } from './endpoints/auth';
import { usersApi } from './endpoints/users';
import { propertiesApi } from './endpoints/properties';
import { organizationsApi } from './endpoints/organizations';
import { propertyUnitsApi } from './endpoints/property-units';
import { uploadsApi } from './endpoints/uploads';
import { residencesApi } from './endpoints/residences';
import { bookingsApi } from './endpoints/bookings';
import { customersApi } from './endpoints/customers';
import { adminApi } from './endpoints/admin';
import { servicesApi } from './endpoints/services';
import { messagesApi } from './endpoints/messages';
import { dashboardApi } from './endpoints/dashboard';

// Convenience re-exports for common patterns
export const apiClient = {
  auth: authApi,
  users: usersApi,
  properties: propertiesApi,
  organizations: organizationsApi,
  propertyUnits: propertyUnitsApi,
  uploads: uploadsApi,
  residences: residencesApi,
  bookings: bookingsApi,
  customers: customersApi,
  admin: adminApi,
  services: servicesApi,
  messages: messagesApi,
  dashboard: dashboardApi,
} as const;