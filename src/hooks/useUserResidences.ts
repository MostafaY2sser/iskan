import { useState, useEffect } from 'react';
import { residencesApi } from '@/api/endpoints/residences';
import type { ResidenceOwnerResponse } from '@/api/types';

interface UseUserResidencesReturn {
  residences: ResidenceOwnerResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserResidences = (): UseUserResidencesReturn => {
  const [residences, setResidences] = useState<ResidenceOwnerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidences = async () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userResidences = await residencesApi.getResidencesByUserId(userId);
      setResidences(userResidences);
    } catch (err) {
      console.error('Error fetching residences:', err);
      setError('فشل في تحميل العقارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidences();
  }, []);

  return {
    residences,
    loading,
    error,
    refetch: fetchResidences,
  };
};
