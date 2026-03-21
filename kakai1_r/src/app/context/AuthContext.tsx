import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "staff" | "stockman" | "cashier" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: 1, name: "Maria Santos", email: "admin@kakai.com", role: "admin", avatar: "MS" },
  { id: 2, name: "Jose Reyes", email: "staff@kakai.com", role: "staff", avatar: "JR" },
  { id: 3, name: "Carlos Dela Cruz", email: "stockman@kakai.com", role: "stockman", avatar: "CD" },
  { id: 4, name: "Ana Villanueva", email: "cashier@kakai.com", role: "cashier", avatar: "AV" },
  { id: 5, name: "Pedro Lim", email: "customer@kakai.com", role: "customer", avatar: "PL" },
];

export { mockUsers };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
