// hooks/useNotifications.ts
import { usersApi } from '@/api';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Notification {
  message: string;
  link: string;
  status_history_id: number;
  id: number;
  user_id: string;
  read_status: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // fetch notifications
    const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await usersApi.getNotifications();

        const data = Array.isArray(response) ? response : response.data;

        setNotifications(data ?? []);
    } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء جلب الإشعارات');
        setNotifications([]); 
    } finally {
        setLoading(false);
    }
    };


  useEffect(() => {
    fetchNotifications();
  }, [t]);

  
  // mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await usersApi.markNotificationAsRead(String(id));

      // update local state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read_status: true } : n))
      );
    } catch (err: any) {
      console.error(err.message || 'حدث خطأ أثناء تحديث حالة الإشعار');
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refetch: fetchNotifications,
  };
};
