import axios from "axios";

let bearerToken = "";

/**
 * Stores the Bearer token in memory for subsequent Log calls.
 */
export function setAuthToken(token: string): void {
  bearerToken = token;
}

/**
 * Sends a log message to the remote evaluation service.
 * Handles failures silently per strict requirements.
 */
export async function Log(
  stack: "frontend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string
): Promise<void> {
  // If no token is set yet, we still proceed but without the auth header, or we can exit if required.
  // The service expects Bearer <token> in Authorization header.
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (bearerToken) {
      headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser ? "" : "http://4.224.186.213";

    await axios.post(
      `${baseUrl}/evaluation-service/logs`,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      { headers }
    );
  } catch {
    // Handle error silently, do not throw, do not console.log
  }
}
