import axios from "axios";

async function testFetch() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXZpaF91c2VyXzE3ODE2Nzg5Mzc2ODRAZXhhbXBsZS5jb20iLCJleHAiOjE3ODE2Nzk4MzgsImlhdCI6MTc4MTY3ODkzOCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjdlZjg5YmMzLWJhY2QtNGVmYy05NTg1LTZhODgwZTRiZDEzYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im5hdmloIHVzZXIiLCJzdWIiOiJkZGZmZGNiMS0zM2U0LTRmZGItOTZkMS03NzE1NWJjNjhlZTEifSwiZW1haWwiOiJuYXZpaF91c2VyXzE3ODE2Nzg5Mzc2ODRAZXhhbXBsZS5jb20iLCJuYW1lIjoibmF2aWggdXNlciIsInJvbGxObyI6InJvbGxfMTc4MTY3ODkzNzY4NCIsImFjY2Vzc0NvZGUiOiJqdUZwaHYiLCJjbGllbnRJRCI6ImRkZmZkY2IxLTMzZTQtNGZkYi05NmQxLTc3MTU1YmM2OGVlMSIsImNsaWVudFNlY3JldCI6ImdqUmhKRFJ1eHFYRkdKdlgifQ.WKasKUMBd4ACR7UmBPm1huTF4m8XAtd1yeu2nZHSG2g";

  try {
    const response = await axios.get("http://4.224.186.213/evaluation-service/notifications", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10,
        page: 1
      }
    });
    console.log("Success! Notifications:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("Failed:", error?.response?.data || error?.message);
  }
}

testFetch();
