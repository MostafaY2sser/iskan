

import { residencesApi } from '@/api';
import { useEffect, useState } from 'react';

export const useApprovedResidences = (
  itemsPerPage = 9,
  minPrice?: number,
  maxPrice?: number,
  startDate?: string,  
  endDate?: string,
  area?: string 
) => {
  const [residences, setResidences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchResidences = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: any[] = [];

      if (area) {
        const res = await residencesApi.searchResidencesByArea(area);
        data = res; 
        setHasNextPage(false);

      // Price :-----
      }else if (minPrice !== undefined && maxPrice !== undefined) {
        data  = await residencesApi.getResidencesByPriceRange(
          minPrice,
          maxPrice
        );
        setHasNextPage(false);

      // Date :-----
      } else if (startDate && endDate) {
        data = await residencesApi.getApprovedResidencesByDateRange(startDate, endDate);
        setHasNextPage(false);

      // Pagination :----- 
      } else {
        const skip = (page - 1) * itemsPerPage;
        data = await residencesApi.getApprovedResidences(skip, itemsPerPage);

        setHasNextPage(data.length === itemsPerPage);
      }

      setResidences(data);

    } catch (e) {
      console.error(e);
      setError('Failed to fetch residences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidences();
  }, [page, minPrice, maxPrice, startDate, endDate, area]);

  return {
    residences,
    loading,
    error,
    page,
    setPage,
    hasNextPage,
  };
};
