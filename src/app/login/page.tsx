"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-80px)] flex items-center justify-center"><div className="text-maroon-600">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithGoogle, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isAdmin ? "/admin/dashboard" : redirect);
    }
  }, [isAuthenticated, isAdmin, redirect, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      // Role-based redirect handled by useAuth — isAdmin will be true on next render
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8 vintage-pattern-bg bg-gradient-to-b from-cream-100 to-cream-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="card-vintage p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl text-maroon-800 mb-2">Welcome Back</h1>
            <p className="text-gold-600 tracking-[0.3em] uppercase text-xs">Sign in to your account</p>
            <OrnamentDivider className="my-4" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-vintage pl-11" placeholder="you@example.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-vintage pl-11 pr-11" placeholder="Enter your password"
                  autoComplete="new-password"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-maroon-700" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-maroon-600 hover:text-maroon-800">Forgot password?</Link>
            </div>

            <button type="submit" disabled={submitting} className={`btn-primary w-full ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">OR</span></div>
            </div>

            <button type="button" onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gold-200 rounded-sm hover:bg-cream-100 transition-colors text-sm text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-maroon-600 hover:text-maroon-800 font-medium">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
