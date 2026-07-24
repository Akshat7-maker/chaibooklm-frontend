import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

// --- Request interceptor: default method to GET, attach the access token ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.method) {
    config.method = "get"; // default to GET whenever no method is passed
  }

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// --- Response interceptor: auto-refresh on TOKEN_EXPIRED, retry once ---
async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post<{ accessToken: string }>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    .then((res) => {
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ error?: string; code?: string }>) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "TOKEN_EXPIRED" &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // prevent infinite retry loops

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest); // retry the original request once
      } catch {
        setAccessToken(null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// --- Thin wrapper so callers get a clean error message, not a raw AxiosError ---
export async function apiFetch<T = unknown>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const res = await api.request<T>({ url: path, ...options });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = (err.response?.data as { error?: string })?.error || err.message;
      throw new Error(message);
    }
    throw err;
  }
}