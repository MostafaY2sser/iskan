// /**
//  * Custom hook to fetch analytics data for dashboard
//  */

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/providers/AuthProvider';
// import { api } from '@/api/api';
// import type { ResidenceOwnerResponse, BookingResponse } from '@/api/types';

// export interface AnalyticsData {
//   viewsPercentage: number;
//   totalResidences: number;
//   viewedResidences: number;
//   totalCapacity: number;
//   capacityPercentage: number;
// }

// export const useAnalytics = () => {
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user, isAuthenticated } = useAuth();

//   const fetchAnalytics = async () => {
//     if (!isAuthenticated || !user?.id) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch user's residences
//       // const residences = await api.get<ResidenceOwnerResponse[]>(`/residence/user/${user.id}`);
      
//       // Fetch user's bookings
//       // const bookings = await api.get<BookingResponse[]>('/bookings/by/user');
      
//       // Calculate analytics
//       const totalResidences = residences?.length || 0;
//       const viewedResidences = bookings?.length || 0;
      
//       // Calculate total capacity (sum of all bed counts)
//       const totalCapacity = residences?.reduce((sum, residence) => 
//         sum + (residence.bed_count || 0), 0) || 0;

      
//       // Calculate views percentage (mock calculation based on bookings vs residences)
//       // const viewsPercentage = totalResidences > 0 ? 
//       //   Math.round((viewedResidences / totalResidences) * 100) : 0;
//       // ______________________________________________________________________________________
//       // Calculate the number of residences that have at least one booking
//       const bookedResidenceIds = new Set(
//         bookings?.map(b => b.residence_id)
//       );
//       const bookedResidencesCount = bookedResidenceIds.size;
//       const viewsPercentage = totalResidences > 0
//           ? Math.round((bookedResidencesCount / totalResidences) * 100)
//           : 0;
//       // ______________________________________________________________________________________
      
      
//       // Calculate capacity percentage (properties vs total capacity)
//       const capacityPercentage = totalCapacity > 0 ? 
//         Math.min(100, Math.round((totalResidences / totalCapacity) * 100)) : 0;

//       setAnalytics({
//         viewsPercentage,
//         totalResidences,
//         viewedResidences,
//         totalCapacity,
//         capacityPercentage,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
//       console.error('Analytics fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalytics();
//   }, [isAuthenticated, user?.id]);

//   const refetch = () => {
//     fetchAnalytics();
//   };

    

//   return {
//     analytics,
//     loading,
//     error,
//     refetch,
//   };
// };


















// * Custom hook to compute analytics data for dashboard based on residences and bookings */
// Without fetching data internally

import { useMemo } from 'react';
import type { ResidenceOwnerResponse, BookingResponse } from '@/api/types';

export interface AnalyticsData {
  viewsPercentage: number;
  totalResidences: number;
  viewedResidences: number;
  totalCapacity: number;
  capacityPercentage: number;
}

export const useAnalytics = (
  residences: ResidenceOwnerResponse[] = [],
  bookings: BookingResponse[] = []
): AnalyticsData => {

  return useMemo(() => {
    const totalResidences = residences.length;

    const bookedResidenceIds = new Set(
      bookings.map(b => b.residence_id)
    );
    const viewedResidences = bookedResidenceIds.size;

    const totalCapacity = residences.reduce(
      (sum, r) => sum + (r.bed_count || 0),
      0
    );

    const viewsPercentage =
      totalResidences > 0
        ? Math.round((viewedResidences / totalResidences) * 100)
        : 0;

    const capacityPercentage =
      totalCapacity > 0
        ? Math.min(100, Math.round((totalResidences / totalCapacity) * 100))
        : 0;

    return {
      viewsPercentage,
      totalResidences,
      viewedResidences,
      totalCapacity,
      capacityPercentage,
    };
  }, [residences, bookings]);
};
