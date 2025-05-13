
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

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
