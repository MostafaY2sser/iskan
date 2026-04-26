/**
 * Example component showing how to handle authentication errors
 * This demonstrates the automatic logout functionality
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';
import { api } from '@/api/api';

const AuthErrorExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { handleApiError } = useAuthErrorHandler();

  const testAuthError = async () => {
    setLoading(true);
    try {
      // This would normally be a real API call
      // For demo purposes, we'll simulate a 401 error
      await api.get('/test-auth-error');
    } catch (error) {
      // The error will be automatically handled by the API client
      // If it's a 401/403, the user will be logged out automatically
      console.log('Error caught:', error);
      
      // You can also manually handle auth errors if needed
      const wasLoggedOut = handleApiError(error);
      if (wasLoggedOut) {
        console.log('User was logged out due to auth error');
        return;
      }
      
      // Handle other errors normally
      console.error('Non-auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Authentication Error Handling Test</h2>
      <p className="mb-4 text-gray-600">
        Click the button below to test automatic logout on 401/403 errors.
        The user will be automatically logged out and redirected to login.
      </p>
      <Button 
        onClick={testAuthError} 
        disabled={loading}
        className="bg-red-500 hover:bg-red-600"
      >
        {loading ? 'Testing...' : 'Test Auth Error (401/403)'}
      </Button>
    </div>
  );
};

export default AuthErrorExample;
