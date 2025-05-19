
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { toast as toastAction } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { markNotificationAsRead, markAllNotificationsAsRead } from "./notificationApi";

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        const typedNotifications = data as Notification[];
        setNotifications(typedNotifications || []);
        setUnreadCount(typedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          variant: "destructive",
          title: "Failed to load notifications",
          description: "Please refresh the page and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up realtime updates for notifications
    const channel = supabase
      .channel('notifications-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}` 
        }, 
        (payload) => {
          const { eventType, new: newNotification, old: oldNotification } = payload;
          
          if (eventType === 'INSERT') {
            setNotifications(prev => [newNotification as Notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notifications
            toastAction({
              title: newNotification.title || 'New Notification',
              description: newNotification.message
            });
          } 
          else if (eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => 
              n.id === newNotification.id ? {...n, ...newNotification as Notification} : n
            ));
            
            // Update unread count if read status changed
            if (oldNotification.read !== newNotification.read) {
              setUnreadCount(prev => newNotification.read ? prev - 1 : prev + 1);
            }
          }
          else if (eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== oldNotification.id));
            if (!oldNotification.read) {
              setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);
  
  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    const success = await markAllNotificationsAsRead(userId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    }
  };
  
  return {
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead
  };
};
