/**
 * Custom hook for user registration
 */

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import type { 
  CustomerRegister, 
  OwnerRegister, 
  ResidenceCompanyRegister 
} from '@/api/types';
import type { RegistrationResponse } from '@/api/endpoints/auth';

export const useRegistration = () => {
  const { registerCustomer, registerOwner, registerResidenceCompany, isLoading, error } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const handleRegistration = async (
    userData: CustomerRegister | OwnerRegister | ResidenceCompanyRegister,
    userType: 'customer' | 'owner' | 'residence_company'
  ): Promise<RegistrationResponse | null> => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      let response: RegistrationResponse;

      switch (userType) {
        case 'customer':
          response = await registerCustomer(userData as CustomerRegister);
          break;
        case 'owner':
          response = await registerOwner(userData as OwnerRegister);
          break;
        case 'residence_company':
          response = await registerResidenceCompany(userData as ResidenceCompanyRegister);
          break;
        default:
          throw new Error('Invalid user type');
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setRegistrationError(errorMessage);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  const clearError = () => {
    setRegistrationError(null);
  };

  return {
    register: handleRegistration,
    isRegistering: isRegistering || isLoading,
    error: registrationError || error,
    clearError,
  };
};
