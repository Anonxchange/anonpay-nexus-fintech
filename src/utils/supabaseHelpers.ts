
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
    // Use RPC function to get user notifications
    const { data, error } = await supabase.rpc(
      'get_user_notifications',
      { p_user_id: userId }
    );
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    // Make sure we have an array to return
    return Array.isArray(data) ? data as Notification[] : [];
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
    console.error('Exception in markAllNotificationsAsRead:', error);
    return false;
  }
};
