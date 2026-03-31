"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase will automatically pick up the OAuth tokens from the URL hash
    // The onAuthStateChange listener in AuthContext will handle setting the user
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[Auth Callback] Error:", error.message);
          router.replace("/login");
          return;
        }
        if (session) {
          console.log("[Auth Callback] Session found, redirecting to home");
          router.replace("/");
        } else {
          console.log("[Auth Callback] No session, redirecting to login");
          router.replace("/login");
        }
      } catch (err) {
        console.error("[Auth Callback] Exception:", err);
        router.replace("/login");
      }
    };

    // Small delay to let Supabase process the tokens from URL
    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-3 border-maroon-700 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-maroon-800 font-heading text-xl">Signing you in...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we complete authentication</p>
      </div>
    </div>
  );
}
