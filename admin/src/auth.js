export const AUTH_TOKEN_KEY = "admin_auth_token";

export const setStoredToken = (token) => {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return atob(padded);
};

export const getTokenPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isAdminToken = (token) => {
  const payload = getTokenPayload(token);
  return String(payload?.role || "").toLowerCase() === "admin";
};