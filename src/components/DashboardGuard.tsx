import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { uploadsApi } from '@/api/endpoints/uploads';
import { Loader2 } from 'lucide-react';

interface DashboardGuardProps {
  children: React.ReactNode;
}

const DashboardGuard: React.FC<DashboardGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasDocuments, setHasDocuments] = useState(false);

  useEffect(() => {
    const checkDocumentStatus = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has uploaded any signup documents
        const response = await uploadsApi.listUserSignupDocuments(user.id);
        // The API returns { results: [] } if no documents, or { results: [...] } if documents exist
        const hasDocuments = response && response.results && response.results.length > 0;
        setHasDocuments(hasDocuments);
        
        if (!hasDocuments) {
          // Redirect to document upload page
          navigate('/signup/company/step3', { replace: true });
        }
      } catch (error) {
        console.error('Failed to check document status:', error);
        // On error, redirect to document upload (fail closed)
        setHasDocuments(false);
        navigate('/signup/company/step3', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkDocumentStatus();
  }, [isAuthenticated, user?.id, navigate]);

  // Show loading spinner while checking document status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E4166] mx-auto mb-4" />
          <p className="text-[#516180] font-['IBM Plex Sans Arabic']">
            جاري التحقق من حالة الوثائق...
          </p>
        </div>
      </div>
    );
  }

  // If user has documents, render the protected content
  if (hasDocuments) {
    return <>{children}</>;
  }

  // This should not be reached due to navigation in useEffect, but just in case
  return null;
};

export default DashboardGuard;
