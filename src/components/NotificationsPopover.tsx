import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

export function NotificationsPopover() {
  const { isAuthenticated, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();

  // Ne pas afficher si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return null;
  }

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} jour(s)`;
    return `${Math.floor(diffInSeconds / 2592000)} mois`;
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-100"
            title={`${unreadCount} notifications non lues`}
          >
            <Bell className="h-4 w-4 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium min-w-[20px]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Notifications ({notifications.length})</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllNotificationsAsRead}
              className="text-xs hover:bg-gray-200"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={`/article/${notification.articleId}`}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`block p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <MessageSquare className="h-4 w-4 mt-1 text-blue-600" />
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="text-blue-600">{notification.commenterName}</span> a commenté
                          </p>
                          <p className="text-xs font-medium text-gray-800 mt-1 truncate">
                            📄 "{notification.articleTitle}"
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-md p-2 mt-2">
                        <p className="text-xs text-gray-700 italic line-clamp-2">
                          "{notification.message}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-600">
                          Cliquer pour voir l'article
                        </span>
                        {!notification.read && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
    </div>
  );
}