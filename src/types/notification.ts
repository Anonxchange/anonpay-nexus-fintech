
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_link?: string | null;
  notification_type: string;
}
