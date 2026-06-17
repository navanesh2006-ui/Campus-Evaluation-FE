import { getNotifications } from "../src/api/notifications";
import { getTopNNotifications } from "../src/utils/priorityInbox";
import { initializeAuth, getToken } from "../src/auth/token";

async function run() {
  console.log("Initializing auth...");
  try {
    const token = await initializeAuth();
    console.log("Resolved Token:", token ? `${token.substring(0, 20)}...` : "None");
    console.log("getToken() returns:", getToken() ? `${getToken().substring(0, 20)}...` : "None");
    
    console.log("Fetching notifications...");
    const notifications = await getNotifications({ limit: 100 });
    console.log("Total notifications fetched:", notifications.length);

    const top10 = getTopNNotifications(notifications, 10);

    process.stdout.write("\n=== TOP 10 PRIORITIZED NOTIFICATIONS ===\n");
    top10.forEach((item, index) => {
      process.stdout.write(
        `#${index + 1} | [${item.Type}] (Weight: ${
          item.Type === "Placement" ? 3 : item.Type === "Result" ? 2 : 1
        }) | ${item.Timestamp} | ${item.Message}\n`
      );
    });
    process.stdout.write("========================================\n\n");
  } catch (error: any) {
    console.error("Script Error:", error.message || error);
  }
}

run();
