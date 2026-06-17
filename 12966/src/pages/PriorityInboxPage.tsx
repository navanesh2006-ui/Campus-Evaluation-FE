import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import { useNotificationStore } from "../state/notificationStore";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { PrioritySelector } from "../components/PrioritySelector";
import { getTopNNotifications } from "../utils/priorityInbox";
import { Log } from "../middleware/logger";

export const PriorityInboxPage: React.FC = () => {
  const { state, dispatch } = useNotificationStore();
  const { notifications, readIds, priorityN, selectedType } = state;

  // We fetch up to 100 notifications to have a large enough pool for computing top N
  const { loading, error, refetch } = useNotifications({ limit: 100 });

  // Log on page mount
  useEffect(() => {
    void Log(
      "frontend",
      "info",
      "page",
      "PriorityInboxPage mounted — computing priority inbox"
    );
  }, []);

  // Compute prioritized top N items
  const prioritizedNotifications = getTopNNotifications(notifications, priorityN);

  // Handle single notification mark as read
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

  // Handle filter changes (optional type filter for Priority page)
  const handleTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "Event" | "Result" | "Placement" | "";
    dispatch({ type: "SET_TYPE_FILTER", payload: value });
    void Log(
      "frontend",
      "info",
      "page",
      `Priority filter changed — notification_type set to ${value || "All"}`
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <StarIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          Priority Inbox
        </Typography>
      </Box>

      {/* Info panel explaining priority algorithm */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#e3f2fd", // Light blue background
          borderLeft: "5px solid #1976d2",
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <InfoIcon color="primary" sx={{ mt: 0.2 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
            How Priority Inbox Works
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Notifications are ranked based on their category weight: 
            <strong> Placement (Weight 3)</strong> &gt; 
            <strong> Result (Weight 2)</strong> &gt; 
            <strong> Event (Weight 1)</strong>. 
            Newer notifications act as tie-breakers when weights are identical.
          </Typography>
        </Box>
      </Paper>

      {/* Controls: Toggle N and Optional Type Filter */}
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
        <PrioritySelector />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="priority-type-filter-label">Filter By Type</InputLabel>
          <Select
            labelId="priority-type-filter-label"
            id="priority-type-filter-select"
            value={selectedType}
            label="Filter By Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        /* Error state */
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
      ) : prioritizedNotifications.length === 0 ? (
        /* Empty state */
        <Card sx={{ my: 3, textAlign: "center", bgcolor: "#fafafa" }}>
          <CardContent sx={{ py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No high-priority notifications found
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
        /* Ranked Notifications List */
        <Box>
          {prioritizedNotifications.map((item, index) => (
            <NotificationCard
              key={item.ID}
              notification={item}
              isRead={readIds.has(item.ID)}
              rank={index + 1}
              onClick={() => handleMarkAsRead(item.ID)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PriorityInboxPage;
