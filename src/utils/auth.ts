/**
 * Authentication utility functions
 */

import { User } from '@/entities/user/types';
import type { 
  CustomerRegister, 
  OwnerRegister, 
  ResidenceCompanyRegister,
  AuthResponse 
} from '@/api/types';

// User role mapping from API to internal types
export const mapApiUserTypeToRole = (userType: string): User['role'] => {
  switch (userType) {
    case 'customer':
      return 'property-owner'; // Map customer to property-owner for now
    case 'owner':
      return 'property-owner';
    case 'residence_company':
      return 'recruiting-company';
    default:
      return 'property-owner';
  }
};

// Create user object from registration data
export const createUserFromRegistration = (
  userData: CustomerRegister | OwnerRegister | ResidenceCompanyRegister,
  userId: string,
  authResponse: AuthResponse
): User => {
  const role = mapApiUserTypeToRole(userData.user_type);
  
  // Extract name from different registration types
  let firstName = 'User';
  let lastName = '';
  
  if ('responsible_person' in userData && userData.responsible_person) {
    const nameParts = userData.responsible_person.split(' ');
    firstName = nameParts[0] || 'User';
    lastName = nameParts.slice(1).join(' ') || '';
  } else if ('company_name' in userData && userData.company_name) {
    firstName = userData.company_name;
    lastName = '';
  }

  return {
    id: userId,
    email: userData.email,
    firstName,
    lastName,
    role,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Validate registration data
export const validateRegistrationData = (
  userData: CustomerRegister | OwnerRegister | ResidenceCompanyRegister
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Common validations
  if (!userData.email || !userData.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Type-specific validations
  if (userData.user_type === 'customer') {
    const customerData = userData as CustomerRegister;
    if (!customerData.company_name) {
      errors.push('Company name is required');
    }
  }

  if (userData.user_type === 'owner') {
    const ownerData = userData as OwnerRegister;
    if (!ownerData.registration_number) {
      errors.push('Registration number is required');
    }
    if (!ownerData.val_license_number) {
      errors.push('License number is required');
    }
    if (!ownerData.business_activity) {
      errors.push('Business activity is required');
    }
    if (!ownerData.phone_number) {
      errors.push('Phone number is required');
    }
  }

  if (userData.user_type === 'residence_company') {
    const companyData = userData as ResidenceCompanyRegister;
    if (!companyData.company_name) {
      errors.push('Company name is required');
    }
    if (!companyData.registration_number) {
      errors.push('Registration number is required');
    }
    if (!companyData.val_license_number) {
      errors.push('License number is required');
    }
    if (!companyData.business_activity) {
      errors.push('Business activity is required');
    }
    if (!companyData.responsible_person) {
      errors.push('Responsible person is required');
    }
    if (!companyData.phone_number) {
      errors.push('Phone number is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format registration data for API
export const formatRegistrationData = (
  userData: CustomerRegister | OwnerRegister | ResidenceCompanyRegister
): CustomerRegister | OwnerRegister | ResidenceCompanyRegister => {
  // Clean and format the data
  const formattedData = { ...userData };
  
  // Normalize email
  if (formattedData.email) {
    formattedData.email = formattedData.email.trim().toLowerCase();
  }

  // Clean string fields
  Object.keys(formattedData).forEach(key => {
    const value = formattedData[key as keyof typeof formattedData];
    if (typeof value === 'string') {
      (formattedData as any)[key] = value.trim();
    }
  });

  return formattedData;
};

// Check if user has required permissions
export const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check specific permissions
  return user.permissions.some(
    permission => permission.resource === resource && permission.action === action
  );
};

// Get user display name
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.firstName) {
    return user.firstName;
  }
  
  return user.email;
};

// Check if user can access route
export const canAccessRoute = (user: User | null, allowedRoles: User['role'][]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
