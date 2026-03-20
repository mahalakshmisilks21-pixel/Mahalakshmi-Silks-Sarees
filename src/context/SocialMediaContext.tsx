"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface SocialMediaSettings {
    whatsappNumber: string;
    instagramUrl: string;
    telegramUrl: string;
    phoneNumber: string;
}

interface SocialMediaContextType {
    social: SocialMediaSettings;
    updateSocial: (data: Partial<SocialMediaSettings>) => void;
    getWhatsAppLink: (message?: string) => string;
}

const SocialMediaContext = createContext<SocialMediaContextType | null>(null);

const DEFAULT_SOCIAL: SocialMediaSettings = {
    whatsappNumber: "918489240766",
    instagramUrl: "https://www.instagram.com/mahalakshmi_silks",
    telegramUrl: "https://t.me/mahalakshmisilks",
    phoneNumber: "+918489240766",
};

const STORAGE_KEY = "mahalakshmi_social";

export function SocialMediaProvider({ children }: { children: ReactNode }) {
    const [social, setSocial] = useState<SocialMediaSettings>(DEFAULT_SOCIAL);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setSocial(JSON.parse(saved));
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(social));
    }, [social, loaded]);

    const updateSocial = useCallback((data: Partial<SocialMediaSettings>) => {
        setSocial((prev) => ({ ...prev, ...data }));
    }, []);

    const getWhatsAppLink = useCallback((message?: string) => {
        const base = `https://wa.me/${social.whatsappNumber}`;
        return message ? `${base}?text=${encodeURIComponent(message)}` : base;
    }, [social.whatsappNumber]);

    return (
        <SocialMediaContext.Provider value={{ social, updateSocial, getWhatsAppLink }}>
            {children}
        </SocialMediaContext.Provider>
    );
}

export function useSocialMedia() {
    const ctx = useContext(SocialMediaContext);
    if (!ctx) throw new Error("useSocialMedia must be used within SocialMediaProvider");
    return ctx;
}
