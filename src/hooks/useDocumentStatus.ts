import { useDocumentStatus as useDocumentStatusContext } from '@/contexts/DocumentStatusContext';

// Re-export the context hook for backward compatibility
export const useDocumentStatus = () => {
  const { status, checkDocuments, retryDocumentCheck, clearCache } = useDocumentStatusContext();
  
  return {
    // Legacy interface for backward compatibility
    hasDocuments: status.state === 'HAS_DOCS',
    isLoading: status.state === 'LOADING',
    error: status.error,
    documents: status.documents,
    lastChecked: status.lastChecked,
    shouldRetry: status.state === 'GENERIC_ERROR',
    
    // New state machine interface
    state: status.state,
    refetch: checkDocuments,
    retryDocumentCheck,
    clearCache,
  };
};
