
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Header } from '../components/Header';
import NotificationsAlert from '@/components/NotificationsAlert';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex mt-16 lg:mt-12">
        <Navigation />

        {/* <NotificationsAlert link={"/admin/admin-notifications"}/> */}

        <main className="flex min-h-[100vh] h w-full p-2 sm:p-6 pt-4 sm:pt-10 ml-0 lg:ml-64 bg-[#cccccc2f]">
          {/* <div className="institutional-container"> */}
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
