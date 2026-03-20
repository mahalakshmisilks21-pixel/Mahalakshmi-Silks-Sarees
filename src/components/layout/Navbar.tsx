"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePromotions } from "@/context/PromotionContext";
import { Dropdown } from "@/components/ui/Dropdown";
const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Sarees",
    href: "/sarees",
    children: [
      { name: "All Sarees", href: "/sarees" },
      { name: "Wedding Collection", href: "/sarees?category=wedding" },
      { name: "Festive Collection", href: "/sarees?category=festive" },
      { name: "Casual Elegance", href: "/sarees?category=casual" },
      { name: "Designer Collection", href: "/sarees?category=designer" },
      { name: "Traditional Wear", href: "/sarees?category=traditional" },
      { name: "Party Wear", href: "/sarees?category=party" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalWishlist } = useWishlist();
  const { announcement } = usePromotions();

  return (
    <>
      {/* Top bar */}
      {announcement.enabled && announcement.text && (
        <div className="bg-maroon-800 text-gold-200 text-[10px] py-1 overflow-hidden whitespace-nowrap relative">
          <style>{`
            @keyframes marquee-rtl {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
          <div
            style={{ animation: "marquee-rtl 18s linear infinite" }}
            className="inline-block tracking-wider"
          >
            {announcement.text}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-gold-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="font-heading text-2xl md:text-3xl text-maroon-800 leading-tight tracking-wide">
                  Mahalakshmi
                </span>
                <span className="text-[10px] md:text-xs text-gold-600 tracking-[0.35em] uppercase -mt-1">
                  Silks
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 text-maroon-800 hover:text-maroon-600 font-medium text-sm tracking-wide transition-colors"
                    >
                      {link.name}
                      <ChevronDown size={14} />
                    </Link>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white border border-gold-200 shadow-xl rounded-sm py-2"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-5 py-2.5 text-sm text-maroon-700 hover:bg-gold-50 hover:text-maroon-900 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-maroon-800 hover:text-maroon-600 font-medium text-sm tracking-wide transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              )}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-maroon-800 hover:text-maroon-600 font-medium text-sm tracking-wide transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/sarees" className="hidden md:block text-maroon-700 hover:text-maroon-500 transition-colors">
                <Search size={20} />
              </Link>
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  {!isAdmin && <span className="text-sm text-maroon-700 font-medium">{user?.name?.split(" ")[0]}</span>}
                  <button onClick={logout} className="text-xs text-maroon-600 hover:text-maroon-800 underline">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block text-maroon-700 hover:text-maroon-500 transition-colors">
                  <User size={20} />
                </Link>
              )}
              {/* Wishlist */}
              <Link href="/wishlist" className="relative hidden md:block text-maroon-700 hover:text-maroon-500 transition-colors">
                <Heart size={20} />
                {totalWishlist > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold"
                  >
                    {totalWishlist}
                  </motion.span>
                )}
              </Link>
              <Link href="/cart" className="relative text-maroon-700 hover:text-maroon-500 transition-colors">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-maroon-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-maroon-700"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gold-200 overflow-hidden"
            >
              <nav className="px-4 py-6 space-y-4 bg-cream-50">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-maroon-800 font-medium py-2 text-lg"
                    >
                      {link.name}
                    </Link>
                    {link.children && (
                      <div className="pl-4 space-y-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-maroon-600 text-sm py-1"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-6 pt-4 border-t border-gold-200">
                  {isAuthenticated ? (
                    <>
                      <span className="text-maroon-700 text-sm font-medium">Hi, {user?.name?.split(" ")[0]}</span>
                      <button onClick={() => { logout(); setMobileOpen(false); }} className="text-maroon-600 text-sm font-medium underline">
                        Logout
                      </button>
                      {isAdmin && (
                        <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="text-maroon-700 text-sm font-medium">
                          Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="text-maroon-700 text-sm font-medium">
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="text-maroon-700 text-sm font-medium">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
