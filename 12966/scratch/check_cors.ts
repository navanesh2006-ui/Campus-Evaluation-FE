import axios from "axios";

async function run() {
  try {
    const response = await axios.options("http://4.224.186.213/evaluation-service/notifications", {
      headers: { Origin: "http://localhost:3000" }
    });
    console.log("OPTIONS headers:", response.headers);
  } catch (error: any) {
    try {
      const response = await axios.get("http://4.224.186.213/evaluation-service/notifications", {
        headers: { Origin: "http://localhost:3000" }
      });
      console.log("GET headers:", response.headers);
    } catch (err: any) {
      console.error("GET failed:", err?.response?.headers || err?.message);
    }
  }
}

run();
