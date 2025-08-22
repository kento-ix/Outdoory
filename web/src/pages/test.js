// TestApi.js
import { useEffect } from "react";
import { getApiBaseUrl } from "../arc/config";

export default function Test() {
  useEffect(() => {
    const testApi = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/auth/auth.php?action=pong`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("API Test Success:", data);
      } catch (err) {
        console.error("API Test Error:", err);
      }
    };

    testApi();
  }, []);

  return <div>Check console for API test result</div>;
}
