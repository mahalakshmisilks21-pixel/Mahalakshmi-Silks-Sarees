"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, MapPin, ShoppingBag, Heart, LogOut, Settings, ChevronRight, Edit3 } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/SectionHeader";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-maroon-800 to-maroon-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">My Account</p>
          <h1 className="font-heading text-4xl text-white">Welcome Back</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-vintage p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-maroon-100 flex items-center justify-center">
                  <User size={28} className="text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-maroon-800">Guest User</h3>
                  <p className="text-xs text-gray-500">guest@example.com</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                      activeTab === tab.id ? "bg-maroon-700 text-white" : "text-gray-600 hover:bg-cream-100"
                    }`}
                  >
                    <tab.icon size={16} /> {tab.label}
                  </button>
                ))}
                <Link href="/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-gray-600 hover:bg-cream-100">
                  <ShoppingBag size={16} /> My Orders
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-maroon-600 hover:bg-maroon-50">
                  <LogOut size={16} /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-vintage p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-maroon-800">Personal Information</h2>
                  <button className="flex items-center gap-1 text-sm text-maroon-600 hover:text-maroon-800">
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
                <OrnamentDivider className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div><label className="text-xs text-gold-600 uppercase tracking-wider">Full Name</label><p className="text-maroon-800 font-medium mt-1">Guest User</p></div>
                  <div><label className="text-xs text-gold-600 uppercase tracking-wider">Email</label><p className="text-maroon-800 font-medium mt-1">guest@example.com</p></div>
                  <div><label className="text-xs text-gold-600 uppercase tracking-wider">Phone</label><p className="text-maroon-800 font-medium mt-1">+91 98765 43210</p></div>
                  <div><label className="text-xs text-gold-600 uppercase tracking-wider">Member Since</label><p className="text-maroon-800 font-medium mt-1">January 2025</p></div>
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-vintage p-8">
                <h2 className="font-heading text-2xl text-maroon-800 mb-6">Saved Addresses</h2>
                <div className="bg-cream-100 p-6 rounded-sm border border-dashed border-gold-300 text-center">
                  <MapPin className="text-gold-400 mx-auto mb-3" size={32} />
                  <p className="text-gray-500 mb-4">No saved addresses yet</p>
                  <button className="btn-primary text-sm">Add Address</button>
                </div>
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-vintage p-8">
                <h2 className="font-heading text-2xl text-maroon-800 mb-6">My Wishlist</h2>
                <div className="bg-cream-100 p-6 rounded-sm border border-dashed border-gold-300 text-center">
                  <Heart className="text-gold-400 mx-auto mb-3" size={32} />
                  <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                  <Link href="/sarees" className="btn-primary text-sm inline-block">Browse Sarees</Link>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-vintage p-8">
                <h2 className="font-heading text-2xl text-maroon-800 mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gold-200 rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-maroon-800">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive updates about orders and offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-maroon-700" />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gold-200 rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-maroon-800">WhatsApp Updates</p>
                      <p className="text-xs text-gray-500">Get order tracking on WhatsApp</p>
                    </div>
                    <input type="checkbox" className="accent-maroon-700" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
