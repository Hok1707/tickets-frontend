import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from './components/AdminDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import UserDashboard from './components/UserDashboard';
import StaffDashboard from './components/StaffDashboard';
import { Role } from '@/types/common';

const DashboardPage: React.FC = () => {
  const { role } = useAuth();

  if (!role) {
    return <p>Loading...</p>;
  }

  const renderDashboard = () => {
    switch (role) {
      case Role.ADMIN:
        return <AdminDashboard />;
      case Role.ORGANIZER:
        return <OrganizerDashboard />;
      case Role.STAFF:
        return <StaffDashboard />;
      case Role.USER:
        return <UserDashboard />;
      default:
        return <p>Unauthorized</p>;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default DashboardPage;