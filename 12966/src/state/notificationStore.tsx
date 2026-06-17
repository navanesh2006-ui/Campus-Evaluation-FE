import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Notification } from "../api/notifications";
import { Log } from "../middleware/logger";

export interface NotificationState {
  notifications: Notification[];
  readIds: Set<string>;
  loading: boolean;
  error: string | null;
  currentPage: number;
  selectedType: "Event" | "Result" | "Placement" | "";
  priorityN: number;
}

export type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_TYPE_FILTER"; payload: "Event" | "Result" | "Placement" | "" }
  | { type: "SET_PRIORITY_N"; payload: number };

const LOCAL_STORAGE_KEY = "readNotificationIds";

const getInitialReadIds = (): Set<string> => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch {
    // Handle error silently
  }
  return new Set<string>();
};

const initialState: NotificationState = {
  notifications: [],
  readIds: getInitialReadIds(),
  loading: false,
  error: null,
  currentPage: 1,
  selectedType: "",
  priorityN: 10,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  // Log the action to the state package at debug level.
  // We run it asynchronously to not block reducer execution.
  let logMessage = `State action dispatched: ${action.type}`;
  if (action.type === "MARK_AS_READ") {
    logMessage += ` — ID: ${action.payload}`;
  } else if (action.type === "SET_NOTIFICATIONS") {
    logMessage += ` — Count: ${action.payload.length}`;
  } else if (action.type === "SET_PAGE") {
    logMessage += ` — Page: ${action.payload}`;
  } else if (action.type === "SET_TYPE_FILTER") {
    logMessage += ` — Type: ${action.payload || "All"}`;
  } else if (action.type === "SET_PRIORITY_N") {
    logMessage += ` — N: ${action.payload}`;
  }

  void Log("frontend", "debug", "state", logMessage);

  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };

    case "MARK_AS_READ": {
      const updatedRead = new Set(state.readIds);
      updatedRead.add(action.payload);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(updatedRead)));
      } catch {
        // Silently catch
      }
      return { ...state, readIds: updatedRead };
    }

    case "MARK_ALL_READ": {
      const updatedRead = new Set(state.readIds);
      state.notifications.forEach((item) => updatedRead.add(item.ID));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(updatedRead)));
      } catch {
        // Silently catch
      }
      return { ...state, readIds: updatedRead };
    }

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_TYPE_FILTER":
      return { ...state, selectedType: action.payload, currentPage: 1 };

    case "SET_PRIORITY_N":
      return { ...state, priorityN: action.payload };

    default:
      return state;
  }
}

interface NotificationContextProps {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Log on mount
  useEffect(() => {
    void Log("frontend", "info", "state", "NotificationProvider component mounted");
  }, []);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStore = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    void Log("frontend", "fatal", "state", "useNotificationStore called outside NotificationProvider");
    throw new Error("useNotificationStore must be used within NotificationProvider");
  }
  return context;
};
