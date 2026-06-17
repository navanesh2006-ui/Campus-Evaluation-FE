import axios from "axios";

async function testAuth() {
  const email = `navih_user_${Date.now()}@example.com`;
  const name = "Navih User";
  const mobileNo = String(Math.floor(1000000000 + Math.random() * 9000000000));
  const githubUsername = `navih-github-${Date.now()}`;
  const rollNo = `ROLL_${Date.now()}`;
  const accessCode = "juFphv";

  console.log("1. Registering user...");
  try {
    const regRes = await axios.post("http://4.224.186.213/evaluation-service/register", {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      accessCode,
    });
    console.log("Registration Success:", regRes.data);

    const { clientID, clientSecret } = regRes.data;

    console.log("2. Fetching Bearer token...");
    const authRes = await axios.post("http://4.224.186.213/evaluation-service/auth", {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret,
    });
    console.log("Auth Success:", authRes.data);
  } catch (error: any) {
    console.error("Failure:", error?.response?.data || error?.message);
  }
}

testAuth();
