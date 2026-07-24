import { apiFetch, setAccessToken } from "@/lib/api-client";
import type { User } from "@/types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      data
    });
    setAccessToken(res.accessToken);
    return res;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      data
    });
    setAccessToken(res.accessToken);
    return res;
  },

  logout: async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setAccessToken(null);
  },

  me: () => apiFetch<{ user: User }>("/auth/me"),

  refresh: () => apiFetch<{ accessToken: string }>("/auth/refresh",{method:"POST"})
};