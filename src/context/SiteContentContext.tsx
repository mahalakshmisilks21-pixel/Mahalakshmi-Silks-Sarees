"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ── Types ── */
export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutMilestone {
  year: string;
  event: string;
}

export interface ContactFaq {
  q: string;
  a: string;
}

export interface SiteContent {
  // About page
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutHeroBannerImage: string;
  aboutMissionTitle: string;
  aboutMissionDescription: string; // paragraphs separated by \n\n
  aboutMissionImages: string[]; // 3 images for collage layout
  aboutValues: AboutValue[];
  aboutMilestones: AboutMilestone[];
  // Contact page
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactHeroBannerImage: string;
  contactAddress: string[];
  contactPhones: string[];
  contactEmail: string;
  contactBusinessHours: string[];
  contactMapDescription: string;
  contactFaqs: ContactFaq[];
}

interface SiteContentContextType {
  siteContent: SiteContent;
  updateSiteContent: (data: Partial<SiteContent>) => void;
}

const SiteContentContext = createContext<SiteContentContextType | null>(null);

const DEFAULT_CONTENT: SiteContent = {
  // About
  aboutHeroTitle: "Fancy Handloom Silk\n& Silk Cotton Sarees",
  aboutHeroSubtitle:
    "Mahalakshmi Silks is born from a deep love for India\u2019s textile heritage. Based in Erode, Tamil Nadu, we bring you the finest soft silk sarees crafted with generations of expertise.",
  aboutHeroBannerImage: "",
  aboutMissionTitle: "Preserving India\u2019s Silk Legacy",
  aboutMissionDescription:
    "At Mahalakshmi Silks, we believe every silk saree tells a story. A story of the artisan\u2019s dedication, the rich cultural heritage of Erode\u2019s textile tradition, and the timeless beauty of handcrafted textiles.\n\nOur mission is to bring the finest fancy handloom silk and silk cotton sarees to your doorstep while ensuring the livelihoods of the weaving communities who create these masterpieces.\n\nEach saree in our collection is carefully curated, quality-verified, and sourced from skilled artisan families in and around Erode, Tamil Nadu.",
  aboutMissionImages: ["", "", ""],
  aboutValues: [
    { title: "Authentic Craftsmanship", description: "Every saree is handwoven by skilled artisans using traditional techniques passed down through generations." },
    { title: "Artisan Partnerships", description: "We work directly with weaving communities in and around Erode, ensuring fair wages and preserving their art." },
    { title: "Quality Promise", description: "Each piece undergoes rigorous quality checks. We sell only genuine handloom silk and silk cotton sarees." },
    { title: "Erode Heritage", description: "Rooted in Erode, the heart of Tamil Nadu\u2019s textile tradition, bringing you the finest soft silk sarees." },
  ],
  aboutMilestones: [
    { year: "Founded", event: "Established in Erode with a passion for fancy handloom silk & silk cotton sarees" },
    { year: "Growth", event: "Expanded our collection of soft silk and silk cotton sarees for every occasion" },
    { year: "Community", event: "Partnered with local artisan families across Erode district" },
    { year: "Online", event: "Launched online store to reach customers across Tamil Nadu and India" },
    { year: "Today", event: "Serving thousands of happy customers with premium soft silk sarees" },
  ],
  // Contact
  contactHeroTitle: "Contact Us",
  contactHeroSubtitle: "Have questions about our sarees? Need help with an order? We'd love to hear from you.",
  contactHeroBannerImage: "",
  contactAddress: ["875, Mettupalayam Main Road", "Erangattur, Uthandiyur (P.O.)", "Sathy (Tk.) Erode (Dt.) - 638 451"],
  contactPhones: ["+91 90803 16738", "+91 78068 65407"],
  contactEmail: "mahalakshmisilks@email.com",
  contactBusinessHours: ["Mon - Sat: 9AM - 9PM", "Sunday: Closed"],
  contactMapDescription:
    "Located on Mettupalayam Main Road near Erangattur, Sathy Taluk, Erode District. Visit our showroom to explore our complete collection of fancy handloom silk and silk cotton sarees.",
  contactFaqs: [
    { q: "Do you ship internationally?", a: "Currently we ship across India. International shipping is coming soon. Subscribe to our newsletter for updates." },
    { q: "Are these sarees handwoven?", a: "Yes, all our sarees are handwoven by skilled artisans. Each piece comes with a Silk Mark certification." },
    { q: "What is your return policy?", a: "We offer a 7-day return policy for unused sarees in original packaging. Contact our support team to initiate a return." },
    { q: "Do you offer bulk or wholesale pricing?", a: "Yes! We offer special pricing for bulk orders. Please contact us via the form above or email wholesale@mahalakshmisilk.com." },
  ],
};

const STORAGE_KEY = "mahalakshmi_site_content";

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults so new fields added later don't break
        setSiteContent((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(siteContent));
  }, [siteContent, loaded]);

  const updateSiteContent = useCallback((data: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <SiteContentContext.Provider value={{ siteContent, updateSiteContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
