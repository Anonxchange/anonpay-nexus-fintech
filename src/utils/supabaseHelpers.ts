
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

/**
 * Custom hook to manage Supabase realtime channel subscriptions
 * @param channel RealtimeChannel instance or null
 */
export const useSupabaseChannel = (channel: RealtimeChannel | null) => {
  useEffect(() => {
    // Return cleanup function to unsubscribe when component unmounts
    return () => {
      if (channel) {
        console.log("Removing channel subscription");
        try {
          channel.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from channel:", error);
        }
      }
    };
  }, [channel]);
};

/**
 * Formats a realtime subscription channel name for a specific user
 * @param prefix The channel name prefix
 * @param userId The user ID
 * @returns A unique channel name
 */
export const formatUserChannelName = (prefix: string, userId: string): string => {
  return `${prefix}:${userId}`;
};

/**
 * Handles errors from Supabase queries
 * @param error The error object
 * @param fallbackMessage Default message if error doesn't have a message
 * @returns Formatted error message
 */
export const handleSupabaseError = (error: any, fallbackMessage: string = "An error occurred"): string => {
  // If it's a Supabase error object with a message
  if (error?.message) {
    return error.message;
  }
  
  // If it's a string
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return fallbackMessage;
};

/**
 * Fetches user notifications from the database
 * @param userId The user ID
 * @returns Array of notifications
 */
export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Use transactions as notifications since we don't have a dedicated notifications table
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    // Map transactions to notifications
    const notifications: Notification[] = data?.map(tx => ({
      id: tx.id,
      user_id: tx.user_id,
      title: `Transaction: ${tx.type}`,
      content: `${tx.type} transaction of ${tx.amount} - Status: ${tx.status}`,
      created_at: tx.created_at,
      is_read: false,
      type: 'transaction'
    })) || [];
    
    return notifications;
  } catch (error) {
    console.error('Exception in fetchUserNotifications:', error);
    return [];
  }
};

/**
 * Marks a notification as read
 * @param notificationId The notification ID to mark as read
 * @returns Whether the operation was successful
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // Since we don't have a notifications table, we'll just log this action
    console.log(`Marking notification ${notificationId} as read`);
    return true;
  } catch (error) {
    console.error('Exception in markNotificationAsRead:', error);
    return false;
  }
};

/**
 * Marks all notifications as read for a user
 * @param userId The user ID
 * @returns Whether the operation was successful
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    // Since we don't have a notifications table, we'll just log this action
    console.log(`Marking all notifications for user ${userId} as read`);
    return true;
  } catch (error) {
    console.error('Exception in markAllNotificationsAsRead:', error);
    return false;
  }
};
