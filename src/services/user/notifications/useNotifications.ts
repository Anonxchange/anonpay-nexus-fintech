
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import { getNotifications, markAllAsRead, markAsRead } from './notificationApi';

export interface UseNotificationsOptions {
  limit?: number;
  autoRefresh?: boolean;
  initialFetch?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    limit = 10,
    autoRefresh = true,
    initialFetch = true,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(initialFetch);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: apiError } = await getNotifications(limit);
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch notifications');
      }
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.read_at).length);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error: apiError } = await markAsRead(id);
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to mark notification as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read_at: new Date().toISOString() } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error: apiError } = await markAllAsRead();
      
      if (apiError) {
        throw new Error(apiError.message || 'Failed to mark all notifications as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read_at: notification.read_at || new Date().toISOString() 
        }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchNotifications();
    }
    
    if (autoRefresh) {
      // Set up real-time listener
      const channel = supabase
        .channel('notifications-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications' 
          }, 
          (payload) => {
            // Add the new notification to the list
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev].slice(0, limit));
            if (!newNotification.read_at) {
              setUnreadCount(prev => prev + 1);
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [initialFetch, autoRefresh, limit]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refresh: fetchNotifications,
  };
}
