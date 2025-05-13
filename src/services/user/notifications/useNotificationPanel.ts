
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "./notificationApi";

// Create hook for notification panel
export const useNotificationPanel = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch notifications on mount and when userId changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getUserNotifications(userId);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Subscribe to notification changes
    const channel = supabase
      .channel('notification-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}` 
        }, 
        () => {
          // Refresh notifications when any changes occur
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    const success = await markAllNotificationsAsRead(userId);
    if (success) {
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      // Update unread count
      setUnreadCount(0);
    }
  };
  
  return {
    notifications,
    loading,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead
  };
};
