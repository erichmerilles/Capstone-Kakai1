import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kakai1_r/api";

export type UserRole = "admin" | "stockman" | "cashier" | "customer";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  full_name?: string;
  name?: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/validate_session.php`, {
          method: "GET",
          credentials: "include",
        });

        // FIX: If the user just isn't logged in, do not throw a scary error.
        if (response.status === 401 || response.status === 403) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.isAuthenticated) {
          setUser({
            ...data.user,
            name: data.user.full_name || data.user.username || "User",
            avatar: data.user.avatar || "👤",
            permissions: data.user.permissions || []
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
        // Only show this toast if it's an ACTUAL network failure, not just a logged-out user
        toast.error("Could not connect to the server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData: User) => {
    setUser({
      ...userData,
      name: userData.full_name || userData.username || "User",
      avatar: userData.avatar || "👤",
      permissions: userData.permissions || []
    });
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Network error during logout, but you have been signed out locally.");
    } finally {
      // FIX: ALWAYS clear the user from the React UI, even if the server request fails.
      // This prevents the user from getting "stuck" in the app if their wifi drops.
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}