import { useEffect, useCallback } from "react";
import { useNotificationStore } from "../state/notificationStore";
import { getNotifications } from "../api/notifications";
import { Log } from "../middleware/logger";

export interface UseNotificationsProps {
  limit?: number;
}

/**
 * Hook to manage notification fetching.
 * Fires a network request on mount and whenever the type filter, page, or limit changes.
 */
export function useNotifications({ limit = 10 }: UseNotificationsProps = {}) {
  const { state, dispatch } = useNotificationStore();
  const { currentPage, selectedType } = state;

  // Initialise logging on mount
  useEffect(() => {
    void Log(
      "frontend",
      "info",
      "hook",
      "useNotifications hook initialised — subscribing to store"
    );
  }, []);

  const fetchNotifications = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    void Log(
      "frontend",
      "info",
      "hook",
      `Fetching due to filter change — params: limit=${limit}, page=${currentPage}, type=${selectedType || "All"}`
    );

    try {
      const items = await getNotifications({
        limit,
        page: currentPage,
        notification_type: selectedType,
      });

      dispatch({ type: "SET_NOTIFICATIONS", payload: items });
      if (items.length === 0 && selectedType !== "") {
        // If API returned nothing or errored (API client returns empty array on error)
        // Note: we can choose to set an error if they are empty under specific error conditions,
        // but we'll stick to updating notifications.
      }
    } catch (error: any) {
      const errMsg = error?.message ?? "Failed to fetch notifications";
      dispatch({ type: "SET_ERROR", payload: errMsg });
      void Log("frontend", "error", "hook", `useNotifications fetch failed — error: ${errMsg}`);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [limit, currentPage, selectedType, dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications: state.notifications,
    loading: state.loading,
    error: state.error,
    refetch: fetchNotifications,
  };
}
