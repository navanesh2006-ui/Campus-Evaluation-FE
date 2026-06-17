import axios from "axios";

const CREDENTIALS = {
  email: "navih_user_1781678937684@example.com",
  name: "navih user",
  rollNo: "roll_1781678937684",
  accessCode: "juFphv",
  clientID: "ddffdcb1-33e4-4fdb-96d1-77155bc68ee1",
  clientSecret: "gjRhJDRuxqXFGJvX",
};

async function run() {
  try {
    console.log("1. Authenticating...");
    const authRes = await axios.post(
      "http://4.224.186.213/evaluation-service/auth",
      CREDENTIALS,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    const token = authRes.data?.access_token;
    console.log("Token retrieved successfully.");

    console.log("2. Fetching notifications...");
    const response = await axios.get("http://4.224.186.213/evaluation-service/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10,
        page: 1
      }
    });
    console.log("Success! Notifications length:", response.data?.notifications?.length);
  } catch (error: any) {
    console.error("Failed:", error?.response?.status, error?.response?.data || error?.message);
  }
}

run();
