

import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/entities/user/types';

interface RoleContextType {
  currentRole: UserRole | null;
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (requiredRole: UserRole) => boolean;
  getRoleDisplayName: (role: UserRole) => string;
  getRoleColor: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const roleHierarchy: Record<UserRole, number> = {
  'admin': 3,
  'property-owner': 2,
  'recruiting-company': 1,
};

const roleDisplayNames: Record<UserRole, string> = {
  'admin': 'Administrator',
  'property-owner': 'Property Owner',
  'recruiting-company': 'Recruiting Company',
};

const roleColors: Record<UserRole, string> = {
  'admin': 'role-admin',
  'property-owner': 'role-property-owner',
  'recruiting-company': 'role-recruiting',
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const currentRole = user?.user_type || user?.role || null;

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    //  Admin (by user_type or role) has all permissions
    if (user.user_type === 'admin' || user.role === 'admin') return true;
    
    // Check specific permissions
    return user.permissions?.some(
      (permission: any) => permission.resource === resource && permission.action === action
    ) || false;
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    const role = user.user_type || user.role;
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const getRoleDisplayName = (role: UserRole): string => roleDisplayNames[role];
  const getRoleColor = (role: UserRole): string => roleColors[role];

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        hasPermission,
        canAccess,
        getRoleDisplayName,
        getRoleColor,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
