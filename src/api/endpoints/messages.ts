/**
 * Messages API endpoints
 */

import { api } from '../api';
import type {
  Message,
  MessageListResponse,
  MessageDetailResponse,
} from '../types';

export const messagesApi = {
  // Get all messages
  getAllMessages: (): Promise<MessageListResponse> => {
    return api.get('/messages');
  },

  // Get message by ID
  getMessageById: (messageId: number): Promise<MessageDetailResponse> => {
    return api.get(`/messages/${messageId}`);
  },

  // Mark message as read
  markAsRead: (messageId: number): Promise<{ message: string }> => {
    return api.patch(`/messages/${messageId}/read`);
  },

  // Mark message as unread
  markAsUnread: (messageId: number): Promise<{ message: string }> => {
    return api.patch(`/messages/${messageId}/unread`);
  },

  // Delete message
  deleteMessage: (messageId: number): Promise<{ message: string }> => {
    return api.delete(`/messages/${messageId}`);
  },

  // Get unread message count
  getUnreadCount: (): Promise<{ count: number }> => {
    return api.get('/messages/unread-count');
  },

  // Mark all messages as read
  markAllAsRead: (): Promise<{ message: string }> => {
    return api.patch('/messages/mark-all-read');
  },


};

