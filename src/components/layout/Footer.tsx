"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { useSocialMedia } from "@/context/SocialMediaContext";
import { openWhatsApp, getWhatsAppSubscriptionMessage } from "@/lib/utils";

export function Footer() {
  const [phone, setPhone] = useState("");
  const { social } = useSocialMedia();

  const footerLinks = {
    shop: [
      { name: "All Sarees", href: "/sarees" },
      { name: "Wedding Collection", href: "/sarees?category=wedding" },
      { name: "Festive Collection", href: "/sarees?category=festive" },
      { name: "Casual Elegance", href: "/sarees?category=casual" },
      { name: "Designer Collection", href: "/sarees?category=designer" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Our Story", href: "/about" },
      { name: "Careers", href: "/about" },
    ],
  };

  const socialIcons = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/${social.whatsappNumber}?text=${encodeURIComponent("Hi! I'm interested in your silk sarees.")}`,
      color: "hover:bg-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Instagram",
      href: social.instagramUrl,
      color: "hover:bg-pink-500",
      bgColor: "bg-pink-500/10",
      isInstagram: true,
    },
    {
      name: "Telegram",
      icon: Send,
      href: social.telegramUrl,
      color: "hover:bg-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  const handleWhatsAppJoin = () => {
    const msg = getWhatsAppSubscriptionMessage(phone || "a customer");
    openWhatsApp(msg, social.whatsappNumber);
  };

  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-[#000000] text-gray-300">
      <div className="h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl text-amber-400 mb-3">Mahalakshmi</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Fancy Handloom Silk &amp; Silk Cotton Sarees. Celebrating India&apos;s rich
              silk heritage since generations.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">875, Mettupalayam Main Road, Erangattur, Uthandiyur (P.O.), Sathy (Tk.) Erode (Dt.) - 638 451, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <a href={`tel:${social.phoneNumber}`} className="text-gray-400 hover:text-amber-400 transition-colors">{social.phoneNumber}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span className="text-gray-400">mahalakshmisilks@email.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span className="text-gray-400">Mon - Sat: 9AM - 9PM</span>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-heading text-base text-amber-400 mb-3">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 text-xs hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-heading text-base text-amber-400 mb-3">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 text-xs hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp Subscription */}
          <div>
            <h4 className="font-heading text-base text-amber-400 mb-3">Get Offers on WhatsApp</h4>
            <p className="text-gray-400 text-xs mb-3">
              Get exclusive deals, new arrivals & festival offers directly on WhatsApp! 📲
            </p>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-full text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-green-400/50"
              />
              <button
                onClick={handleWhatsAppJoin}
                className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-green-400 transition-all flex items-center gap-1.5"
              >
                <MessageCircle size={14} />
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-[10px]">
            &copy; 2025 Mahalakshmi Silks. All rights reserved. GSTIN: 33AMGPB1721P1Z9
          </p>
          <div className="flex items-center gap-3">
            {socialIcons.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-full ${link.bgColor} ${link.color} flex items-center justify-center transition-all duration-300 hover:text-white hover:scale-110`}
                title={link.name}
              >
                {link.isInstagram ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ) : link.icon ? (
                  <link.icon size={14} />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
