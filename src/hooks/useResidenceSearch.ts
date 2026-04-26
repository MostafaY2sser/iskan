import { useState, useEffect, useCallback } from 'react';
import { residencesApi } from '@/api/endpoints/residences';
import type { ResidencePublicResponse } from '@/api/types';

interface UseResidenceSearchReturn {
  searchResults: ResidencePublicResponse[];
  loading: boolean;
  error: string | null;
  searchResidences: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useResidenceSearch = (): UseResidenceSearchReturn => {
  const [searchResults, setSearchResults] = useState<ResidencePublicResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchResidences = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await residencesApi.searchResidencesByArea(query.trim());
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching residences:', err);
      setError(err instanceof Error ? err.message : 'فشل في البحث عن العقارات');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchResidences,
    clearSearch,
  };
};
