
/**
 * Dashboard API endpoints
 */

import { api } from '../api';
import type {
  BookingResponse,
  MonthlyAnalyticsResponse,
  ResidenceOwnerResponse,
} from '../types';

// Dashboard KPI data interface
export interface DashboardKPIs {
  // totalProperties: number;
  monthlyRevenue: number;
  activeBookings: number;
  totalRevenue: number;
}

// Dashboard data interface
export interface DashboardData {
  kpis: DashboardKPIs;
  monthlyAnalytics: MonthlyAnalyticsResponse[];
  recentBookings: BookingResponse[];
  userResidences: ResidenceOwnerResponse[];
}

//  Clicks Analytics 
export interface ClicksAnalyticsResponse {
  total_clicks_across_all_my_residences: number;
  top_5_residences: { id: number; clicks: number }[];
}

export const dashboardApi = {
  // Get dashboard KPI data
  getDashboardKPIs: (
    monthlyAnalytics: MonthlyAnalyticsResponse[],
    bookings: BookingResponse[]
  ): DashboardKPIs => {
    try {
      const activeBookings =
        bookings?.filter(booking => booking.admin_status === 'approved').length || 0;

      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthData = monthlyAnalytics.find(analytics =>
        analytics.month_year.startsWith(currentMonth)
      );

      const monthlyRevenue = currentMonthData?.total_amount || 0;

      const totalRevenue =
        monthlyAnalytics?.reduce((sum, analytics) => sum + analytics.total_amount, 0) || 0;

      return {
        monthlyRevenue,
        activeBookings,
        totalRevenue,
      };
    } catch (error) {
      console.error('Error calculating dashboard KPIs:', error);
      return {
        monthlyRevenue: 0,
        activeBookings: 0,
        totalRevenue: 0,
      };
    }
  },

  // Get monthly analytics for revenue chart
  getMonthlyAnalytics: (): Promise<MonthlyAnalyticsResponse[]> => {
    return api.get('/bookings/me/monthly-analytics');
  },

  // Get recent bookings for table
  getRecentBookings: (): Promise<BookingResponse[]> => {
    return api.get('/bookings/by/user');
  },

  // Get user residences
  getUserResidences: (userId: string): Promise<ResidenceOwnerResponse[]> => {
    return api.get(`/residence/user/${userId}`);
  },

  // Get complete dashboard data
  getDashboardData: async (userId: string): Promise<DashboardData> => {
  try {
    const [monthlyAnalytics, recentBookings, userResidences] = await Promise.all([
      dashboardApi.getMonthlyAnalytics(),
      dashboardApi.getRecentBookings(),
      dashboardApi.getUserResidences(userId),
    ]);

    const kpis = dashboardApi.getDashboardKPIs(monthlyAnalytics, recentBookings);

    return {
      kpis,
      monthlyAnalytics,
      recentBookings,
      userResidences,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      kpis: {
        monthlyRevenue: 0,
        activeBookings: 0,
        totalRevenue: 0,
      },
      monthlyAnalytics: [],
      recentBookings: [],
      userResidences: [],
    };
  }
},


  // Get Clicks Analytics  :---------------
  getClicksAnalytics: async (): Promise<ClicksAnalyticsResponse> => {
    try {
      const response = await api.get<ClicksAnalyticsResponse>('/owners/me/clicks-analytics');
      return response;
    } catch (error) {
      console.error('Error fetching clicks analytics:', error);
      return {
        total_clicks_across_all_my_residences: 0,
        top_5_residences: [],
      };
    }
  },

};
