import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

// Single place the rest of the app hooks into "auth has definitively failed"
let onAuthFailure: (() => void) | null = null;
export function setOnAuthFailure(cb: () => void) {
  onAuthFailure = cb;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.method) config.method = "get";
  if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});

// The ONLY function in the whole app allowed to call /auth/refresh.
async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise; // single-flight: dedupe concurrent callers

  refreshPromise = axios
    .post<{ accessToken: string }>(`${API_URL}auth/refresh`, {}, { withCredentials: true })
    .then((res) => {
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// Codes that mean "token missing/expired — worth trying a refresh"
const RETRYABLE_CODES = new Set(["NO_TOKEN", "TOKEN_EXPIRED"]);

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ error?: string; code?: string }>) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const code = error.response?.data?.code;

    if (
      error.response?.status === 401 &&
      code &&
      RETRYABLE_CODES.has(code) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch {
        setAccessToken(null);
        onAuthFailure?.(); // let AuthProvider react, don't reach into it directly
        return Promise.reject(error);
      }
    }

    // 401 with a non-retryable code (TOKEN_INVALID, USER_NOT_FOUND) → hard fail, no retry
    if (error.response?.status === 401) {
      setAccessToken(null);
      onAuthFailure?.();
    }

    return Promise.reject(error);
  }
);

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