"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Phone, Check, X, AlertCircle, Shield } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { useAuth } from "@/context/AuthContext";

/* ── Validation helpers ── */
function validateName(name: string): string | null {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 50) return "Name must be under 50 characters";
  if (!/^[a-zA-Z\s.''-]+$/.test(name.trim())) return "Name can only contain letters, spaces, and basic punctuation";
  return null;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  // Strict email: user part, @, domain, TLD (min 2 chars)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) return "Enter a valid email address";
  // Block obviously fake/test domains
  const domain = email.split("@")[1]?.toLowerCase();
  const blockedDomains = ["test.com", "example.com", "fake.com", "mail.com", "temp.com", "abc.com", "xyz.com"];
  if (domain && blockedDomains.includes(domain)) return "Please use a real email address";
  // No consecutive dots in domain
  if (domain && /\.\./.test(domain)) return "Invalid email domain";
  return null;
}

function validatePhone(phone: string): string | null {
  if (!phone.trim()) return null; // Phone is optional
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Accept: 10 digits, or +91 followed by 10 digits
  if (/^\+91\d{10}$/.test(cleaned)) return null;
  if (/^91\d{10}$/.test(cleaned)) return null;
  if (/^\d{10}$/.test(cleaned)) return null;
  return "Enter a valid 10-digit Indian mobile number";
}

interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", passed: /[a-z]/.test(password) },
    { label: "Contains a number", passed: /\d/.test(password) },
    { label: "Contains special character (!@#$...)", passed: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];
  const score = checks.filter((c) => c.passed).length;

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: "Too weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-red-400" },
    2: { label: "Fair", color: "bg-orange-400" },
    3: { label: "Good", color: "bg-yellow-400" },
    4: { label: "Strong", color: "bg-green-400" },
    5: { label: "Very Strong", color: "bg-green-600" },
  };

  return { score, checks, ...levels[score] };
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter";
  if (!/\d/.test(password)) return "Password must include a number";
  return null;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Real-time validation
  const nameError = touched.name ? validateName(name) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const phoneError = touched.phone ? validatePhone(phone) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError = touched.confirmPassword
    ? !confirmPassword
      ? "Please confirm your password"
      : confirmPassword !== password
        ? "Passwords do not match"
        : null
    : null;

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const isFormValid =
    !validateName(name) &&
    !validateEmail(email) &&
    !validatePhone(phone) &&
    !validatePassword(password) &&
    confirmPassword === password &&
    agreed;

  // Early return AFTER all hooks
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched to show all errors
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });

    // Run all validations
    const errors = [
      validateName(name),
      validateEmail(email),
      validatePhone(phone),
      validatePassword(password),
      confirmPassword !== password ? "Passwords do not match" : null,
      !agreed ? "Please agree to the Terms of Service and Privacy Policy" : null,
    ].filter(Boolean);

    if (errors.length > 0) {
      setError(errors[0]!);
      return;
    }

    setSubmitting(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setSubmitting(false);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Registration failed");
    }
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
            <h1 className="font-heading text-3xl text-maroon-800 mb-2">Create Account</h1>
            <p className="text-gold-600 tracking-[0.3em] uppercase text-xs">Join the Mahalakshmi family</p>
            <OrnamentDivider className="my-4" />
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched("name")}
                  className={`input-vintage pl-11 ${nameError ? "!border-red-400 focus:!ring-red-200" : touched.name && !nameError ? "!border-green-400" : ""}`}
                  placeholder="Your full name"
                  autoComplete="off"
                />
                {touched.name && !nameError && <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
              {nameError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} />{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  className={`input-vintage pl-11 ${emailError ? "!border-red-400 focus:!ring-red-200" : touched.email && !emailError ? "!border-green-400" : ""}`}
                  placeholder="you@example.com"
                  autoComplete="off"
                />
                {touched.email && !emailError && <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
              {emailError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} />{emailError}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Phone Number <span className="text-gray-400 text-xs">(optional)</span></label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => markTouched("phone")}
                  className={`input-vintage pl-11 ${phoneError ? "!border-red-400 focus:!ring-red-200" : touched.phone && phone && !phoneError ? "!border-green-400" : ""}`}
                  placeholder="+91 98765 43210"
                  autoComplete="off"
                />
                {touched.phone && phone && !phoneError && <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
              {phoneError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} />{phoneError}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); if (!touched.password) markTouched("password"); }}
                  onBlur={() => markTouched("password")}
                  className={`input-vintage pl-11 pr-11 ${passwordError ? "!border-red-400 focus:!ring-red-200" : touched.password && !passwordError ? "!border-green-400" : ""}`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 space-y-2"
                >
                  {/* Strength Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-medium min-w-[70px] text-right ${
                      passwordStrength.score <= 1 ? "text-red-500" :
                      passwordStrength.score <= 2 ? "text-orange-500" :
                      passwordStrength.score <= 3 ? "text-yellow-600" :
                      "text-green-600"
                    }`}>
                      <Shield size={10} className="inline mr-0.5" />
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Individual Checks */}
                  <div className="grid grid-cols-1 gap-0.5">
                    {passwordStrength.checks.map((check) => (
                      <div key={check.label} className="flex items-center gap-1.5 text-[11px]">
                        {check.passed ? (
                          <Check size={12} className="text-green-500 shrink-0" />
                        ) : (
                          <X size={12} className="text-gray-300 shrink-0" />
                        )}
                        <span className={check.passed ? "text-green-700" : "text-gray-400"}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => markTouched("confirmPassword")}
                  className={`input-vintage pl-11 ${confirmError ? "!border-red-400 focus:!ring-red-200" : touched.confirmPassword && !confirmError ? "!border-green-400" : ""}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {touched.confirmPassword && !confirmError && <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
              </div>
              {confirmError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X size={12} />{confirmError}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-maroon-700 mt-1" />
              <span className="text-xs text-gray-500">
                I agree to the <Link href="#" className="text-maroon-600 underline">Terms of Service</Link> and{" "}
                <Link href="#" className="text-maroon-600 underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`btn-primary w-full transition-all duration-300 ${(!isFormValid || submitting) ? "!opacity-50 !cursor-not-allowed" : ""}`}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">OR</span></div>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gold-200 rounded-sm hover:bg-cream-100 transition-colors text-sm text-gray-700">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-maroon-600 hover:text-maroon-800 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
