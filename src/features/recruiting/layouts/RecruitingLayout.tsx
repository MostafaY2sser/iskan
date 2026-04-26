
import React from 'react';
import { Outlet } from 'react-router-dom';

const RecruitingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold">Recruiting Portal</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruitingLayout;
