import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useNotifications } from '@/hooks/useNotifications'
import { useTranslation } from 'react-i18next'


const NotificationsList = () => {
const { t } = useTranslation();
const { notifications, loading, error , markAsRead } = useNotifications();



const sortedNotifications = [...notifications].sort((a, b) => {

  // unread notifications come first 
  if (a.read_status !== b.read_status) {
    return a.read_status ? 1 : -1;
  }

  //  newest first
  return new Date(b.created_at) - new Date(a.created_at);
});




  return (
    <div className="bg-white p-4 sm:p-8 space-y-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-b-gray-300 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#2E4166]" />
          <h1 className="text-xl font-semibold text-[#2E4166]">
            {t('notifications')}
          </h1>
        </div>
      </div>

        {/* Notifications list */}
        {loading ? (
        <NotificationsSkeleton />
        ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-red-500">
            <p>{error}</p>
        </div>
        ) : notifications.length > 0 ? (
        <div className="space-y-3">
            {sortedNotifications.map(item => (
            <Link
                key={item.id}
                to={item.link}
                onClick={() => {
                    if (!item.read_status) {
                    markAsRead(item.id);
                    }
                }}
            >
                <Card
                className={cn(
                    'transition mb-4',
                    !item.read_status && 'border-primary bg-muted/40'
                )}
                >
                <CardContent className="p-4 flex justify-between gap-4">
                    <p className="text-xs sm:text-base font-semibold">
                    {item.message}
                    </p>
                    {!item.read_status && (
                    <span className="w-3 h-3 rounded-full bg-primary mt-2" />
                    )}
                </CardContent>
                </Card>
            </Link>
            ))}
        </div>
        ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mb-4 opacity-50" />
            <p>{t('no_notifications')} </p>
        </div>
        )}

    </div>
  )
}

export default NotificationsList



const NotificationsSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4 flex justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="w-3 h-3 bg-muted rounded-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
