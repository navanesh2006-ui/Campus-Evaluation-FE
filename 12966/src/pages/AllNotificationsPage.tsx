import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotificationStore } from "../state/notificationStore";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { FilterBar } from "../components/FilterBar";
import { Log } from "../middleware/logger";

export const AllNotificationsPage: React.FC = () => {
  const { state, dispatch } = useNotificationStore();
  const { notifications, readIds, currentPage } = state;
  const [limit, setLimit] = useState<number>(10);

  // Use the custom hook to handle fetching
  const { loading, error, refetch } = useNotifications({ limit });

  // Log page mount
  useEffect(() => {
    void Log(
      "frontend",
      "info",
      "page",
      "AllNotificationsPage mounted — triggering initial fetch"
    );
  }, []);

  // Handle marking a single notification as read
  const handleMarkAsRead = (id: string) => {
    if (!readIds.has(id)) {
      dispatch({ type: "MARK_AS_READ", payload: id });
      void Log(
        "frontend",
        "info",
        "page",
        `Notification marked as read — ID: ${id}`
      );
    }
  };

  // Handle marking all as read
  const handleMarkAllRead = () => {
    dispatch({ type: "MARK_ALL_READ" });
    void Log(
      "frontend",
      "info",
      "page",
      "All notifications marked as read"
    );
  };

  // Handle page changes
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatch({ type: "SET_PAGE", payload: page });
    void Log(
      "frontend",
      "info",
      "page",
      `Pagination changed — page set to ${page}`
    );
  };

  // Handle items limit changes
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    dispatch({ type: "SET_PAGE", payload: 1 }); // Reset to first page
  };

  // Determine total pages.
  // Note: the backend does not return total count, so we will dynamically show page navigation
  // based on whether we fetched a full page of items. If items fetched equals limit, we show
  // at least page + 1. Or we can use standard pagination with a reasonable count like 5 pages,
  // or dynamically toggle. Let's make it show up to current page + 1 if items length === limit.
  const hasMore = notifications.length === limit;
  const totalPages = hasMore ? currentPage + 1 : currentPage;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          All Notifications
        </Typography>
        {notifications.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={handleMarkAllRead}
            size="small"
            color="primary"
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {/* Filter and Limit controls */}
      <FilterBar limit={limit} onLimitChange={handleLimitChange} />

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        /* Error state with retry */
        <Alert
          severity="error"
          sx={{ my: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refetch}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : notifications.length === 0 ? (
        /* Empty state */
        <Card sx={{ my: 3, textAlign: "center", bgcolor: "#fafafa" }}>
          <CardContent sx={{ py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try changing your filters or checking back later.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={refetch}
              size="small"
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* List of notifications */
        <Box>
          {notifications.map((item) => (
            <NotificationCard
              key={item.ID}
              notification={item}
              isRead={readIds.has(item.ID)}
              onClick={() => handleMarkAsRead(item.ID)}
            />
          ))}

          {/* Pagination controls */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AllNotificationsPage;
