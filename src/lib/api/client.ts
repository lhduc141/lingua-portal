import axios from "axios";
import { ROUTES } from "@/config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const ACCESS_TOKEN_COOKIE = "lp_access_token";
export const REFRESH_TOKEN_COOKIE = "lp_refresh_token";

// COOKIES HELPERS
export function getCookies(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : null;
}
export function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires`;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true, // use
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTORS
api.interceptors.request.use(
  (config) => {
    const token = getCookies(ACCESS_TOKEN_COOKIE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Access token hết hạn → thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${BASE_URL}/auth/login/refresh`, {}, { withCredentials: true });

        // Backend set cookie mới qua Set-Cookie header
        // Retry request gốc
        return api(originalRequest);
      } catch {
        deleteCookie(ACCESS_TOKEN_COOKIE);
        deleteCookie(REFRESH_TOKEN_COOKIE);

        window.location.href = ROUTES.HOME; // Chuyển về LandingPage
      }
    }

    return Promise.reject(error);
  }
);
