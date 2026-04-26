import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { uploadsApi } from '@/api/endpoints/uploads';

// Document Check States
type DocumentCheckState = 
  | 'INIT'           // Initial state
  | 'LOADING'        // Checking documents
  | 'HAS_DOCS'       // Success with documents
  | 'NO_DOCS'        // Success but empty results
  | 'AUTH_ERROR'     // 401/403 - session expired
  | 'GENERIC_ERROR'; // Other errors

interface DocumentStatus {
  state: DocumentCheckState;
  documents: any[];
  error: string | null;
  lastChecked: number | null;
}

interface DocumentStatusContextType {
  status: DocumentStatus;
  checkDocuments: () => Promise<void>;
  retryDocumentCheck: () => void;
  clearCache: () => void;
}

const DocumentStatusContext = createContext<DocumentStatusContextType | undefined>(undefined);

interface DocumentStatusProviderProps {
  children: ReactNode;
}

// Cache duration: 5 minutes (300000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

// Analytics events
const trackEvent = (eventName: string, payload?: any) => {
  console.log(`📊 Analytics: ${eventName}`, payload);
  // TODO: Implement actual analytics tracking
};

export const DocumentStatusProvider: React.FC<DocumentStatusProviderProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [status, setStatus] = useState<DocumentStatus>({
    state: 'INIT',
    documents: [],
    error: null,
    lastChecked: null,
  });

  const checkDocuments = async () => {
    if (!user?.id) {
      setStatus({
        state: 'AUTH_ERROR',
        documents: [],
        error: 'User not authenticated',
        lastChecked: null,
      });
      return;
    }

    // Check if we have a recent cache
    const now = Date.now();
    if (status.lastChecked && (now - status.lastChecked) < CACHE_DURATION) {
      console.log('📄 Using cached document status');
      return;
    }

    // Start document check
    setStatus(prev => ({ ...prev, state: 'LOADING', error: null }));
    trackEvent('doc_check_started');

    try {
      console.log('🔍 Checking document status...');
      const response = await uploadsApi.listUserSignupDocuments(user.id);
      
      // Success 200 Response
      if (response && response.results) {
        const results = Array.isArray(response.results) ? response.results : [];
        
        if (results.length > 0) {
          // Success with non-empty results → proceed to Dashboard
          setStatus({
            state: 'HAS_DOCS',
            documents: results,
            error: null,
            lastChecked: now,
          });
          trackEvent('doc_check_success_non_empty', { count: results.length });
          console.log(`📄 Document status: Found ${results.length} documents`);
        } else {
          // Success with empty results → block entry and force upload flow
          setStatus({
            state: 'NO_DOCS',
            documents: [],
            error: null,
            lastChecked: now,
          });
          trackEvent('doc_check_success_empty');
          console.log('📄 No documents found - user needs to upload documents');
        }
      } else {
        // Unexpected response format
        setStatus({
          state: 'GENERIC_ERROR',
          documents: [],
          error: 'Invalid response format',
          lastChecked: now,
        });
        trackEvent('doc_check_generic_error', { reason: 'invalid_response' });
      }
    } catch (error: any) {
      console.error('❌ Error checking documents:', error);
      
      // Extract HTTP status from error
      const extractHttpStatus = (err: any): number | null => {
        return err?.response?.status || 
               err?.status || 
               (err?.message?.includes('401') ? 401 : null) ||
               (err?.message?.includes('403') ? 403 : null) ||
               null;
      };
      
      const status = extractHttpStatus(error);
      
      // Check for authentication errors in error message
      const isAuthError = 
        status === 401 || 
        status === 403 ||
        error?.message?.includes('No access token found') ||
        error?.message?.includes('Please log in again') ||
        error?.message?.includes('Could not validate credentials') ||
        error?.message?.includes('Authentication required') ||
        error?.message?.includes('Unauthorized') ||
        error?.message?.includes('Forbidden');
      
      console.log('🔍 Error message:', error?.message);
      console.log('🔍 Is auth error:', isAuthError);
      
      if (isAuthError) {
        // 401/403 → sign the user out and show Re-login required
        setStatus({
          state: 'AUTH_ERROR',
          documents: [],
          error: 'Session expired',
          lastChecked: now,
        });
        trackEvent('doc_check_auth_error', { status });
        
        console.log('🔐 Authentication error - session expired');
        
        // Use auth provider logout method
        logout();
      } else {
        // Other errors → show generic error with retry
        setStatus({
          state: 'GENERIC_ERROR',
          documents: [],
          error: 'Something went wrong',
          lastChecked: now,
        });
        trackEvent('doc_check_generic_error', { status });
        console.log(`🌐 Generic error: ${status || 'unknown'}`);
      }
    }
  };

  const retryDocumentCheck = () => {
    console.log('🔄 Retry document check clicked');
    trackEvent('doc_check_retry_clicked');
    // Clear cache before retrying
    setStatus(prev => ({
      ...prev,
      lastChecked: null,
    }));
    checkDocuments();
  };

  const clearCache = () => {
    console.log('🗑️ Clearing document status cache');
    setStatus(prev => ({
      ...prev,
      lastChecked: null,
    }));
  };

  // Only check documents when user changes or authentication status changes
  useEffect(() => {
    if (isAuthenticated && user) {
      checkDocuments();
    } else {
      setStatus({
        state: 'INIT',
        documents: [],
        error: null,
        lastChecked: null,
      });
    }
  }, [user?.id, isAuthenticated]);

  const value: DocumentStatusContextType = {
    status,
    checkDocuments,
    retryDocumentCheck,
    clearCache,
  };

  return (
    <DocumentStatusContext.Provider value={value}>
      {children}
    </DocumentStatusContext.Provider>
  );
};

export const useDocumentStatus = (): DocumentStatusContextType => {
  const context = useContext(DocumentStatusContext);
  if (context === undefined) {
    throw new Error('useDocumentStatus must be used within a DocumentStatusProvider');
  }
  return context;
};
