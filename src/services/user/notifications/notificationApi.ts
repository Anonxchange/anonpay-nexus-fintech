
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

// Get user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Since we don't have the get_user_notifications RPC function,
    // Let's query the transactions table for notifications
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    // Map transactions to notifications format
    const notifications: Notification[] = data?.map(tx => ({
      id: tx.id,
      user_id: tx.user_id,
      title: `Transaction: ${tx.type}`,
      content: `${tx.type} transaction of ${tx.amount} - Status: ${tx.status}`,
      created_at: tx.created_at,
      is_read: false,
      type: 'transaction',
      // For backwards compatibility
      message: `${tx.type} transaction of ${tx.amount} - Status: ${tx.status}`,
      read: false
    })) || [];
    
    return notifications;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Since we don't have a notifications table, we'll just log this action
    console.log(`Marking notification ${notificationId} as read`);
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId: string): Promise<boolean> => {
  try {
    // Since we don't have a notifications table, we'll just log this action
    console.log(`Marking all notifications for user ${userId} as read`);
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

// Alias for markAllAsRead for backward compatibility
export const markAllNotificationsAsRead = markAllAsRead;

// Update notification preferences
export const updateNotificationPreferences = async (
  userId: string, 
  preferences: Record<string, boolean>
): Promise<boolean> => {
  try {
    // This would normally update user preferences in a database
    console.log(`Updating notification preferences for user ${userId}:`, preferences);
    return true;
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return false;
  }
};

// Subscribe to realtime notifications
export const subscribeToNotifications = (userId: string, callback: (notification: Notification) => void) => {
  // This is a placeholder for setting up a real-time subscription
  console.log(`Setting up notification subscription for user ${userId}`);
  
  // Return an unsubscribe function
  return () => {
    console.log(`Cleaning up notification subscription for user ${userId}`);
  };
};
