
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";

// Fetch user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
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
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
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
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
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
