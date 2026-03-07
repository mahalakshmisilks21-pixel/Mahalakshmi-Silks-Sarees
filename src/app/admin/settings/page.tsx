"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Store, Bell, Shield, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

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
              <input className="input-vintage" defaultValue="hello@mahalakshmisilk.com" />
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
              <div key={item.label} className="flex items-center justify-between py-2">
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
