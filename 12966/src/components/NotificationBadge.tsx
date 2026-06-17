import React, { useEffect } from "react";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotificationStore } from "../state/notificationStore";
import { Log } from "../middleware/logger";

/**
 * Renders an MUI Badge with the unread notifications count.
 */
export const NotificationBadge: React.FC = () => {
  const { state } = useNotificationStore();
  const { notifications, readIds } = state;

  // Compute unread count
  const unreadCount = notifications.filter((item) => !readIds.has(item.ID)).length;

  useEffect(() => {
    void Log(
      "frontend",
      "debug",
      "component",
      `NotificationBadge rendered — unreadCount: ${unreadCount}`
    );
  });

  return (
    <Badge badgeContent={unreadCount} color="error">
      <NotificationsIcon />
    </Badge>
  );
};

export default NotificationBadge;
