"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, Trash2, Reply, X, Check, Filter, Clock } from "lucide-react";
import { useReviews } from "@/context/ReviewContext";
import { useAdmin } from "@/context/AdminContext";
import { timeAgo } from "@/lib/utils";

type FilterType = "all" | "replied" | "pending";

export default function AdminReviewsPage() {
    const { reviews, addAdminReply, deleteReview } = useReviews();
    const { products } = useAdmin();
    const [filter, setFilter] = useState<FilterType>("all");
    const [replyModal, setReplyModal] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filtered = reviews.filter((r) => {
        if (filter === "replied") return !!r.adminReply;
        if (filter === "pending") return !r.adminReply;
        return true;
    });

    const getProductName = (productId: string) =>
        products.find((p) => p.id === productId)?.name ?? "Unknown Product";

    const handleReply = (reviewId: string) => {
        if (!replyText.trim()) return;
        addAdminReply(reviewId, replyText.trim());
        setReplyText("");
        setReplyModal(null);
    };

    const pendingCount = reviews.filter((r) => !r.adminReply).length;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-2xl text-maroon-900">Customer Reviews</h1>
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} total · {pendingCount} pending reply</p>
                </div>
                {/* Filter tabs */}
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-gray-400" />
                    {(["all", "pending", "replied"] as FilterType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs rounded-sm border capitalize transition-colors ${filter === f
                                ? "bg-maroon-700 text-white border-maroon-700"
                                : "border-gold-200 text-gray-600 hover:border-maroon-400"
                                }`}
                        >
                            {f}
                            {f === "pending" && pendingCount > 0 && (
                                <span className="ml-1.5 bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5">{pendingCount}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No reviews found.</p>
                        </div>
                    ) : (
                        filtered.map((review) => {
                            const productName = getProductName(review.productId);
                            return (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="card-vintage p-5"
                                >
                                    {/* Review header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-maroon-100 flex items-center justify-center shrink-0">
                                                <span className="font-heading text-maroon-700 text-sm">{review.userName[0]}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium text-sm text-maroon-800">{review.userName}</span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{timeAgo(review.date)}</span>
                                                    {review.adminReply ? (
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Replied</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pending</span>
                                                    )}
                                                </div>
                                                {/* Stars */}
                                                <div className="flex items-center gap-0.5 my-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} size={12} className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gold-600 tracking-wide mb-1">on {productName}</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => { setReplyModal(review.id); setReplyText(review.adminReply?.message ?? ""); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gold-300 text-maroon-700 hover:bg-maroon-700 hover:text-white hover:border-maroon-700 transition-colors rounded-sm"
                                            >
                                                <Reply size={12} /> {review.adminReply ? "Edit Reply" : "Reply"}
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(review.id)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-sm transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Existing admin reply */}
                                    {review.adminReply && (
                                        <div className="mt-4 ml-12 pl-4 border-l-2 border-gold-300 bg-gold-50/50 rounded-sm p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 rounded-full bg-maroon-700 flex items-center justify-center">
                                                    <span className="text-white text-[9px] font-bold">M</span>
                                                </div>
                                                <span className="text-xs font-semibold text-maroon-700">Mahalakshmi Silks</span>
                                                <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{timeAgo(review.adminReply.date)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.adminReply.message}</p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setReplyModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-sm shadow-xl p-6 w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-heading text-lg text-maroon-800">Reply as Mahalakshmi Silks</h3>
                                <button onClick={() => setReplyModal(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <textarea
                                className="input-vintage h-32 resize-none w-full mb-4"
                                placeholder="Write your reply to the customer..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setReplyModal(null)} className="btn-secondary text-sm px-4 py-2">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReply(replyModal)}
                                    disabled={!replyText.trim()}
                                    className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Check size={14} /> Post Reply
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-sm shadow-xl p-6 w-full max-w-sm text-center"
                        >
                            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
                            <h3 className="font-heading text-lg text-maroon-800 mb-2">Delete Review?</h3>
                            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                                <button
                                    onClick={() => { deleteReview(deleteConfirm); setDeleteConfirm(null); }}
                                    className="flex-1 bg-red-600 text-white text-sm py-2 rounded-sm hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
