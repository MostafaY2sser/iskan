import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationsAlertProps {
  intervalMinutes?: number;
  link: string;
}

const NotificationsAlert = ({ intervalMinutes = 60, link }: NotificationsAlertProps) => {
  const { notifications } = useNotifications();
  const [showPopup, setShowPopup] = useState(false);
  const [canShow, setCanShow] = useState(true); 
  const { t } = useTranslation();
  const unreadNotifications = notifications.filter(n => !n.read_status);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const showPopupOnce = () => {
    if (!canShow || unreadNotifications.length === 0) return;

    setShowPopup(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
      setCanShow(false);
    }, 10000);
  };

  useEffect(() => {
    if (unreadNotifications.length === 0) return;

    showPopupOnce();

    intervalRef.current = setInterval(() => {
      setCanShow(true); 
      showPopupOnce();
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [unreadNotifications, intervalMinutes]);

  if (unreadNotifications.length === 0 || !showPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border rounded-lg shadow-lg p-4 flex flex-col gap-2 animate-fade-in">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-[#2E4166]">{t('notifications')}</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setShowPopup(false);
            setCanShow(false); 
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        لديك {unreadNotifications.length} {t('unread_notification')}
      </p>

      <Button size="sm" className="mt-2" onClick={() => (window.location.href = link)}>
       {t('view_notifications')}
      </Button>
    </div>
  );
};

export default NotificationsAlert;
