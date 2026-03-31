"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

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
  // Welcome Popup
  welcomePopupEnabled: boolean;
  welcomePopupHeading: string;
  welcomePopupSubtitle: string;
  welcomePopupDiscountPercent: number;
  welcomePopupCollectEmail: boolean;
  welcomePopupCollectPhone: boolean;
  welcomePopupShowInstagram: boolean;
  welcomePopupButtonText: string;
  welcomePopupDismissText: string;
  welcomePopupShowOnce: boolean;
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
  contactHeroSubtitle: "Have questions about our sarees? Need help with an order? We\u2019d love to hear from you.",
  contactHeroBannerImage: "",
  contactAddress: ["875, Mettupalayam Main Road", "Erangattur, Uthandiyur (P.O.)", "Sathy (Tk.) Erode (Dt.) - 638 451"],
  contactPhones: ["+91 90803 16738", "+91 78068 65407"],
  contactEmail: "mahalakshmisilks21@gmail.com",
  contactBusinessHours: ["Mon - Sat: 9AM - 9PM", "Sunday: Closed"],
  contactMapDescription:
    "Located on Mettupalayam Main Road near Erangattur, Sathy Taluk, Erode District. Visit our showroom to explore our complete collection of fancy handloom silk and silk cotton sarees.",
  contactFaqs: [],
  // Welcome Popup
  welcomePopupEnabled: false,
  welcomePopupHeading: "GET 5% OFF ON YOUR FIRST PURCHASE 🎉",
  welcomePopupSubtitle: "Sign up and unlock your instant discount.",
  welcomePopupDiscountPercent: 5,
  welcomePopupCollectEmail: true,
  welcomePopupCollectPhone: true,
  welcomePopupShowInstagram: true,
  welcomePopupButtonText: "Claim discount",
  welcomePopupDismissText: "No, thanks",
  welcomePopupShowOnce: true,
};

const SUPABASE_TABLE = "site_content";
const ROW_ID = "main"; // single-row table

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  /* ── Load from Supabase on mount (works for ALL users, logged in or not) ── */
  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from(SUPABASE_TABLE)
          .select("content")
          .eq("id", ROW_ID)
          .single();

        if (data && !error) {
          // Merge with defaults so new fields added later don't break
          setSiteContent((prev) => ({ ...prev, ...data.content }));
        }
      } catch {
        // Table might not exist yet — use defaults
        console.log("site_content table not found, using defaults.");
      }
      setLoaded(true);
    }
    fetchContent();
  }, []);

  /* ── Save to Supabase whenever content changes (admin edits) ── */
  const updateSiteContent = useCallback((updates: Partial<SiteContent>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, ...updates };

      // Persist to Supabase (upsert = insert or update)
      supabase
        .from(SUPABASE_TABLE)
        .upsert({ id: ROW_ID, content: updated, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error("Save site content error:", error);
        });

      return updated;
    });
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
