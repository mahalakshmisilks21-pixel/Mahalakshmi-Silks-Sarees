"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Store, Bell, Shield, MessageCircle, Send, Phone, Share2 } from "lucide-react";
import { useSocialMedia } from "@/context/SocialMediaContext";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const { social, updateSocial } = useSocialMedia();

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-maroon-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Store Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-vintage p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-maroon-50 text-maroon-600 rounded-sm flex items-center justify-center"><Store size={20} /></div>
            <div>
              <h2 className="font-heading text-lg text-maroon-800">Store Information</h2>
              <p className="text-xs text-gray-500">Basic store details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Store Name</label>
              <input className="input-vintage" defaultValue="Mahalakshmi Silk Sarees" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
              <input className="input-vintage" defaultValue="mahalakshmisilks21@gmail.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input className="input-vintage" defaultValue="+91 90803 16738" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Currency</label>
              <input className="input-vintage" defaultValue="INR" disabled />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <textarea className="input-vintage h-20 resize-none" defaultValue="875, Mettupalayam Main Road, Erangattur, Uthandiyur (P.O.), Sathy (Tk.) Erode (Dt.) - 638 451, Tamil Nadu" />
            </div>
          </div>
        </motion.div>

        {/* Social Media & WhatsApp */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-vintage p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-sm flex items-center justify-center"><MessageCircle size={20} /></div>
            <div>
              <h2 className="font-heading text-lg text-maroon-800">Social Media & WhatsApp</h2>
              <p className="text-xs text-gray-500">Manage your social media links across the site</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <MessageCircle size={14} className="text-green-500" /> WhatsApp Number
              </label>
              <input
                className="input-vintage"
                value={social.whatsappNumber}
                onChange={(e) => updateSocial({ whatsappNumber: e.target.value })}
                placeholder="e.g. 918489240766"
              />
              <p className="text-[10px] text-gray-400 mt-1">Country code without + (e.g. 91 for India)</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <Phone size={14} className="text-maroon-600" /> Phone Number
              </label>
              <input
                className="input-vintage"
                value={social.phoneNumber}
                onChange={(e) => updateSocial({ phoneNumber: e.target.value })}
                placeholder="e.g. +918489240766"
              />
              <p className="text-[10px] text-gray-400 mt-1">Include + and country code for calls</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-pink-500">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram URL
              </label>
              <input
                className="input-vintage"
                value={social.instagramUrl}
                onChange={(e) => updateSocial({ instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/your_account"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <Send size={14} className="text-blue-500" /> Telegram URL
              </label>
              <input
                className="input-vintage"
                value={social.telegramUrl}
                onChange={(e) => updateSocial({ telegramUrl: e.target.value })}
                placeholder="https://t.me/your_channel"
              />
            </div>
          </div>
          <div className="mt-4 px-3 py-2.5 bg-green-50 border border-green-200 rounded-sm">
            <p className="text-xs text-green-700">
              ✅ These settings control the <strong>WhatsApp order flow</strong>, <strong>floating social widget</strong>, <strong>product sharing</strong>, <strong>footer</strong>, and <strong>subscription banner</strong> across the entire website. Changes are saved automatically.
            </p>
          </div>
        </motion.div>

        {/* Share Options */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.075 }} className="card-vintage p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-sm flex items-center justify-center"><Share2 size={20} /></div>
            <div>
              <h2 className="font-heading text-lg text-maroon-800">Share Options</h2>
              <p className="text-xs text-gray-500">Control which share channels appear on product cards</p>
            </div>
          </div>
          <div className="space-y-4">
            {([
              { key: "shareWhatsApp" as const, label: "WhatsApp", desc: "Share product via WhatsApp message", icon: <MessageCircle size={14} className="text-green-500" /> },
              { key: "shareInstagram" as const, label: "Instagram", desc: "Copy link & open Instagram profile", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-pink-500"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> },
              { key: "shareTelegram" as const, label: "Telegram", desc: "Share product via Telegram", icon: <Send size={14} className="text-blue-500" /> },
              { key: "shareCopyLink" as const, label: "Copy Link", desc: "Allow copying the product link", icon: <Share2 size={14} className="text-gray-500" /> },
            ]).map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50">{item.icon}</span>
                  <div>
                    <p className="text-sm text-maroon-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={social[item.key]}
                    onChange={(e) => updateSocial({ [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-maroon-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-maroon-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-sm">
            <p className="text-xs text-purple-700">
              💡 Disabled channels will be hidden from the share popup on all product cards. Changes apply instantly.
            </p>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-vintage p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center"><Bell size={20} /></div>
            <div>
              <h2 className="font-heading text-lg text-maroon-800">Notifications</h2>
              <p className="text-xs text-gray-500">Manage alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "New order notifications", desc: "Get notified when a new order is placed", default: true },
              { label: "Low stock alerts", desc: "Alert when product stock falls below 5 units", default: true },
              { label: "Customer registration", desc: "Notify on new customer sign-ups", default: false },
              { label: "Payment failures", desc: "Get alerts for failed payments", default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 py-2">
                <div>
                  <p className="text-sm text-maroon-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-maroon-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-maroon-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-vintage p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-sm flex items-center justify-center"><Shield size={20} /></div>
            <div>
              <h2 className="font-heading text-lg text-maroon-800">Security</h2>
              <p className="text-xs text-gray-500">Security and access settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Admin Password</label>
              <input type="password" className="input-vintage" defaultValue="••••••••" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-maroon-800">Two-factor authentication</p>
                <p className="text-xs text-gray-400">Add an extra layer of security</p>
              </div>
              <button className="btn-secondary text-xs">Enable</button>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={16} /> {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
