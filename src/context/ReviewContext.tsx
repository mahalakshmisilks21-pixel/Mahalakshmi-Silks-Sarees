"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Review, reviews as seedReviews } from "@/lib/data";
import { supabase } from "@/lib/supabase";

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

    // Load reviews from Supabase on mount
    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from("reviews")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("[Reviews] Fetch error:", error);
                    setReviews(seedReviews);
                    return;
                }

                if (data && data.length > 0) {
                    // Map Supabase columns to Review interface
                    const mapped: Review[] = data.map((r: any) => ({
                        id: r.id,
                        productId: r.productId,
                        userName: r.userName,
                        rating: r.rating,
                        comment: r.comment,
                        date: r.date,
                        adminReply: r.adminReply || undefined,
                    }));
                    setReviews(mapped);
                } else {
                    // Seed initial reviews to Supabase
                    const toInsert = seedReviews.map((r) => ({
                        id: r.id,
                        productId: r.productId,
                        userName: r.userName,
                        rating: r.rating,
                        comment: r.comment,
                        date: r.date,
                        adminReply: r.adminReply || null,
                    }));
                    await supabase.from("reviews").insert(toInsert);
                    setReviews(seedReviews);
                }
            } catch (err) {
                console.error("[Reviews] Exception:", err);
                setReviews(seedReviews);
            }
        }
        fetchReviews();
    }, []);

    const getProductReviews = useCallback(
        (productId: string) => reviews.filter((r) => r.productId === productId),
        [reviews]
    );

    const addReview = useCallback((reviewData: Omit<Review, "id" | "date">) => {
        const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
        };

        // Update state immediately
        setReviews((prev) => [newReview, ...prev]);

        // Persist to Supabase
        supabase.from("reviews").insert({
            id: newReview.id,
            productId: newReview.productId,
            userName: newReview.userName,
            rating: newReview.rating,
            comment: newReview.comment,
            date: newReview.date,
            adminReply: null,
        }).then(({ error }) => {
            if (error) console.error("[Reviews] Insert error:", error);
            else console.log("[Reviews] New review saved to Supabase");
        });
    }, []);

    const addAdminReply = useCallback((reviewId: string, message: string) => {
        const reply = { message, date: new Date().toISOString().split("T")[0] };

        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId ? { ...r, adminReply: reply } : r
            )
        );

        // Persist to Supabase
        supabase.from("reviews")
            .update({ adminReply: reply })
            .eq("id", reviewId)
            .then(({ error }) => {
                if (error) console.error("[Reviews] Reply update error:", error);
            });
    }, []);

    const deleteReview = useCallback((reviewId: string) => {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));

        // Delete from Supabase
        supabase.from("reviews")
            .delete()
            .eq("id", reviewId)
            .then(({ error }) => {
                if (error) console.error("[Reviews] Delete error:", error);
            });
    }, []);

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
