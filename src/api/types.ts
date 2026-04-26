/**
 * API response and request type definitions
 * Centralized types for all API interactions
 */

import { User, UserRole } from '@/entities/user/types';
import { Organization } from '@/entities/organization/types';
import { Property, PropertyUnit } from '@/entities/property/types';

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Error response
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
  success: false;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  user_type: string;
}

export interface CustomerRegister {
  email: string;
  password: string;
  user_type: 'customer';
  company_name: string;
  registration_number?: string | null;
  approx_employee_count?: number | null;
  business_activity?: string | null;
  responsible_person?: string | null;
  first_phone_number?: string | null;
  responsible_position?: string | null;
  second_responsible_person?: string | null;
  second_phone_number?: string | null;
  favorite_area?: string | null;
}

export interface OwnerRegister {
  email: string;
  password: string;
  user_type: 'owner';
  registration_number: string;
  val_license_number: string;
  business_activity: string;
  phone_number: string;
  address?: string | null;
  region?: string | null;
  city?: string | null;
}

export interface ResidenceCompanyRegister {
  email: string;
  password: string;
  user_type: 'residence_company';
  company_name: string;
  registration_number: string;
  val_license_number: string;
  business_activity: string;
  responsible_person: string;
  phone_number: string;
  address?: string | null;
  region?: string | null;
  city?: string | null;
}

export interface ResetPasswordRequest {
  email: string;
}

// User management types
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  organizationId?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Organization types
export interface CreateOrganizationRequest {
  name: string;
  type: 'property-management' | 'recruiting-company';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {}

// Property types
export interface CreatePropertyRequest {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  type: 'apartment' | 'house' | 'dormitory' | 'corporate-housing';
  totalUnits: number;
  amenities: string[];
  description: string;
  images?: string[];
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

export interface PropertySearchParams {
  city?: string;
  state?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

// Property Unit types
export interface CreatePropertyUnitRequest {
  propertyId: string;
  unitNumber: string;
  type: 'studio' | '1br' | '2br' | '3br' | '4br+';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rent: number;
  deposit: number;
  features: string[];
  images?: string[];
}

export interface UpdatePropertyUnitRequest extends Partial<Omit<CreatePropertyUnitRequest, 'propertyId'>> {}

// File upload types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard/Analytics types
export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface PropertyAnalytics {
  propertyId: string;
  views: number;
  inquiries: number;
  applications: number;
  occupancyRate: number;
  averageRent: number;
}

// New types based on OpenAPI schema

// Residence types
export interface CreateResidence {
  name: string;
  location: string;
  bed_count: number;
  price_per_bed: number;
  description: string;
  residence_type: string;
  rooms_count: number;
  kitchen_count: number;
  bathroom_count: number;
  building_year: number;
   is_renewed: false,
  address: string;
  city: string;
  residence_license: string;
  nearby_landmarks: string;
  price_period?: 'monthly' | 'yearly';
}

export interface ResidencePublicResponse {
  id: number;
  name: string;
  bed_count: number;
  description: string;
  residence_type: string;
  rooms_count: number;
  kitchen_count: number;
  bathroom_count: number;
  building_year: number;
  is_renewed: boolean;
  status: string;
  address: string;
  city: string;
  price_with_commission: number;
  created_at: string;
  cover_photo_url?: string | null;
  services: ResidenceServiceDetails[];
  nearby_landmarks: string;
  price_period: string
}

export interface ResidenceOwnerResponse {
  name: string;
  location: string;
  bed_count: number;
  price_per_bed: number;
  description: string;
  residence_type: string;
  rooms_count: number;
  kitchen_count: number;
  bathroom_count: number;
  building_year: number;
  address: string;
  city: string;
  id: number;
  status: string;
  created_at: string;
  cover_photo_url?: string | null;
  services: ResidenceServiceDetails[];
  nearby_landmarks: string,
  price_period: string,
  is_renewed: boolean,
  residence_license: string,
}

// Booking types
export interface BookingCreate {
  residence_id: number;
  bed_count: number;
  start_date: string;
  end_date: string;
  total_price_with_commission: number;
  service_ids?: number[];
}

export interface BookingResponse {
  is_paid: boolean;
  is_admin_approved: any;
  admin_status: string;
  id: number;
  customer_id: string;
  residence_id: number;
  bed_count: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  total_price_with_commission: number;
  agent?: AgentResponse | null;
}

export interface AssignAgentRequest {
  agent_id: number;
}

export interface UpdateBookingStatusRequest {
  status: 'approved' | 'rejected';
}

export interface MonthlyAnalyticsResponse {
  month_year: string;
  total_amount: number;
}

// Customer types
export interface CustomerDetailsResponse {
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
  created_at: string;
  updated_at: string;
}

export interface CustomerDetailsUpdate {
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
}

// Service types
export interface CreateService {
  name: string;
  description: string;
}

export interface CreateResidenceService {
  residence_id: number;
  services: ResidenceServiceItem[];
}

export interface ResidenceServiceItem {
  service_id: number;
  extra_cost?: number;
}

export interface ResidenceServiceDetails {
  id: number;
  service_id: number;
  name: string;
  description?: string | null;
  extra_cost?: number | null;
}

// Upload types
export interface UploadOut {
  id: number;
  file_path: string;
  entity_type: 'documents' | 'contracts' | 'residences';
  entity_id: number;
  uploaded_at: string;
}

export interface SignedUrlOut {
  signed_url: string;
}

export interface PublicUrlOut {
  public_url: string;
}

export interface ContractOut {
  id: number;
  booking_id: number;
  commission_rate?: number | null;
  final_price?: number | null;
  start_date: string;
  end_date: string;
}

// Agent types
export interface AgentResponse {
  id: number;
  name: string;
  contact_info: string;
}

// User types
export interface UserResponse {
  id: string;
  user_type?: string | null;
  email: string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Message types
export interface Message {
  id: number;
  date: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  attachment?: string;
  unread: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  unread_count: number;
}

export interface MessageDetailResponse extends Message {
  // Additional fields for detailed message view
  sender_email?: string;
  sender_phone?: string;
  property_id?: number;
  booking_id?: number;
}