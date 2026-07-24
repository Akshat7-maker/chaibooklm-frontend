"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api/auth";
import { setAccessToken, setOnAuthFailure } from "@/lib/api-client";
import type { User } from "@/types";
import { usePathname } from "next/navigation";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";
interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const pathname = usePathname();

  // check if on login or register page
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    // React to auth failures detected anywhere in the app (interceptor, etc.)
    setOnAuthFailure(() => {
      setUser(null);
      setStatus("unauthenticated");
    });
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        console.log("in use");
        // const { accessToken } = await authApi.refresh();
        // setAccessToken(accessToken);
        const { user } = await authApi.me();
        setUser(user);
        setStatus("authenticated");
      } catch {
        // not logged in — fine
        setStatus("unauthenticated");
      } finally {
        setIsLoading(false);
      }
    }
    if (!isAuthPage) restoreSession();
  }, []);

  async function login(credentials: { email: string; password: string }) {
    const { user } = await authApi.login(credentials);
    setUser(user);
    setStatus("authenticated");
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const { user } = await authApi.register(data);
    setUser(user);
    setStatus("authenticated");
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, status }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
