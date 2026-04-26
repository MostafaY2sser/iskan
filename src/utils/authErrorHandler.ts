/**
 * Centralized authentication error handling
 * Automatically logs out users on 401 and 403 errors
 */

import { toast } from 'sonner';

/**
 * Centralized logout function that clears all authentication data
 * and redirects to login page
 */
export const performLogout = (reason?: string) => {
  // Clear all authentication data from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('housing_user');

  // Show appropriate message
  if (reason) {
    toast.error(reason);
  } else {
    toast.error('تم تسجيل الخروج بسبب انتهاء صلاحية الجلسة');
  }

  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Handle authentication errors (401, 403)
 * Automatically logs out user and redirects to login
 */
export const handleAuthError = (status: number, message?: string) => {
  
  switch (status) {
    case 401:
      performLogout('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      break;
    case 403:
      performLogout('ليس لديك صلاحية للوصول إلى هذا المورد');
      break;
    default:
      // For other auth-related errors, still logout
      if (status >= 400 && status < 500) {
        performLogout(message || 'حدث خطأ في المصادقة');
      }
      break;
  }
};





/**
 * Check if an error is an authentication error
 */
export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};
