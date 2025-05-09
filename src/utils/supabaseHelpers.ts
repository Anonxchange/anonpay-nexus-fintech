
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect } from "react";

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
