
import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout title="Property Owner Dashboard" subtitle="Manage your properties and view performance metrics.">
      <div className="text-center text-[#7F8C8D]">
        <p>Property Owner Dashboard content will be added here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
