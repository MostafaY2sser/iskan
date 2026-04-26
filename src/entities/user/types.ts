
export type UserRole = 'admin' | 'property-owner' | 'recruiting-company';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  user_type?: string; // API user type (customer, owner, residence_company)
  avatar?: string;
  organizationId?: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
