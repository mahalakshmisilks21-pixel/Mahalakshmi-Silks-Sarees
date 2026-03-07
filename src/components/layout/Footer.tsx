import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

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

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-[#000000] text-gray-300">
      {/* Decorative border */}
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
                <span className="text-gray-400">+91 90803 16738 / +91 78068 65407</span>
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

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-base text-amber-400 mb-3">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-3">
              Subscribe for exclusive offers, new arrivals, and festive collections.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-full text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-amber-400/50"
              />
              <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:from-amber-400 hover:to-yellow-400 transition-all">
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
          <div className="flex items-center gap-4 text-[10px]">
            <span className="bg-white/10 px-2 py-1 rounded text-gray-400">Visa</span>
            <span className="bg-white/10 px-2 py-1 rounded text-gray-400">Mastercard</span>
            <span className="bg-white/10 px-2 py-1 rounded text-gray-400">UPI</span>
            <span className="bg-white/10 px-2 py-1 rounded text-gray-400">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
