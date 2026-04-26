
import { UserRole } from '@/entities/user/types';

export const createRouteGuard = (allowedRoles: UserRole[]) => {
  return (userRole: UserRole | null): boolean => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };
};

export const routeGuards = {
  admin: createRouteGuard(['admin']),
  propertyOwner: createRouteGuard(['admin', 'property-owner']),
  recruiting: createRouteGuard(['admin', 'recruiting-company']),
  authenticated: createRouteGuard(['admin', 'property-owner', 'recruiting-company']),
};
