
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '@/entities/user/types';
import { authApi, RegistrationResponse } from '@/api/endpoints/auth';
import type { 
  CustomerRegister, 
  OwnerRegister, 
  ResidenceCompanyRegister 
} from '@/api/types';
import { 
  createUserFromRegistration, 
  validateRegistrationData, 
  formatRegistrationData 
} from '@/utils/auth';
import { performLogout } from '@/utils/authErrorHandler';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  refreshAuth: () => void;
  registerCustomer: (userData: CustomerRegister) => Promise<RegistrationResponse>;
  registerOwner: (userData: OwnerRegister) => Promise<RegistrationResponse>;
  registerResidenceCompany: (userData: ResidenceCompanyRegister) => Promise<RegistrationResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SWITCH_ROLE'; payload: User['role'] };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'SWITCH_ROLE':
      return {
        ...state,
        user: state.user ? { ...state.user, role: action.payload } : null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Mock users for development
const mockUsers: Record<string, User> = {
  'admin@housing.com': {
    id: '1',
    email: 'admin@housing.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'owner@housing.com': {
    id: '2',
    email: 'owner@housing.com',
    firstName: 'Property',
    lastName: 'Owner',
    role: 'property-owner',
    organizationId: 'org-1',
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'recruiter@housing.com': {
    id: '3',
    email: 'recruiter@housing.com',
    firstName: 'Recruiting',
    lastName: 'Manager',
    role: 'recruiting-company',
    organizationId: 'org-2',
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('housing_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Use real API for authentication
      const authResponse = await authApi.login({ email, password });
      
      // Determine user role from the login response
      let userRole: User['role'] = 'property-owner'; // Default role
      
      // Map API user types to internal roles
      switch (authResponse.user_type) {
        case 'customer':
          userRole = 'property-owner'; // Map customer to property-owner for now
          break;
        case 'owner':
          userRole = 'property-owner';
          break;
        case 'residence_company':
          userRole = 'property-owner'; // Map residence company to property-owner for now
          break;
        default:
          userRole = 'property-owner';
      }
      
      // Create a basic user object with the determined role and user_type
      const basicUser: User = {
        id: authResponse.user_id,
        email: email,
        firstName: 'User', // We don't have this info from login
        lastName: '', // We don't have this info from login
        role: userRole,
        user_type: authResponse.user_type, // Store the original API user type
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // If user is a customer, fetch additional customer details
      if (authResponse.user_type === 'customer') {
        try {
          // Import customersApi dynamically to avoid circular dependencies
          const { customersApi } = await import('@/api/endpoints/customers');
          const customerDetails = await customersApi.getMyDetails();
          
          // Update user object with customer details
          const enrichedUser = {
            ...basicUser,
            firstName: customerDetails.responsible_person || 'User',
            lastName: customerDetails.company_name || '',
          };
          
          localStorage.setItem('housing_user', JSON.stringify(enrichedUser));
          dispatch({ type: 'AUTH_SUCCESS', payload: enrichedUser });
          return enrichedUser;
        } catch (error) {
          console.warn('Failed to fetch customer details, using basic user info:', error);
          // Fall back to basic user if customer details fetch fails
          localStorage.setItem('housing_user', JSON.stringify(basicUser));
          dispatch({ type: 'AUTH_SUCCESS', payload: basicUser });
          return basicUser;
        }
      } else {
        localStorage.setItem('housing_user', JSON.stringify(basicUser));
        dispatch({ type: 'AUTH_SUCCESS', payload: basicUser });
        return basicUser;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Authentication failed' });
      throw error; // Re-throw to allow handling in components
    }
  };

  const logout = () => {
    // Use centralized logout function
    performLogout();
    
    // Update auth state
    dispatch({ type: 'LOGOUT' });
  };

  const switchRole = (role: User['role']) => {
    if (state.user) {
      const updatedUser = { ...state.user, role };
      localStorage.setItem('housing_user', JSON.stringify(updatedUser));
      dispatch({ type: 'SWITCH_ROLE', payload: role });
    }
  };

  const refreshAuth = () => {
    const storedUser = localStorage.getItem('housing_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Registration methods
  const registerCustomer = async (userData: CustomerRegister): Promise<RegistrationResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Validate registration data
      const validation = validateRegistrationData(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Format data for API
      const formattedData = formatRegistrationData(userData);
      
      // Call API
      const response = await authApi.registerCustomer(formattedData);
      
      dispatch({ type: 'AUTH_ERROR', payload: null }); // Clear any previous errors
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const registerOwner = async (userData: OwnerRegister): Promise<RegistrationResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Validate registration data
      const validation = validateRegistrationData(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Format data for API
      const formattedData = formatRegistrationData(userData);
      
      // Call API
      const response = await authApi.registerOwner(formattedData);
      
      dispatch({ type: 'AUTH_ERROR', payload: null }); // Clear any previous errors
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const registerResidenceCompany = async (userData: ResidenceCompanyRegister): Promise<RegistrationResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Validate registration data
      const validation = validateRegistrationData(userData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Format data for API
      const formattedData = formatRegistrationData(userData);
      
      // Call API
      const response = await authApi.registerResidenceCompany(formattedData);
      
      dispatch({ type: 'AUTH_ERROR', payload: null }); // Clear any previous errors
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        switchRole,
        refreshAuth,
        registerCustomer,
        registerOwner,
        registerResidenceCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
