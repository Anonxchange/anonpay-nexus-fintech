
export type NotificationType = 'transaction' | 'system' | 'kyc' | 'security' | 'account' | 'giftcard';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean; // Changed from 'read' to 'is_read'
  type: NotificationType;
  notification_type?: string; // Added for backward compatibility
  message?: string; // Added for backward compatibility
  read?: boolean; // Added for backward compatibility
  action_link?: string; // Added for potential navigation
}
