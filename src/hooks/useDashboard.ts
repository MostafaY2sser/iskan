/**
 * Dashboard data hook
 */

import { useState, useEffect } from 'react';
import { dashboardApi, type DashboardData, type DashboardKPIs } from '@/api/endpoints/dashboard';
import { useAuth } from '@/providers/AuthProvider';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchDashboardData = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardApi.getDashboardData(user.id);
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated, user?.id]);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export const useDashboardKPIs = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchKPIs = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const kpiData = await dashboardApi.getDashboardKPIs(user.id);
      setKpis(kpiData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KPI data');
      console.error('KPI data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, [isAuthenticated, user?.id]);

  const refetch = () => {
    fetchKPIs();
  };



  return {
    kpis,
    loading,
    error,
    refetch,
  };
};
