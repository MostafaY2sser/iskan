import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useDocumentStatus } from '@/hooks/useDocumentStatus';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, LogIn, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardGuardProps {
  children: React.ReactNode;
}

export const DashboardGuard: React.FC<DashboardGuardProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const { state, retryDocumentCheck } = useDocumentStatus();
  const { t  } = useTranslation()

  // ---------------------------------------
  // Get user info from localStorage
  const storedUser = localStorage.getItem("housing_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  // ---------------------------------------

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // --------------------------------------------
   // If user_type is admin → skip document checks entirely 
  if (user?.user_type === "admin") {
    return <>{children}</>;
  }
  // --------------------------------------------

  // State machine implementation
  switch (state) {
    case 'LOADING':
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 font-medium">{t('verifying_documents')}</p>
          </div>
        </div>
      );

    case 'HAS_DOCS':
      // Success with documents → proceed to Dashboard
      return <>{children}</>;

    case 'NO_DOCS':
      // Success with empty results → block entry and force upload flow
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">{t('document_required')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                {t('no_documents_found')}
              </p>
              <Button 
                onClick={() => window.location.href = '/signup/company/step3'}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 ml-2" />
                {t('upload_document')}
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case 'AUTH_ERROR':
      // 401/403 → sign the user out and show Re-login required
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900"> {t('session_expired')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                {t('login_again_message')}
              </p>
              <Button 
                onClick={logout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 ml-2" />
               {t('login_again')}
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case 'GENERIC_ERROR':
      // Other errors → show generic error with retry
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900"> {t('something_went_wrong')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                {t('verification_failed')}
              </p>
              <Button 
                onClick={() => {
                  console.log('🔄 Retry button clicked in DashboardGuard');
                  retryDocumentCheck();
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                {t('retry')}
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case 'INIT':
    default:
      // Initial state - start checking
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 font-medium">{t('initializing')}</p>
          </div>
        </div>
      );
  }
};
