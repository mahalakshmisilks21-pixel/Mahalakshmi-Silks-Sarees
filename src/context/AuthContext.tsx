"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

/* ── Built-in Admin Credentials ── */
const ADMIN_EMAIL = "bharanidharanb.24mca@kongu.edu";
const ADMIN_PASSWORD = "secret123";

const STORAGE_KEY = "registered_users";

export type UserRole = "admin" | "customer";

export interface User {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // fail silently
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<StoredUser[]>(() => loadUsers());
  const { addCustomer } = useAdmin();

  // Persist registered users to localStorage
  useEffect(() => {
    saveUsers(registeredUsers);
  }, [registeredUsers]);

  const login = useCallback(
    (email: string, password: string) => {
      // Check admin credentials first
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setUser({ name: "Admin", email: ADMIN_EMAIL, phone: "", role: "admin" });
        return { success: true };
      }

      // Check registered customers
      const found = registeredUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        setUser({ name: found.name, email: found.email, phone: found.phone, role: "customer" });
        return { success: true };
      }
      return { success: false, error: "Invalid email or password" };
    },
    [registeredUsers]
  );

  const register = useCallback(
    (name: string, email: string, phone: string, password: string) => {
      if (email === ADMIN_EMAIL) {
        return { success: false, error: "This email is reserved" };
      }
      if (registeredUsers.some((u) => u.email === email)) {
        return { success: false, error: "An account with this email already exists" };
      }
      setRegisteredUsers((prev) => [...prev, { name, email, phone, password }]);
      setUser({ name, email, phone, role: "customer" });

      // Auto-add to admin customers list
      addCustomer({
        name,
        email,
        phone,
        orders: 0,
        spent: 0,
        joinDate: new Date().toISOString().split("T")[0],
        address: "",
        status: "active",
      });

      return { success: true };
    },
    [registeredUsers, addCustomer]
  );

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
