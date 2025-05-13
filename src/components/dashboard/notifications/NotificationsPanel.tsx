
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Bell } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationPanel } from "./useNotificationPanel";
import NotificationHeader from "./NotificationHeader";
import NotificationsList from "./NotificationsList";

const NotificationsPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isOpen,
    loading,
    setIsOpen,
    formatDate,
    handleMarkAllAsRead,
    handleNotificationClick,
    setupNotificationsSubscription,
    fetchNotifications
  } = useNotificationPanel(user?.id);
  
  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = setupNotificationsSubscription();
    
    // Clean up subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

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
        <NotificationHeader 
          unreadCount={unreadCount} 
          onMarkAllAsRead={handleMarkAllAsRead} 
        />
        <NotificationsList 
          notifications={notifications}
          handleNotificationClick={handleNotificationClick}
          formatDate={formatDate}
          loading={loading}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
