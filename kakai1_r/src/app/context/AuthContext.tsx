import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = "http://localhost/kakai1_r/api";

export type UserRole = "admin" | "stockman" | "cashier" | "customer";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  avatar: string;
  permissions: string[]; // <-- 1. Added this so TypeScript knows to expect the array
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

        const data = await response.json();

        if (response.ok && data.isAuthenticated) {
          // Map database fields to the React UI and provide fallbacks
          setUser({
            ...data.user,
            name: data.user.full_name || data.user.username || "User",
            avatar: data.user.avatar || "👤",
            permissions: data.user.permissions || [] // <-- 2. Safely store the DB permissions
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData: User) => {
    // When logging in, ensure we also apply the fallbacks
    setUser({
      ...userData,
      name: userData.name || (userData as any).full_name || userData.username || "User",
      avatar: userData.avatar || "👤",
      permissions: userData.permissions || [] // <-- 3. Safely store permissions on login
    });
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Added the missing useAuth custom hook here
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}