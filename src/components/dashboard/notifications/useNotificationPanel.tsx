
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { getUserNotifications, markNotificationAsRead, markAllAsRead } from "@/services/user/notifications";

export const useNotificationPanel = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  // Set up subscription to notifications
  const setupNotificationsSubscription = () => {
    if (!userId) return;
    
    return supabase
      .channel('notifications-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${userId}` 
        }, 
        () => {
          // Refresh notifications when any changes occur
          fetchNotifications();
        }
      )
      .subscribe();
  };

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await getUserNotifications(userId);
      setNotifications(data);
      setUnreadCount(data.filter(n => !(n.is_read || n.read)).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        title: "Failed to load notifications",
        variant: "destructive",
        description: "Please refresh the page and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    if (!userId) return;
    
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === id ? { ...n, is_read: true, read: true } : n
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
    if (!userId) return;
    
    try {
      const success = await markAllAsRead(userId);
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => ({ ...n, is_read: true, read: true }))
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
    const actionLink = notification.action_link;
    if (actionLink) {
      window.location.href = actionLink;
    }
  };

  return {
    notifications,
    unreadCount,
    isOpen,
    loading,
    setIsOpen,
    formatDate,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleNotificationClick,
    setupNotificationsSubscription,
    fetchNotifications
  };
};
