import { getNotifications } from "../src/api/notifications";
import { getTopNNotifications } from "../src/utils/priorityInbox";
import { Log } from "../src/middleware/logger";
import { initializeAuth } from "../src/auth/token";

async function runStage1() {
  // Set auth token dynamically for API calls and logs
  await initializeAuth();

  void Log(
    "frontend",
    "info",
    "utils",
    "Stage 1 Script — Initiating fetch of all notifications"
  );

  try {
    // Fetch notifications (limit 100 to get a large set)
    const notifications = await getNotifications({ limit: 100 });

    void Log(
      "frontend",
      "info",
      "utils",
      `Stage 1 Script — Fetched ${notifications.length} notifications. Computing top 10...`
    );

    // Compute top 10 using priority inbox utility
    const top10 = getTopNNotifications(notifications, 10);

    // Print results clearly using Log()
    void Log(
      "frontend",
      "info",
      "utils",
      "=== TOP 10 PRIORITY INBOX NOTIFICATIONS ==="
    );

    for (let i = 0; i < top10.length; i++) {
      const item = top10[i];
      void Log(
        "frontend",
        "info",
        "utils",
        `Rank #${i + 1} | [${item.Type}] | ${item.Timestamp} | Msg: ${item.Message}`
      );
    }

    void Log(
      "frontend",
      "info",
      "utils",
      "=== END OF STAGE 1 PRIORITY INBOX ==="
    );
  } catch (error: any) {
    void Log(
      "frontend",
      "error",
      "utils",
      `Stage 1 Script execution failed: ${error?.message ?? "Unknown error"}`
    );
  }
}

// Execute script
runStage1();
