
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Bell, Check } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead, useNotifications } from "@/services/user/notificationService";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_link: string | null;
  notification_type: string;
}

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { setupNotificationsSubscription } = useNotifications(user?.id);

  // Format date to be more user-friendly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = setupNotificationsSubscription();
    
    // Clean up subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, setupNotificationsSubscription]);
  
  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      const success = await markAllNotificationsAsRead(user.id);
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
        toast({
          title: "All notifications marked as read"
        });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    await handleMarkAsRead(notification.id);
    
    // Navigate to action link if available
    if (notification.action_link) {
      window.location.href = notification.action_link;
    }
  };
  
  // Get notification style based on type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'border-l-green-500';
      case 'kyc':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-l-4 ${getNotificationStyle(notification.notification_type)} ${!notification.read ? 'bg-muted/50' : ''} hover:bg-muted/20 cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-sm">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
