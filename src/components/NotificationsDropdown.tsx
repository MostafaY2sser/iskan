import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { t } from 'i18next';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotificationsDropdown = ({ notificationsPageLink }) => {

    const { t } = useTranslation();
   const { notifications } = useNotifications();

  const unreadNotifications = notifications.filter(
    n => !n.read_status
  );

  const latestUnread = unreadNotifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative w-6 h-10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-[#2E4166]" />

          {unreadNotifications.length > 0 && (
            <span className="absolute top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 sm:w-96  p-2 bg-white">
        {latestUnread.length > 0 ? (
          latestUnread.map(n => (
            <DropdownMenuItem
              key={n.id}
              className="flex flex-col items-end gap-1 py-2 border-b border-gray-200"
            >
              <Link to={n.link}>
                <span className="font-medium text-sm">{n.message}</span>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
           {t('no_unread_notifications')}
          </div>
        )}

        <DropdownMenuItem className="text-center mt-2 mx-auto">
          <a href={notificationsPageLink} className="mx-auto">
           {t('view_all_notifications')}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default NotificationsDropdown;
