
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { Bell, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const NotificationList: React.FC = () => {
  const { notifications, markNotificationAsRead } = useWarehouse();
  
  // Sort notifications by date (newest first) and read status (unread first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by read status
    if (a.is_read !== b.is_read) {
      return a.is_read ? 1 : -1;
    }
    // Then sort by date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  // Get notification icon based on content
  const getNotificationIcon = (message: string) => {
    if (message.includes('Низкий остаток')) {
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    } else if (message.includes('срок годности')) {
      return <Clock className="h-5 w-5 text-danger" />;
    } else if (message.includes('Прогноз')) {
      return <Info className="h-5 w-5 text-info" />;
    } else {
      return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'dd MMM, HH:mm', { locale: ru });
  };
  
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Нет уведомлений</p>
            <p className="text-muted-foreground text-sm text-center max-w-md">
              Здесь будут отображаться уведомления о низком уровне запасов, истекающих сроках годности и других важных событиях.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Уведомления</CardTitle>
          <Button variant="outline" size="sm">
            Отметить все как прочитанные
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={cn(
                "flex gap-4 p-4 border rounded-lg transition-colors",
                notification.is_read ? "bg-background" : "bg-primary/5 animate-pulse-light"
              )}
            >
              <div className="mt-0.5">
                {getNotificationIcon(notification.message)}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "mb-1",
                  !notification.is_read && "font-medium"
                )}>
                  {notification.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatNotificationTime(notification.created_at)}
                </p>
              </div>
              <div>
                {!notification.is_read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
