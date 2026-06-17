import React, { useEffect } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Notification } from "../api/notifications";
import { Log } from "../middleware/logger";

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  rank?: number;
  onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isRead,
  rank,
  onClick,
}) => {
  const { ID, Type, Message, Timestamp } = notification;

  // Log on render if notification is new/unread
  useEffect(() => {
    if (!isRead) {
      void Log(
        "frontend",
        "debug",
        "component",
        `Unread notification card rendered — ID: ${ID}, Type: ${Type}`
      );
    }
  }, [isRead, ID, Type]);

  // Determine colors based on type
  const getTypeStyles = () => {
    switch (Type) {
      case "Placement":
        return {
          borderColor: "#1976d2", // Blue
          chipColor: "primary",
        };
      case "Result":
        return {
          borderColor: "#2e7d32", // Green
          chipColor: "success",
        };
      case "Event":
        return {
          borderColor: "#ed6c02", // Orange
          chipColor: "warning",
        };
      default:
        return {
          borderColor: "#757575", // Grey
          chipColor: "default",
        };
    }
  };

  const { borderColor, chipColor } = getTypeStyles();

  // Card click handler
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        mb: 2,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        borderLeft: isRead ? "5px solid #bdbdbd" : `5px solid ${borderColor}`,
        backgroundColor: isRead ? "#f5f5f5" : "#ffffff",
        transition: "all 0.2s ease-in-out",
        "&:hover": onClick
          ? {
              boxShadow: 3,
              transform: "translateY(-2px)",
              backgroundColor: isRead ? "#eeeeee" : "#fbfbfb",
            }
          : {},
        opacity: isRead ? 0.75 : 1,
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {rank !== undefined && (
              <Chip
                label={`#${rank}`}
                size="small"
                variant="filled"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "text.primary",
                  color: "background.paper",
                }}
              />
            )}
            <Chip
              label={Type}
              color={chipColor as any}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
            {!isRead && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#d32f2f", // Red unread dot
                  display: "inline-block",
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: "medium" }}
          >
            {Timestamp}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontWeight: isRead ? "normal" : "bold",
            color: isRead ? "text.secondary" : "text.primary",
            wordBreak: "break-word",
          }}
        >
          {Message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
