
-- Create a stored procedure to get user notifications
CREATE OR REPLACE FUNCTION public.get_user_notifications(p_user_id UUID)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
BEGIN
  RETURN QUERY 
  SELECT json_build_object(
    'id', n.id,
    'user_id', n.user_id,
    'title', n.title,
    'message', n.message,
    'read', n.read,
    'created_at', n.created_at,
    'action_link', n.action_link,
    'notification_type', n.notification_type
  )
  FROM public.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_notifications TO service_role;
