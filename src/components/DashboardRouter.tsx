import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Dashboard from '@/pages/Dashboard';
import CustomerDashboardNew from '@/pages/CustomerDashboardNew';
import { Navigate } from 'react-router-dom';
// import AdminBookings from '@/features/admin/pages/Bookings';


const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  // Route customers to customer dashboard with proper layout, others to regular dashboard
  if (user?.user_type === 'customer') {
    return <CustomerDashboardNew />;
  }
  if (user?.user_type === 'admin') {
    // return <AdminBookings />;
    return <Navigate to="/admin/dashboard"  />;
  }
  
  // Property owners, residence companies, and admins go to regular dashboard
  return <Dashboard />;
};

export default DashboardRouter;
