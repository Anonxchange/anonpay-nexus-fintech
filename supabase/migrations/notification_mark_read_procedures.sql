
-- Stored procedure to mark a notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true
  WHERE id = notification_id 
  AND user_id = auth.uid();
END;
$$;

-- Stored procedure to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
BEGIN
  -- Check if the user is modifying their own notifications or is an admin
  IF auth.uid() = user_id_param OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    UPDATE public.notifications
    SET read = true
    WHERE user_id = user_id_param AND read = false;
  END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO service_role;
