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
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/auth",
      CREDENTIALS,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    console.log("Success:", response.data);
  } catch (error: any) {
    console.error("Failed:", error?.response?.data || error?.message);
  }
}

run();
