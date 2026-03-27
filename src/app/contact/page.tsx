"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { SectionHeader, OrnamentDivider } from "@/components/ui/SectionHeader";
import { Dropdown } from "@/components/ui/Dropdown";
import { useSiteContent } from "@/context/SiteContentContext";

const CONTACT_ICONS = [MapPin, Phone, Mail, Clock] as const;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { siteContent } = useSiteContent();

  const contactInfo = [
    { icon: CONTACT_ICONS[0], title: "Visit Us", lines: siteContent.contactAddress },
    { icon: CONTACT_ICONS[1], title: "Call Us", lines: siteContent.contactPhones },
    { icon: CONTACT_ICONS[2], title: "Email Us", lines: [siteContent.contactEmail] },
    { icon: CONTACT_ICONS[3], title: "Business Hours", lines: siteContent.contactBusinessHours },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        {siteContent.contactHeroBannerImage ? (
          <>
            <img src={siteContent.contactHeroBannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-maroon-900/75" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-maroon-800 to-maroon-900 vintage-pattern-bg" />
            <div className="absolute inset-0 bg-maroon-800/80" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Get in Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">{siteContent.contactHeroTitle}</h1>
          <p className="text-cream-200 max-w-xl mx-auto">
            {siteContent.contactHeroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 -mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-vintage p-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-maroon-700" size={24} />
              </div>
              <h3 className="font-heading text-lg text-maroon-800 mb-3">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-gray-500 text-sm">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-vintage p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Send size={32} className="text-green-600" />
                </motion.div>
                <h3 className="font-heading text-2xl text-maroon-800 mb-3">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-2xl text-maroon-800 mb-2">Send a Message</h2>
                <OrnamentDivider className="justify-start my-4" />
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-5 mt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                      <input className="input-vintage" placeholder="Full name" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                      <input type="email" className="input-vintage" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone (optional)</label>
                    <input type="tel" className="input-vintage" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Subject</label>
                    <Dropdown
                      options={[
                        { label: "General Inquiry", value: "General Inquiry" },
                        { label: "Order Related", value: "Order Related" },
                        { label: "Product Question", value: "Product Question" },
                        { label: "Bulk / Wholesale", value: "Bulk / Wholesale" },
                        { label: "Return / Exchange", value: "Return / Exchange" },
                        { label: "Other", value: "Other" },
                      ]}
                      value="General Inquiry"
                      onChange={() => { }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Message</label>
                    <textarea className="input-vintage h-32 resize-none" placeholder="Tell us how we can help..." required />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <MessageSquare size={16} /> Send Message
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-vintage overflow-hidden"
          >
            <div className="h-full min-h-[400px] bg-cream-100 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin size={48} className="text-gold-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-maroon-800 mb-2">Our Store Location</h3>
                <p className="text-gray-500 text-sm mb-4">{siteContent.contactAddress.join(", ")}</p>
                <div className="bg-white border border-gold-200 rounded-sm p-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {siteContent.contactMapDescription}
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
