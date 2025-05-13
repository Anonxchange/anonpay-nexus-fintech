
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

interface NotificationsListProps {
  notifications: Notification[];
  handleNotificationClick: (notification: Notification) => void;
  formatDate: (dateString: string) => string;
  loading: boolean;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  handleNotificationClick,
  formatDate,
  loading
}) => {
  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Loading notifications...
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      {notifications.length > 0 ? (
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No notifications yet
        </div>
      )}
    </ScrollArea>
  );
};

export default NotificationsList;
