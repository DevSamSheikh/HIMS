import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface NotificationPanelProps {
  notifications?: Notification[];
  onClose?: () => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

const NotificationPanel = ({
  notifications = [
    {
      id: "1",
      title: "New Patient Registration",
      description: "John Doe has been registered as a new patient",
      time: "5 minutes ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Appointment Reminder",
      description: "You have an appointment with Sarah Johnson at 2:00 PM",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Lab Results Available",
      description: "Lab results for patient #12345 are now available",
      time: "3 hours ago",
      read: true,
      type: "success",
    },
    {
      id: "4",
      title: "System Update",
      description: "System will undergo maintenance at 11:00 PM tonight",
      time: "5 hours ago",
      read: true,
      type: "error",
    },
  ],
  onClose = () => {},
  onMarkAllAsRead = () => {},
  onClearAll = () => {},
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="font-semibold text-lg">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
        <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
          <Check className="h-4 w-4 mr-1" />
          Mark all as read
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="p-0">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className={`p-4 ${notification.read ? "opacity-70" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.read ? "bg-gray-300 dark:bg-gray-700" : "bg-blue-500"}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <div
                        className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getTypeStyles(notification.type)}`}
                      >
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationPanel;
