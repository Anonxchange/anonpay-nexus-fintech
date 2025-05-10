
// Main export file to maintain backward compatibility
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";
import { useCallback, useState, useEffect } from "react";
import { formatUserChannelName, useSupabaseChannel } from "@/utils/supabaseHelpers";

// Fetch user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Use the RPC function for better security and flexibility
    const { data, error } = await supabase.rpc(
      'get_user_notifications',
      { p_user_id: userId }
    );
    
    if (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
    
    return data as Notification[] || [];
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'mark_notification_read',
      { notification_id: notificationId }
    );
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(
      'mark_all_notifications_read',
      { user_id_param: userId }
    );
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
};

// Create a notification (primarily for admin use)
export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  notificationType: string = "general",
  actionLink?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        notification_type: notificationType,
        action_link: actionLink
      });
    
    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return false;
  }
};

// Custom hook for real-time notifications
export const useNotifications = (userId: string | undefined) => {
  const { toast } = useToast();
  
  // Create channel for notifications
  const setupNotificationsSubscription = useCallback(() => {
    if (!userId) return null;

    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}` 
        }, 
        (payload) => {
          console.log('New notification:', payload);
          // Cast to notification to get strongly typed data
          const notification = payload.new as Notification;
          
          // Build a rich notification
          let description = notification.message;
          if (notification.notification_type === 'transaction') {
            description = `💰 ${notification.message}`;
          } else if (notification.notification_type === 'kyc') {
            description = `🪪 ${notification.message}`;
          } else if (notification.notification_type === 'giftcard') {
            description = `🎁 ${notification.message}`;
          }
          
          // Show a toast notification
          toast({
            title: notification.title,
            description: description,
            action: notification.action_link ? {
              // Fix this part to use the correct Toast interface
              onClick: () => {
                window.location.href = notification.action_link || "/dashboard";
              },
              // Delete the "label" property as it's not supported
              // Or use appropriate properties depending on the Toast component API
              children: "View"
            } : undefined
          });
        }
      )
      .subscribe();
      
    return channel;
  }, [userId, toast]);
  
  return { setupNotificationsSubscription };
};

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
