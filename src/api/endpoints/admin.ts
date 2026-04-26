/**
 * Admin API endpoints
 */

import { api } from '../api';
import type {
  UserResponse,
  BookingResponse,
} from '../types';

export const adminApi = {

   // 📊 Get dashboard statistics
  getDashboardStats: async () => {
    return api.get('/admin/dashboard-stats');
  },
  
  // Get all users
  getAllUsers: (status?: string): Promise<UserResponse[]> => {
    return api.get('/admin/users', status ? { status } : undefined);
  },

  // Update user status
  updateUserStatus: (userId: number, status: string, reason?: string): Promise<void> => {
    const body: any = { status };

    if (status !== 'approved' && reason) {
      body.reason = reason;
    }

    return api.patch(`/admin/users/${userId}/status`, body);
  },


  // Get all approved bookings
  getAllApprovedBookings: (): Promise<BookingResponse[]> => {
    return api.get('/admin/bookings/approved');
  },

  // Get all pending bookings
  getAllPendingBookings: (): Promise<BookingResponse[]> => {
    return api.get('/admin/bookings/pending-admin-approval');
  },

  // Mark booking as paid
  markBookingPaid: (bookingId: number): Promise<void> => {
    return api.patch(`/admin/bookings/${bookingId}/paid`);
  },


  // Admin approve booking
  adminUpdateBookingStatus: (
    bookingId: number,
    status: "approved" | "rejected"
  ): Promise<void> => {
    return api.patch(`/admin/bookings/${bookingId}/admin-approval`, {
      admin_status: status,
    });
  },




  // Get all pending residences
  getAllPendingResidences: () => {
    return api.get('/admin/residences/pending');
  },

  // Get all residences with optional status filter
  getAllResidences: (status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return api.get(`/residence/all${query}`);
  },


  // update residence status
  updateResidenceStatus: ( residenceId: number, status: string, reason?: string ) => {
      const payload: any = { status };
      if (status === 'rejected' || status === 'changes_requested') {
        payload.reason = reason;
      }
      return api.patch(`/admin/residences/${residenceId}/status`,payload);
  },


  // Get all special requests
  getAllSpecialRequests: () => {
    return api.get('/admin/special_requests');
  },

  // Get single special request
  getSingleSpecialRequests: (requestId: number) => {
    return api.get(`/admin/special_requests/${requestId}`);
  },

  // Update special request status
  updateSpecialRequestStatus: (requestId: number, status: string) => {
    return api.patch(`/admin/special_requests/${requestId}`, { status });
  },

  // delete special request
  deleteSpecialRequest: (requestId: number) => {
    return api.delete(`/admin/special_requests/${requestId}`);
  },

  // Get All Agents
  getAllAgents: (): Promise<UserResponse[]> => {
    return api.get('/agents');
  },

  // Create New Agent
  AddNEwAgent: (agentData: { name: string; contact_info: string }) => {
    return api.post('/agents', agentData);
  },

  // Get Agent By ID
  getAgentById: (id: number) => {
    return api.get(`/agents/${id}`);
  },

  // Update Agent By ID
  updateAgent: (id: number, agentData: { name: string; contact_info: string }) => {
    return api.patch(`/agents/${id}`, agentData );
  },

  // Delete Agent By ID
  deleteAgent: (id: number) => {
    return api.delete(`/agents/${id}`);
  },


  // Assign Agent to Property
  assignAgent: (bookingId: number, agentId: number): Promise<any> => {
    return api.post(`/bookings/${bookingId}/assign-agent`, {
      agent_id: agentId,
    });
  },


  // Get Customer by ID
  getCustomerById: (id: string) => {
    return api.get(`/customers/${id}`);
  },


  // Get Customer by ID
  getBooingDetailsById: (id: string) => {
    return api.get(`/bookings/${id}`);
  },


  // Get Customer Details by ID
  getCustomerDetailsById: (id: string) => {
    return api.get(`/customers/${id}`);
  },


  // Get Owner Details by ID
  getOwnerDetailsById: (id: string) => {
    return api.get(`/owners/${id}/details`);
  },

  
  // Get Residences by Owner(User) ID
  getResidencesByUserId: (userId: string) => {
    return api.get(`/residence/user/${userId}`);
  },


  // Get  Commission Rate
  CommissionRate: () => {
    return api.get(`/admin/commission-rate`);
  },
 
  // Update Commission Rate
  updateCommissionRate: (data: { commission_rate: number }) => {
    return api.patch('/admin/commission-rate', data);
  },

  // Clicks Analytics
  getResidencesClicksAnalytics: () => {
    return api.get('/admin/residences/clicks-analytics');
  },



};
