// lib/auth.ts

const API_BASE = ""; 
// empty means same-origin (/api/auth/login, /api/auth/signup)

/* =========================
   LOGIN
========================= */
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Login failed");
  }

  const data = await res.json();

  // store JWT token
  localStorage.setItem("token", data.token);

  return data;
}

/* =========================
   SIGN UP
========================= */
export async function signup(
  email: string,
  password: string,
  fullName?: string
) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Signup failed");
  }

  return await res.json();
}

/* =========================
   AUTH HELPERS
========================= */
export function logout() {
  localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}
