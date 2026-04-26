/**
 * Hook for handling authentication errors in components
 * Provides utilities to handle 401/403 errors gracefully
 */

import { useCallback } from 'react';
import { handleAuthError, isAuthError } from '@/utils/authErrorHandler';

export const useAuthErrorHandler = () => {
  /**
   * Handle API errors and automatically logout on auth errors
   */
  const handleApiError = useCallback((error: any) => {
    // Check if it's an API error with status
    if (error?.status && isAuthError(error.status)) {
      handleAuthError(error.status, error.message);
      return true; // Indicates that logout was triggered
    }
    
    // For other errors, return false to let component handle normally
    return false;
  }, []);

  /**
   * Check if an error is an authentication error
   */
  const isAuthenticationError = useCallback((error: any): boolean => {
    return error?.status ? isAuthError(error.status) : false;
  }, []);

  return {
    handleApiError,
    isAuthenticationError,
  };
};
