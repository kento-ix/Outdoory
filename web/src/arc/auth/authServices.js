// register async
export async function registerUser({ username, email, password }) {
  const res = await fetch("http://localhost/api/auth/auth.php?action=register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}


// login async
export async function loginUser({ username, password }) {
  const res = await fetch("http://localhost/api/auth/auth.php?action=login", {
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
    const response = await fetch("http://localhost/api/auth/auth.php?action=logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    return { ok: false, data: { error: error.message } };
  }
}