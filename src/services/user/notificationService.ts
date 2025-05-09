
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";
import { fetchUserNotifications } from "@/utils/supabaseHelpers";

// Fetch user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const data = await fetchUserNotifications(userId);
    return data;
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Use direct SQL execution with type casting to avoid type issues
    const { error } = await supabase.rpc('mark_notification_read', { 
      notification_id: notificationId 
    }) as { data: any, error: any };
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    // Use direct SQL execution with type casting to avoid type issues
    const { error } = await supabase.rpc('mark_all_notifications_read', { 
      user_id_param: userId 
    }) as { data: any, error: any };
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
};

// Create a hook for real-time notifications
export const useNotifications = (userId: string | undefined) => {
  const { toast } = useToast();
  
  const setupNotificationsSubscription = () => {
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
          // Cast to any to avoid type errors
          const notification = payload.new as any;
          
          // Show a toast notification
          toast({
            title: notification.title || 'New Notification',
            description: notification.message || 'You have a new notification',
          });
        }
      )
      .subscribe();
      
    return channel;
  };
  
  return { setupNotificationsSubscription };
};
