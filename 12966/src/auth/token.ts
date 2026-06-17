import axios from "axios";
import { setAuthToken } from "../middleware/logger";

// The configured token or access code (keep original export for compatibility)
export const BEARER_TOKEN = " juFphv";

// Local cache for the resolved JWT token
let resolvedToken = "";

// Pre-registered client credentials for automatic token resolution
const CREDENTIALS = {
  email: "navih_user_1781678937684@example.com",
  name: "navih user",
  rollNo: "roll_1781678937684",
  accessCode: "juFphv",
  clientID: "ddffdcb1-33e4-4fdb-96d1-77155bc68ee1",
  clientSecret: "gjRhJDRuxqXFGJvX",
};

/**
 * Helper to check if a token string is a valid JWT.
 */
function isJWT(token: string): boolean {
  return token.trim().startsWith("eyJ");
}

/**
 * Returns the stored Bearer token.
 * Fallback to resolved token if the configured one is not a JWT.
 */
export function getToken(): string {
  const trimmed = BEARER_TOKEN.trim();
  if (isJWT(trimmed)) {
    return trimmed;
  }
  return resolvedToken || trimmed;
}

/**
 * Dynamically resolves the auth token if the configured one is an access code.
 */
export async function initializeAuth(): Promise<string> {
  const trimmed = BEARER_TOKEN.trim();
  if (isJWT(trimmed)) {
    resolvedToken = trimmed;
    setAuthToken(trimmed);
    return trimmed;
  }

  // If a JWT is already cached, return it
  if (resolvedToken) {
    return resolvedToken;
  }

  const isBrowser = typeof window !== "undefined";
  const baseUrl = isBrowser ? "" : "http://4.224.186.213";

  try {
    const response = await axios.post<{ access_token: string }>(
      `${baseUrl}/evaluation-service/auth`,
      {
        email: CREDENTIALS.email,
        name: CREDENTIALS.name,
        rollNo: CREDENTIALS.rollNo,
        accessCode: CREDENTIALS.accessCode,
        clientID: CREDENTIALS.clientID,
        clientSecret: CREDENTIALS.clientSecret,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data?.access_token;
    if (token) {
      resolvedToken = token;
      setAuthToken(token);
      return token;
    }
  } catch (error) {
    // Fail silently and fallback
  }

  setAuthToken(trimmed);
  return trimmed;
}
