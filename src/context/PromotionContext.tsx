"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Offer {
    id: string;
    title: string;
    description: string;
    code: string;
    discount: number;
    active: boolean;
}

interface AnnouncementBar {
    text: string;
    enabled: boolean;
}

interface PromotionContextType {
    announcement: AnnouncementBar;
    updateAnnouncement: (data: Partial<AnnouncementBar>) => void;
    offers: Offer[];
    addOffer: (offer: Omit<Offer, "id">) => void;
    updateOffer: (id: string, data: Partial<Offer>) => void;
    deleteOffer: (id: string) => void;
}

const PromotionContext = createContext<PromotionContextType | null>(null);

const DEFAULT_ANNOUNCEMENT: AnnouncementBar = {
    text: "FREE SHIPPING ON ORDERS ABOVE ₹5,000 | USE CODE: SILK15 FOR 15% OFF",
    enabled: true,
};

const STORAGE_KEY_ANNOUNCEMENT = "mahalakshmi_announcement";
const STORAGE_KEY_OFFERS = "mahalakshmi_offers";

export function PromotionProvider({ children }: { children: ReactNode }) {
    const [announcement, setAnnouncement] = useState<AnnouncementBar>(DEFAULT_ANNOUNCEMENT);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedAnn = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENT);
            if (savedAnn) setAnnouncement(JSON.parse(savedAnn));

            const savedOffers = localStorage.getItem(STORAGE_KEY_OFFERS);
            if (savedOffers) {
                setOffers(JSON.parse(savedOffers));
            }
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    // Persist announcement
    useEffect(() => {
        if (loaded) localStorage.setItem(STORAGE_KEY_ANNOUNCEMENT, JSON.stringify(announcement));
    }, [announcement, loaded]);

    // Persist offers
    useEffect(() => {
        if (loaded) localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(offers));
    }, [offers, loaded]);

    const updateAnnouncement = useCallback((data: Partial<AnnouncementBar>) => {
        setAnnouncement((prev) => ({ ...prev, ...data }));
    }, []);

    const addOffer = useCallback((offer: Omit<Offer, "id">) => {
        const newOffer: Offer = { ...offer, id: `offer-${Date.now()}` };
        setOffers((prev) => [...prev, newOffer]);
    }, []);

    const updateOffer = useCallback((id: string, data: Partial<Offer>) => {
        setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    }, []);

    const deleteOffer = useCallback((id: string) => {
        setOffers((prev) => prev.filter((o) => o.id !== id));
    }, []);

    return (
        <PromotionContext.Provider value={{ announcement, updateAnnouncement, offers, addOffer, updateOffer, deleteOffer }}>
            {children}
        </PromotionContext.Provider>
    );
}

export function usePromotions() {
    const ctx = useContext(PromotionContext);
    if (!ctx) throw new Error("usePromotions must be used within PromotionProvider");
    return ctx;
}
