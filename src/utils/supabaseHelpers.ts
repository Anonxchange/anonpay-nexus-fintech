
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
 * Calls a Supabase RPC function to get user notifications
 * @param userId The user ID
 * @returns Array of notifications
 */
export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Use the proper typing for the RPC call
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
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
