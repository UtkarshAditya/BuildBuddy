/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { authAPI, getAuthToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string,
    username: string,
    password: string,
    full_name: string
  ) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData as User);
        } catch (error) {
          console.error("Auth check failed:", error);
          authAPI.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authAPI.login(email, password);
    const userData = await authAPI.getCurrentUser();
    setUser(userData as User);
    return userData as User;
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    full_name: string
  ) => {
    // First, create the user account
    await authAPI.register(email, username, password, full_name);

    // Then, automatically log them in
    await authAPI.login(email, password);
    const userData = await authAPI.getCurrentUser();
    setUser(userData as User);
    return userData as User;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
