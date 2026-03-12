import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function googleLogin(idToken: string) {
  return api.post(ENDPOINTS.AUTH.GOOGLE, { idToken });
}

export async function getMe() {
  return api.get(ENDPOINTS.AUTH.ME);
}
