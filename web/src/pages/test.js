import { getApiBaseUrl } from "../arc/config";
import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    console.log("API_BASE_URL (client):", getApiBaseUrl());
  }, []);
  return <div>Check Console</div>;
}
