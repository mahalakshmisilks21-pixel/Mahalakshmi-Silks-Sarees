"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/context/AdminContext";

/* ── Admin credentials (hardcoded — not via Supabase Auth) ── */
const ADMIN_EMAIL = "mahalakshmisilks21@gmail.com";
const ADMIN_PASSWORD = "secret123";

export type UserRole = "admin" | "customer";

export interface User {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ── Session keys for admin (admin bypasses Supabase Auth) ── */
const ADMIN_SESSION_KEY = "mahalakshmi_admin_session";

function saveAdminSession(user: User): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
  } catch { /* ignore */ }
}

function loadAdminSession(): User | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.role === "admin") return parsed as User;
    return null;
  } catch {
    return null;
  }
}

function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addCustomer } = useAdmin();

  // ── Restore session on mount ──
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      // 1. Check admin session first
      const adminUser = loadAdminSession();
      if (adminUser) {
        if (mounted) {
          setUser(adminUser);
          setLoading(false);
        }
        return;
      }

      // 2. Check Supabase session for customers
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const meta = session.user.user_metadata || {};
          setUser({
            name: meta.name || meta.full_name || "Customer",
            email: session.user.email || "",
            phone: meta.phone || "",
            role: "customer",
          });
        }
      } catch (err) {
        console.error("[Auth] Failed to restore session:", err);
      }

      if (mounted) setLoading(false);
    }

    restoreSession();

    // 3. Listen for auth state changes (login/logout from other tabs, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      // Don't overwrite admin session
      const adminUser = loadAdminSession();
      if (adminUser) return;

      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const customerName = meta.name || meta.full_name || "Customer";
        const customerEmail = session.user.email || "";
        const customerPhone = meta.phone || "";

        setUser({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          role: "customer",
        });

        // Add to admin customers list on sign-in (addCustomer deduplicates by email)
        if (event === "SIGNED_IN") {
          addCustomer({
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            orders: 0,
            spent: 0,
            joinDate: new Date().toISOString().split("T")[0],
            address: meta.address || "",
            status: "active",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Login ──
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimEmail = email.trim().toLowerCase();
      const trimPass = password.trim();

      // 1. Check admin credentials first (hardcoded)
      if (trimEmail === ADMIN_EMAIL && trimPass === ADMIN_PASSWORD) {
        const adminUser: User = { name: "Admin", email: ADMIN_EMAIL, phone: "", role: "admin" };
        setUser(adminUser);
        saveAdminSession(adminUser);
        console.log("[Auth] Admin login SUCCESS");
        return { success: true };
      }

      // 2. Customer login via Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimEmail,
          password: trimPass,
        });

        if (error) {
          console.log("[Auth] Supabase login FAILED:", error.message);
          return { success: false, error: error.message === "Invalid login credentials" ? "Invalid email or password" : error.message };
        }

        if (data.user) {
          const meta = data.user.user_metadata || {};
          const customerUser: User = {
            name: meta.name || meta.full_name || "Customer",
            email: data.user.email || trimEmail,
            phone: meta.phone || "",
            role: "customer",
          };
          setUser(customerUser);
          console.log("[Auth] Customer login SUCCESS:", customerUser.email);
          return { success: true };
        }

        return { success: false, error: "Login failed. Please try again." };
      } catch (err) {
        console.error("[Auth] Login exception:", err);
        return { success: false, error: "Something went wrong. Please try again." };
      }
    },
    []
  );

  // ── Register ──
  const register = useCallback(
    async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimEmail = email.trim().toLowerCase();
      const trimName = name.trim();
      const trimPhone = phone.trim();

      // Block admin email
      if (trimEmail === ADMIN_EMAIL) {
        return { success: false, error: "This email is reserved" };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimEmail,
          password,
          options: {
            data: {
              name: trimName,
              full_name: trimName,
              phone: trimPhone,
            },
          },
        });

        if (error) {
          console.log("[Auth] Supabase register FAILED:", error.message);
          if (error.message.includes("already registered")) {
            return { success: false, error: "An account with this email already exists" };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const customerUser: User = {
            name: trimName,
            email: data.user.email || trimEmail,
            phone: trimPhone,
            role: "customer",
          };
          setUser(customerUser);
          console.log("[Auth] Registration SUCCESS:", trimEmail);

          // Also add to admin customers list (for admin dashboard)
          addCustomer({
            name: trimName,
            email: trimEmail,
            phone: trimPhone,
            orders: 0,
            spent: 0,
            joinDate: new Date().toISOString().split("T")[0],
            address: "",
            status: "active",
          });

          return { success: true };
        }

        return { success: false, error: "Registration failed. Please try again." };
      } catch (err) {
        console.error("[Auth] Register exception:", err);
        return { success: false, error: "Something went wrong. Please try again." };
      }
    },
    [addCustomer]
  );

  // ── Google OAuth ──
  const loginWithGoogle = useCallback(async () => {
    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://mahalakshmi-silks.netlify.app/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      console.error("[Auth] Google OAuth error:", error.message);
    }
  }, []);

  // ── Logout ──
  const logout = useCallback(() => {
    // Clear admin session
    clearAdminSession();
    // Sign out from Supabase
    supabase.auth.signOut().catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        loginWithGoogle,
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
