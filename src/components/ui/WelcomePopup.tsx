"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Gift } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useSocialMedia } from "@/context/SocialMediaContext";

const STORAGE_KEY = "mahalakshmi_welcome_seen";

export function WelcomePopup() {
  const { siteContent } = useSiteContent();
  const { social } = useSocialMedia();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");

  const {
    welcomePopupEnabled,
    welcomePopupHeading,
    welcomePopupSubtitle,
    welcomePopupCollectEmail,
    welcomePopupCollectPhone,
    welcomePopupShowInstagram,
    welcomePopupButtonText,
    welcomePopupDismissText,
    welcomePopupShowOnce,
  } = siteContent;

  useEffect(() => {
    if (!welcomePopupEnabled) return;

    // If show-once is on and already seen, don't show
    if (welcomePopupShowOnce) {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch { /* ignore */ }
    }

    // Show after a 2-second delay
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [welcomePopupEnabled, welcomePopupShowOnce]);

  function handleDismiss() {
    setVisible(false);
    markSeen();
  }

  function handleClaim() {
    setVisible(false);
    markSeen();
  }

  function markSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch { /* ignore */ }
  }

  if (!welcomePopupEnabled) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <X size={16} />
            </button>

            {/* Top decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-maroon-600 via-gold-500 to-maroon-600" />

            {/* Content */}
            <div className="px-8 pt-8 pb-6 text-center">
              {/* Logo / Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-maroon-50 to-gold-50 border-2 border-gold-200 flex items-center justify-center">
                <Gift size={28} className="text-maroon-700" />
              </div>

              {/* Store name */}
              <p className="font-heading text-lg text-maroon-800 tracking-wide mb-1">
                Mahalakshmi
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 mb-5">
                S I L K S
              </p>

              {/* Heading */}
              <h2 className="font-heading text-xl md:text-2xl text-maroon-800 leading-snug mb-2">
                {welcomePopupHeading}
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-gray-500 mb-6">
                {welcomePopupSubtitle}
              </p>

              {/* Form fields */}
              <div className="space-y-3">
                {welcomePopupCollectEmail && (
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-maroon-400 focus:ring-2 focus:ring-maroon-100 transition-all bg-gray-50/50"
                    />
                  </div>
                )}

                {welcomePopupCollectPhone && (
                  <div className="relative flex items-center border border-gray-200 rounded-lg bg-gray-50/50 focus-within:border-maroon-400 focus-within:ring-2 focus-within:ring-maroon-100 transition-all">
                    <div className="flex items-center gap-1.5 pl-3.5 pr-2 border-r border-gray-200">
                      <span className="text-base">🇮🇳</span>
                      <Phone size={14} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91"
                      className="flex-1 py-3 px-3 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleClaim}
                className="w-full mt-4 py-3 bg-gradient-to-r from-maroon-700 to-maroon-600 hover:from-maroon-800 hover:to-maroon-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                {welcomePopupButtonText}
              </button>

              {/* Dismiss link */}
              <button
                onClick={handleDismiss}
                className="mt-3 text-sm text-maroon-600 hover:text-maroon-800 transition-colors font-medium"
              >
                {welcomePopupDismissText}
              </button>

              {/* Instagram link */}
              {welcomePopupShowInstagram && social.instagramUrl && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={social.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Follow us on Instagram
                  </a>
                </div>
              )}
            </div>

            {/* Bottom decorative bar */}
            <div className="h-1 bg-gradient-to-r from-gold-400 via-maroon-600 to-gold-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
