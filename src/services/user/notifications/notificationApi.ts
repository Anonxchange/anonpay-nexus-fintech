
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

// This function gets user notifications from transactions instead
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Query transactions table instead of notifications
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Map transaction data to notification format
    const notifications: Notification[] = (data || []).map(transaction => ({
      id: transaction.id,
      user_id: transaction.user_id,
      title: `Transaction: ${transaction.type}`,
      content: `${transaction.type} transaction of ${transaction.amount} - Status: ${transaction.status}`,
      created_at: transaction.created_at,
      is_read: false, // Default to unread
      type: transaction.type as any,
      action_link: `/dashboard?tab=history`
    }));
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Mark a single notification as read (simulated since we're using transactions)
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Since we don't have a real notifications table, we'll simulate success for now
    // In a real implementation, you would update the notifications table
    console.log('Marking notification as read:', notificationId);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

// Mark all user notifications as read (simulated)
export const markAllAsRead = async (userId: string): Promise<boolean> => {
  try {
    // Since we don't have a real notifications table, we'll simulate success for now
    // In a real implementation, you would update all notifications for this user
    console.log('Marking all notifications as read for user:', userId);
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};
