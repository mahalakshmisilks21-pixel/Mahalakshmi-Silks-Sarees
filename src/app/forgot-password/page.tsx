"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
    } catch {
      // Even if it fails, show success to avoid email enumeration
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 vintage-pattern-bg bg-gradient-to-b from-cream-100 to-cream-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="card-vintage p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl text-maroon-800 mb-2">
              {submitted ? "Check Your Email" : "Forgot Password"}
            </h1>
            <p className="text-gold-600 tracking-[0.3em] uppercase text-xs">
              {submitted ? "Reset link sent" : "Reset your password"}
            </p>
            <OrnamentDivider className="my-4" />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <p className="text-gray-600 mb-2">
                  If an account exists for <strong className="text-maroon-800">{email}</strong>,
                  you&apos;ll receive a password reset link shortly.
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Please check your inbox and spam folder.
                </p>

                  <div className="bg-green-50 border border-green-200 rounded-sm p-4 mb-6">
                    <p className="text-sm text-green-700">
                      If this email is registered, a password reset link has been sent.
                      Check your inbox and spam folder.
                    </p>
                  </div>

                <Link
                  href="/login"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm mb-5 flex items-start gap-2"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-vintage pl-11"
                        placeholder="you@example.com"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className={`btn-primary w-full ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {submitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                  Remember your password?{" "}
                  <Link href="/login" className="text-maroon-600 hover:text-maroon-800 font-medium">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
