import { getApiBaseUrl } from "../config";

console.log("API URL By function:", getApiBaseUrl());
console.log("API URL Direct:", process.env.REACT_APP_API_URL);


// register async
export async function registerUser({ username, email, password }) {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/auth.php?action=register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

// login async
export async function loginUser({ username, password }) {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/auth.php?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

// logout
export async function logoutUser() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/auth.php?action=logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    return { ok: false, data: { error: error.message } };
  }
}
