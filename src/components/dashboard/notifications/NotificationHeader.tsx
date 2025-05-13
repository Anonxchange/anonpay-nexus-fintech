
import React from "react";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onMarkAllAsRead
}) => {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h4 className="text-sm font-medium">Notifications</h4>
      {unreadCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMarkAllAsRead}
          className="text-xs h-8"
        >
          Mark all as read
        </Button>
      )}
    </div>
  );
};

export default NotificationHeader;
