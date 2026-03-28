import { api, ENDPOINTS } from "@/lib";

export async function getDashboardOverview() {
  return api.get(ENDPOINTS.DASHBOARD.OVERVIEW);
}

export async function getDashboardStreak() {
  return api.get(ENDPOINTS.DASHBOARD.STREAK);
}
