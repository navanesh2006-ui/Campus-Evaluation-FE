import axios from "axios";
import { getToken } from "../auth/token";
import { Log } from "../middleware/logger";

export interface Notification {
  ID: string;
  Type: "Result" | "Placement" | "Event";
  Message: string;
  Timestamp: string;
}

export interface GetNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: "Event" | "Result" | "Placement" | "";
}

/**
 * Fetches notifications from the remote evaluation service.
 * Appends Authorization Bearer token to headers.
 */
export async function getNotifications(
  params?: GetNotificationsParams
): Promise<Notification[]> {
  const limit = params?.limit ?? 10;
  const page = params?.page ?? 1;
  const typeFilter = params?.notification_type ?? "";

  // Log function entry with specific parameters
  await Log(
    "frontend",
    "info",
    "api",
    `Fetching notifications — params: limit=${limit}, page=${page}, type=${typeFilter || "All"}`
  );

  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token && token !== "PASTE_YOUR_TOKEN_HERE") {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser ? "" : "http://4.224.186.213";

    let notifications: Notification[] = [];

    if (limit <= 10) {
      // Direct single page fetch
      const queryParams: Record<string, string | number> = {
        limit,
        page,
      };
      if (typeFilter) {
        queryParams["notification_type"] = typeFilter;
      }

      const response = await axios.get<{ notifications: Notification[] }>(
        `${baseUrl}/evaluation-service/notifications`,
        {
          headers,
          params: queryParams,
        }
      );
      notifications = response.data?.notifications ?? [];
    } else {
      // Chunked fetching to circumvent the backend's strict 10-items limit.
      // E.g. limit=50 triggers 5 parallel requests of limit=10.
      const chunkSize = 10;
      const chunksCount = Math.ceil(limit / chunkSize);
      const startApiPage = (page - 1) * chunksCount + 1;

      const promises = Array.from({ length: chunksCount }).map((_, index) => {
        const apiPage = startApiPage + index;
        const queryParams: Record<string, string | number> = {
          limit: chunkSize,
          page: apiPage,
        };
        if (typeFilter) {
          queryParams["notification_type"] = typeFilter;
        }

        return axios.get<{ notifications: Notification[] }>(
          `${baseUrl}/evaluation-service/notifications`,
          {
            headers,
            params: queryParams,
          }
        );
      });

      const responses = await Promise.all(promises);
      const combined = responses.flatMap((res) => res.data?.notifications ?? []);
      notifications = combined.slice(0, limit);
    }
    
    await Log(
      "frontend",
      "info",
      "api",
      `Notifications API returned ${notifications.length} items`
    );

    return notifications;
  } catch (error: any) {
    const errMsg = error?.message ?? "Unknown error";
    await Log(
      "frontend",
      "error",
      "api",
      `Notifications API call failed: ${errMsg}`
    );
    return [];
  }
}
