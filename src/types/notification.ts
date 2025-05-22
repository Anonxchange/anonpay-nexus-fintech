
export type NotificationType = 'transaction' | 'system' | 'kyc' | 'security' | 'account' | 'giftcard';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  type: NotificationType;
}
