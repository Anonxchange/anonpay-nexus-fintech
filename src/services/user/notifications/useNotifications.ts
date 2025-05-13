
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";
import { ToastActionElement } from "@/components/ui/toast";

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
          
          // Show a toast notification with fixed action type
          toast({
            title: notification.title,
            description: description,
            action: notification.action_link ? {
              children: "View"
            } as ToastActionElement : undefined
          });
        }
      )
      .subscribe();
      
    return channel;
  }, [userId, toast]);
  
  return { setupNotificationsSubscription };
};
