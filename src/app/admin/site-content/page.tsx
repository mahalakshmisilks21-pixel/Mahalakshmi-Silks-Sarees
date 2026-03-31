"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, FileText, Phone, Plus, Trash2, Save, GripVertical, Upload, Image as ImageIcon, X, Link2, Gift } from "lucide-react";
import { useSiteContent, AboutValue, AboutMilestone, ContactFaq } from "@/context/SiteContentContext";
import { supabase } from "@/lib/supabase";

type Tab = "about" | "contact" | "popup";

export default function AdminSiteContentPage() {
  const { siteContent, updateSiteContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // tracks which field is uploading

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  /* ── Image upload (Supabase) ── */
  async function handleImageUpload(file: File, field: string, index?: number) {
    if (!file || !file.type.startsWith("image/")) return;
    const uploadKey = index !== undefined ? `${field}-${index}` : field;
    setUploading(uploadKey);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `site-content/${fileName}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      alert("Upload failed. Make sure 'product-images' bucket exists in Supabase Storage.");
      setUploading(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    if (index !== undefined && field === "aboutMissionImages") {
      const updated = [...siteContent.aboutMissionImages];
      updated[index] = urlData.publicUrl;
      updateSiteContent({ aboutMissionImages: updated });
    } else {
      updateSiteContent({ [field]: urlData.publicUrl });
    }
    setUploading(null);
  }

  /* ── About helpers ── */
  function updateValue(index: number, field: keyof AboutValue, value: string) {
    const updated = [...siteContent.aboutValues];
    updated[index] = { ...updated[index], [field]: value };
    updateSiteContent({ aboutValues: updated });
  }
  function addValue() {
    updateSiteContent({ aboutValues: [...siteContent.aboutValues, { title: "", description: "" }] });
  }
  function removeValue(index: number) {
    updateSiteContent({ aboutValues: siteContent.aboutValues.filter((_, i) => i !== index) });
  }

  function updateMilestone(index: number, field: keyof AboutMilestone, value: string) {
    const updated = [...siteContent.aboutMilestones];
    updated[index] = { ...updated[index], [field]: value };
    updateSiteContent({ aboutMilestones: updated });
  }
  function addMilestone() {
    updateSiteContent({ aboutMilestones: [...siteContent.aboutMilestones, { year: "", event: "" }] });
  }
  function removeMilestone(index: number) {
    updateSiteContent({ aboutMilestones: siteContent.aboutMilestones.filter((_, i) => i !== index) });
  }

  /* ── Contact helpers ── */
  function updateFaq(index: number, field: keyof ContactFaq, value: string) {
    const updated = [...siteContent.contactFaqs];
    updated[index] = { ...updated[index], [field]: value };
    updateSiteContent({ contactFaqs: updated });
  }
  function addFaq() {
    updateSiteContent({ contactFaqs: [...siteContent.contactFaqs, { q: "", a: "" }] });
  }
  function removeFaq(index: number) {
    updateSiteContent({ contactFaqs: siteContent.contactFaqs.filter((_, i) => i !== index) });
  }

  function updateArrayField(field: "contactAddress" | "contactPhones" | "contactBusinessHours", index: number, value: string) {
    const updated = [...siteContent[field]];
    updated[index] = value;
    updateSiteContent({ [field]: updated });
  }
  function addArrayItem(field: "contactAddress" | "contactPhones" | "contactBusinessHours") {
    updateSiteContent({ [field]: [...siteContent[field], ""] });
  }
  function removeArrayItem(field: "contactAddress" | "contactPhones" | "contactBusinessHours", index: number) {
    updateSiteContent({ [field]: siteContent[field].filter((_, i) => i !== index) });
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "about", label: "About Page", icon: <FileText size={16} /> },
    { key: "contact", label: "Contact Page", icon: <Phone size={16} /> },
    { key: "popup", label: "Welcome Popup", icon: <Gift size={16} /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-maroon-800">Site Content</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your About & Contact page content</p>
        </div>
        <button onClick={showSaved} className="btn-primary flex items-center gap-2 self-start">
          <Save size={16} /> {saved ? "Saved!" : "Changes Auto‑Save"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-100 p-1 rounded-sm mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-maroon-800 shadow-sm"
                : "text-gray-500 hover:text-maroon-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auto‑save indicator */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700 flex items-center gap-2 w-fit"
          >
            ✅ All changes are saved automatically
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "about" ? (
            <motion.div key="about" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              {/* Hero Section */}
              <div className="card-vintage p-6">
                <SectionTitle icon={<Globe size={18} />} title="Hero Section" subtitle="The banner area at the top of the About page" />
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hero Title</label>
                    <textarea
                      className="input-vintage h-20 resize-none"
                      value={siteContent.aboutHeroTitle}
                      onChange={(e) => updateSiteContent({ aboutHeroTitle: e.target.value })}
                      placeholder="Fancy Handloom Silk..."
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Use a new line to create a line break</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hero Subtitle</label>
                    <textarea
                      className="input-vintage h-20 resize-none"
                      value={siteContent.aboutHeroSubtitle}
                      onChange={(e) => updateSiteContent({ aboutHeroSubtitle: e.target.value })}
                    />
                  </div>
                  {/* Hero Banner Image */}
                  <ImageUploadField
                    label="Hero Banner Image"
                    hint="Optional background image for the hero section"
                    imageUrl={siteContent.aboutHeroBannerImage}
                    uploading={uploading === "aboutHeroBannerImage"}
                    onUpload={(file) => handleImageUpload(file, "aboutHeroBannerImage")}
                    onUrlPaste={(url) => updateSiteContent({ aboutHeroBannerImage: url })}
                    onRemove={() => updateSiteContent({ aboutHeroBannerImage: "" })}
                  />
                </div>
              </div>

              {/* Mission Section */}
              <div className="card-vintage p-6">
                <SectionTitle icon={<FileText size={18} />} title="Mission Section" subtitle="Your store's mission and story" />
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Section Title</label>
                    <input
                      className="input-vintage"
                      value={siteContent.aboutMissionTitle}
                      onChange={(e) => updateSiteContent({ aboutMissionTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Description Paragraphs</label>
                    <textarea
                      className="input-vintage h-40 resize-none"
                      value={siteContent.aboutMissionDescription}
                      onChange={(e) => updateSiteContent({ aboutMissionDescription: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Separate paragraphs with a blank line (press Enter twice)</p>
                  </div>
                  {/* Mission Images (3-image collage) */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mission Collage Images (3 images)</label>
                    <p className="text-[10px] text-gray-400 mb-3">Upload 3 images for the staggered collage layout next to the mission text. Sizes: Large → Medium → Small.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["Large Image", "Medium Image", "Small Image"].map((label, idx) => (
                        <div key={idx} className="bg-cream-50 rounded-sm p-3 border border-cream-200">
                          <p className="text-xs font-medium text-maroon-700 mb-2 flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                              idx === 0 ? "bg-maroon-600" : idx === 1 ? "bg-maroon-500" : "bg-maroon-400"
                            }`}>{idx + 1}</span>
                            {label}
                          </p>
                          <ImageUploadField
                            label=""
                            hint=""
                            imageUrl={siteContent.aboutMissionImages?.[idx] || ""}
                            uploading={uploading === `aboutMissionImages-${idx}`}
                            onUpload={(file) => handleImageUpload(file, "aboutMissionImages", idx)}
                            onUrlPaste={(url) => {
                              const updated = [...(siteContent.aboutMissionImages || ["", "", ""])];
                              updated[idx] = url;
                              updateSiteContent({ aboutMissionImages: updated });
                            }}
                            onRemove={() => {
                              const updated = [...(siteContent.aboutMissionImages || ["", "", ""])];
                              updated[idx] = "";
                              updateSiteContent({ aboutMissionImages: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={<GripVertical size={18} />} title="Our Values" subtitle="Key pillars that define your brand" />
                  <button onClick={addValue} className="btn-secondary text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Value
                  </button>
                </div>
                <div className="space-y-4">
                  {siteContent.aboutValues.map((v, i) => (
                    <div key={i} className="flex gap-3 items-start bg-cream-50 rounded-sm p-4 border border-cream-200">
                      <span className="w-6 h-6 rounded-full bg-maroon-100 text-maroon-600 text-xs flex items-center justify-center mt-1 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <input
                          className="input-vintage"
                          placeholder="Value title"
                          value={v.title}
                          onChange={(e) => updateValue(i, "title", e.target.value)}
                        />
                        <textarea
                          className="input-vintage h-16 resize-none"
                          placeholder="Value description"
                          value={v.description}
                          onChange={(e) => updateValue(i, "description", e.target.value)}
                        />
                      </div>
                      {siteContent.aboutValues.length > 1 && (
                        <button onClick={() => removeValue(i)} className="text-red-400 hover:text-red-600 transition-colors mt-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={<GripVertical size={18} />} title="Milestones" subtitle="Key moments in your journey" />
                  <button onClick={addMilestone} className="btn-secondary text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Milestone
                  </button>
                </div>
                <div className="space-y-3">
                  {siteContent.aboutMilestones.map((m, i) => (
                    <div key={i} className="flex gap-3 items-center bg-cream-50 rounded-sm p-3 border border-cream-200">
                      <input
                        className="input-vintage w-28 shrink-0"
                        placeholder="Year"
                        value={m.year}
                        onChange={(e) => updateMilestone(i, "year", e.target.value)}
                      />
                      <input
                        className="input-vintage flex-1"
                        placeholder="Event description"
                        value={m.event}
                        onChange={(e) => updateMilestone(i, "event", e.target.value)}
                      />
                      {siteContent.aboutMilestones.length > 1 && (
                        <button onClick={() => removeMilestone(i)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "contact" ? (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              {/* Contact Hero Section */}
              <div className="card-vintage p-6">
                <SectionTitle icon={<Globe size={18} />} title="Hero Section" subtitle="The banner area at the top of the Contact page" />
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hero Title</label>
                    <input
                      className="input-vintage"
                      value={siteContent.contactHeroTitle}
                      onChange={(e) => updateSiteContent({ contactHeroTitle: e.target.value })}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hero Subtitle</label>
                    <textarea
                      className="input-vintage h-20 resize-none"
                      value={siteContent.contactHeroSubtitle}
                      onChange={(e) => updateSiteContent({ contactHeroSubtitle: e.target.value })}
                      placeholder="Have questions about our sarees?..."
                    />
                  </div>
                  {/* Hero Banner Image */}
                  <ImageUploadField
                    label="Hero Banner Image"
                    hint="Optional background image for the Contact hero section"
                    imageUrl={siteContent.contactHeroBannerImage}
                    uploading={uploading === "contactHeroBannerImage"}
                    onUpload={(file) => handleImageUpload(file, "contactHeroBannerImage")}
                    onUrlPaste={(url) => updateSiteContent({ contactHeroBannerImage: url })}
                    onRemove={() => updateSiteContent({ contactHeroBannerImage: "" })}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={<Globe size={18} />} title="Store Address" subtitle="Address lines shown on the Contact page" />
                  <button onClick={() => addArrayItem("contactAddress")} className="btn-secondary text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                <div className="space-y-2">
                  {siteContent.contactAddress.map((line, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className="input-vintage flex-1"
                        value={line}
                        onChange={(e) => updateArrayField("contactAddress", i, e.target.value)}
                      />
                      {siteContent.contactAddress.length > 1 && (
                        <button onClick={() => removeArrayItem("contactAddress", i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={<Phone size={18} />} title="Phone Numbers" subtitle="Contact numbers displayed publicly" />
                  <button onClick={() => addArrayItem("contactPhones")} className="btn-secondary text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Phone
                  </button>
                </div>
                <div className="space-y-2">
                  {siteContent.contactPhones.map((ph, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className="input-vintage flex-1"
                        value={ph}
                        onChange={(e) => updateArrayField("contactPhones", i, e.target.value)}
                      />
                      {siteContent.contactPhones.length > 1 && (
                        <button onClick={() => removeArrayItem("contactPhones", i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Email & Business Hours */}
              <div className="card-vintage p-6">
                <SectionTitle icon={<FileText size={18} />} title="Email & Business Hours" subtitle="Operating details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                    <input
                      className="input-vintage"
                      value={siteContent.contactEmail}
                      onChange={(e) => updateSiteContent({ contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-600">Business Hours</label>
                      <button onClick={() => addArrayItem("contactBusinessHours")} className="text-xs text-maroon-600 hover:text-maroon-800">
                        + Add Line
                      </button>
                    </div>
                    <div className="space-y-2">
                      {siteContent.contactBusinessHours.map((h, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            className="input-vintage flex-1"
                            value={h}
                            onChange={(e) => updateArrayField("contactBusinessHours", i, e.target.value)}
                          />
                          {siteContent.contactBusinessHours.length > 1 && (
                            <button onClick={() => removeArrayItem("contactBusinessHours", i)} className="text-red-400 hover:text-red-600">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Description */}
              <div className="card-vintage p-6">
                <SectionTitle icon={<Globe size={18} />} title="Map Section" subtitle="Description shown in the map area" />
                <textarea
                  className="input-vintage h-24 resize-none mt-4"
                  value={siteContent.contactMapDescription}
                  onChange={(e) => updateSiteContent({ contactMapDescription: e.target.value })}
                />
              </div>


            </motion.div>
          ) : activeTab === "popup" ? (
            <motion.div key="popup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              {/* Master Toggle */}
              <div className="card-vintage p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-maroon-50 to-gold-50 text-maroon-600 rounded-sm flex items-center justify-center">
                      <Gift size={18} />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg text-maroon-800">Welcome Popup</h2>
                      <p className="text-[11px] text-gray-500">First-visit discount popup to boost conversions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteContent.welcomePopupEnabled}
                      onChange={(e) => updateSiteContent({ welcomePopupEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:ring-2 peer-focus:ring-maroon-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm" />
                  </label>
                </div>
                {!siteContent.welcomePopupEnabled && (
                  <div className="mt-4 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm">
                    <p className="text-xs text-gray-500">⚠️ The welcome popup is currently <strong>disabled</strong>. Enable it to show the popup to visitors.</p>
                  </div>
                )}
              </div>

              {/* Content Settings */}
              <div className={`card-vintage p-6 transition-opacity ${!siteContent.welcomePopupEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                <SectionTitle icon={<FileText size={18} />} title="Popup Content" subtitle="Customize the heading, subtitle and button text" />
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Heading</label>
                    <input
                      className="input-vintage"
                      value={siteContent.welcomePopupHeading}
                      onChange={(e) => updateSiteContent({ welcomePopupHeading: e.target.value })}
                      placeholder="GET 5% OFF ON YOUR FIRST PURCHASE 🎉"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Supports emojis — try 🎉 🎁 ✨</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Subtitle</label>
                    <input
                      className="input-vintage"
                      value={siteContent.welcomePopupSubtitle}
                      onChange={(e) => updateSiteContent({ welcomePopupSubtitle: e.target.value })}
                      placeholder="Sign up and unlock your instant discount."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Discount %</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="input-vintage"
                        value={siteContent.welcomePopupDiscountPercent}
                        onChange={(e) => updateSiteContent({ welcomePopupDiscountPercent: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Button Text</label>
                      <input
                        className="input-vintage"
                        value={siteContent.welcomePopupButtonText}
                        onChange={(e) => updateSiteContent({ welcomePopupButtonText: e.target.value })}
                        placeholder="Claim discount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Dismiss Text</label>
                      <input
                        className="input-vintage"
                        value={siteContent.welcomePopupDismissText}
                        onChange={(e) => updateSiteContent({ welcomePopupDismissText: e.target.value })}
                        placeholder="No, thanks"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Options */}
              <div className={`card-vintage p-6 transition-opacity ${!siteContent.welcomePopupEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                <SectionTitle icon={<Globe size={18} />} title="Display Options" subtitle="Control what fields & links appear in the popup" />
                <div className="space-y-4 mt-4">
                  {([
                    { key: "welcomePopupCollectEmail" as const, label: "Collect Email", desc: "Show an email input field" },
                    { key: "welcomePopupCollectPhone" as const, label: "Collect Phone", desc: "Show a phone number input field" },
                    { key: "welcomePopupShowInstagram" as const, label: "Show Instagram Link", desc: "Display 'Follow us on Instagram' link (uses URL from Social Media settings)" },
                    { key: "welcomePopupShowOnce" as const, label: "Show Once Per Visitor", desc: "Only show the popup on the first visit (uses browser storage)" },
                  ]).map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-maroon-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={siteContent[item.key]}
                          onChange={(e) => updateSiteContent({ [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-maroon-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-maroon-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-sm">
                  <p className="text-xs text-amber-700">
                    💡 To test the popup, disable <strong>&quot;Show Once Per Visitor&quot;</strong> or clear your browser storage. The popup appears after a 2-second delay.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Bottom info */}
      <div className="mt-8 max-w-4xl px-4 py-3 bg-blue-50 border border-blue-200 rounded-sm">
        <p className="text-xs text-blue-700">
          ℹ️ All changes are <strong>saved automatically</strong> to your browser. They will reflect immediately on the public <strong>About</strong> and <strong>Contact</strong> pages.
        </p>
      </div>
    </div>
  );
}

/* ── Reusable section title ── */
function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-maroon-50 text-maroon-600 rounded-sm flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="font-heading text-lg text-maroon-800">{title}</h2>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ── Reusable image upload field ── */
function ImageUploadField({
  label,
  hint,
  imageUrl,
  uploading,
  onUpload,
  onUrlPaste,
  onRemove,
}: {
  label: string;
  hint: string;
  imageUrl: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onUrlPaste: (url: string) => void;
  onRemove: () => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [dragOver, setDragOver] = useState(false);
  const inputId = `img-upload-${label.replace(/\s/g, "-").toLowerCase()}`;

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <p className="text-[10px] text-gray-400 mb-2">{hint}</p>

      {/* Current image preview */}
      {imageUrl && (
        <div className="relative w-full max-w-xs mb-3 group">
          <img src={imageUrl} alt={label} className="w-full h-40 object-cover rounded-sm border border-gold-200" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${
            mode === "upload" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"
          }`}
        >
          <Upload size={14} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${
            mode === "url" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"
          }`}
        >
          <Link2 size={14} /> Paste URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className={`border-2 border-dashed rounded-sm p-5 text-center transition-all duration-200 ${
            dragOver
              ? "border-maroon-600 bg-maroon-50 scale-[1.01] shadow-lg"
              : "border-gold-300 bg-cream-50/50 hover:bg-cream-100/50"
          }`}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onUpload(file);
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
            className="hidden"
            id={inputId}
            disabled={uploading}
          />
          <label htmlFor={inputId} className="cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-maroon-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : dragOver ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center">
                  <Upload size={20} className="text-maroon-600" />
                </div>
                <span className="text-sm font-medium text-maroon-700">Drop image here!</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon size={28} className="text-gold-400" />
                <span className="text-sm text-gray-600">Click to upload <span className="text-gray-400">or drag & drop</span></span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
              </div>
            )}
          </label>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className="input-vintage flex-1"
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) { onUrlPaste(val); (e.target as HTMLInputElement).value = ""; }
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = (e.target as HTMLElement).parentElement?.querySelector("input") as HTMLInputElement;
              const val = input?.value.trim();
              if (val) { onUrlPaste(val); input.value = ""; }
            }}
            className="btn-primary text-xs px-4"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}
