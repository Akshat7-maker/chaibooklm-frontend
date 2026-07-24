"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/api-client";
import type { User } from "@/types";

interface AuthContextValue {
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

  useEffect(() => {
    async function restoreSession() {
      try {
        const { accessToken } = await authApi.refresh();
        setAccessToken(accessToken);
        const { user } = await authApi.me();
        setUser(user);
      } catch {
        // not logged in — fine
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(credentials: { email: string; password: string }) {
    const { user } = await authApi.login(credentials);
    setUser(user);
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const { user } = await authApi.register(data);
    setUser(user);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
