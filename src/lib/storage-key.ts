// Cookie Keys
// Dùng với document.cookie (setCookie / getCookies / deleteCookie)
export const COOKIE_KEYS = {
  ACCESS_TOKEN: "lp_access_token",
  REFRESH_TOKEN: "lp_refresh_token",
} as const;

// Zustand Persist Keys
// Dùng trong store persist config { name: ... }
export const STORE_KEYS = {
  AUTH: "lp_auth",
} as const;

// Session Storage Keys
// Dùng với sessionStorage.getItem / setItem / removeItem
export const SESSION_KEYS = {
  PLACEMENT: "lp_placement_session",
} as const;
