
import React from "react";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
  formatDate: (dateString: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick, 
  formatDate 
}) => {
  // Get notification style based on type
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'border-l-green-500';
      case 'kyc':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Use the correct property names based on our updated Notification interface
  const notificationType = notification.type || notification.notification_type || '';
  const isRead = notification.is_read !== undefined ? notification.is_read : notification.read;
  
  return (
    <div 
      key={notification.id} 
      className={`p-4 border-l-4 ${getNotificationStyle(notificationType)} ${!isRead ? 'bg-muted/50' : ''} hover:bg-muted/20 cursor-pointer`}
      onClick={() => onClick(notification)}
    >
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-medium text-sm">{notification.title}</h5>
        <span className="text-xs text-muted-foreground">
          {formatDate(notification.created_at)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {notification.content || notification.message}
      </p>
    </div>
  );
};

export default NotificationItem;
