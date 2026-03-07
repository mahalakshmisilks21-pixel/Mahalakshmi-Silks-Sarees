"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Review, reviews as seedReviews } from "@/lib/data";

interface ReviewContextType {
    reviews: Review[];
    getProductReviews: (productId: string) => Review[];
    addReview: (review: Omit<Review, "id" | "date">) => void;
    addAdminReply: (reviewId: string, message: string) => void;
    deleteReview: (reviewId: string) => void;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([]);

    // Load from localStorage, seed from data.ts on first load
    useEffect(() => {
        try {
            const stored = localStorage.getItem("mahalakshmi-reviews");
            if (stored) {
                setReviews(JSON.parse(stored));
            } else {
                setReviews(seedReviews);
                localStorage.setItem("mahalakshmi-reviews", JSON.stringify(seedReviews));
            }
        } catch {
            setReviews(seedReviews);
        }
    }, []);

    // Persist on change
    useEffect(() => {
        if (reviews.length > 0) {
            localStorage.setItem("mahalakshmi-reviews", JSON.stringify(reviews));
        }
    }, [reviews]);

    const getProductReviews = (productId: string) =>
        reviews.filter((r) => r.productId === productId);

    const addReview = (reviewData: Omit<Review, "id" | "date">) => {
        const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
        };
        setReviews((prev) => [newReview, ...prev]);
    };

    const addAdminReply = (reviewId: string, message: string) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId
                    ? {
                        ...r,
                        adminReply: {
                            message,
                            date: new Date().toISOString().split("T")[0],
                        },
                    }
                    : r
            )
        );
    };

    const deleteReview = (reviewId: string) => {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    };

    return (
        <ReviewContext.Provider value={{ reviews, getProductReviews, addReview, addAdminReply, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    const ctx = useContext(ReviewContext);
    if (!ctx) throw new Error("useReviews must be used inside ReviewProvider");
    return ctx;
}
