"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Clock } from "lucide-react";
import { formatPrice, getDiscountPercentage, timeAgo } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useWishlist } from "@/context/WishlistContext";
import { useReviews } from "@/context/ReviewContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export default function SareeDetailPage() {
  const params = useParams();
  const { products } = useAdmin();
  const product = products.find((p) => p.slug === params.slug);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getProductReviews, addReview } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-maroon-800 mb-4">Saree Not Found</h1>
          <Link href="/sarees" className="btn-primary">Browse Sarees</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.silkType === product.silkType && p.id !== product.id)
    .slice(0, 4);
  const hasImages = product.images && product.images.length > 0 && product.images[0];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-cream-100 border-b border-gold-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-maroon-700">Home</Link>
          <ChevronRight size={14} />
          <Link href="/sarees" className="hover:text-maroon-700">Sarees</Link>
          <ChevronRight size={14} />
          <span className="text-maroon-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div
              className="relative aspect-[4/5] rounded-sm overflow-hidden border-2 border-gold-200 mb-4 cursor-crosshair"
              ref={imageRef}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={(e) => {
                if (!imageRef.current) return;
                const rect = imageRef.current.getBoundingClientRect();
                setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
              }}
            >
              {hasImages ? (
                <img src={product.images[selectedImage] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <PlaceholderImage label={product.name} variant="saree" />
              )}
              {product.discountPrice && (
                <span className="absolute top-4 left-4 bg-maroon-700 text-white text-sm px-3 py-1.5 font-medium z-10">
                  {getDiscountPercentage(product.price, product.discountPrice)}% OFF
                </span>
              )}
              {showZoom && hasImages && (
                <div className="absolute w-32 h-32 border-2 border-maroon-600/60 bg-white/20 pointer-events-none rounded-sm z-20"
                  style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%`, transform: "translate(-50%, -50%)" }} />
              )}
            </div>
            {showZoom && hasImages && imageRef.current && (() => {
              const rect = imageRef.current.getBoundingClientRect();
              return (
                <div className="hidden lg:block fixed border-2 border-gold-200 rounded-sm shadow-2xl bg-white z-[9999] pointer-events-none"
                  style={{
                    left: `${rect.right + 16}px`, top: `${rect.top}px`, width: `${Math.min(500, window.innerWidth - rect.right - 32)}px`, height: `${rect.height}px`,
                    backgroundImage: `url(${product.images[selectedImage] || product.images[0]})`, backgroundSize: "250%", backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, backgroundRepeat: "no-repeat"
                  }} />
              );
            })()}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === i ? "border-maroon-700 shadow-md" : "border-gold-200 opacity-60 hover:opacity-100"}`}>
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-gold-600 tracking-[0.3em] uppercase text-sm mb-2">{product.silkType}</p>
            <h1 className="font-heading text-3xl md:text-4xl text-maroon-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl text-maroon-800">{formatPrice(product.discountPrice || product.price)}</span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm text-green-600 font-medium">Save {formatPrice(product.price - product.discountPrice)}</span>
                </>
              )}
            </div>
            <OrnamentDivider className="justify-start my-6" />
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-maroon-800 mb-3">Available Colors</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="px-3 py-1.5 text-xs border border-gold-200 rounded-sm text-gray-600">{color}</span>
                ))}
              </div>
            </div>
            <p className={`text-sm mb-6 ${product.stock > 5 ? "text-green-600" : product.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
              {product.stock === 0 ? "Out of Stock" : product.stock > 5 ? `In Stock (${product.stock} available)` : `Only ${product.stock} left!`}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gold-200 rounded-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-cream-100 transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-cream-100 transition-colors"><Plus size={16} /></button>
              </div>
              <button onClick={() => addToCart(product, quantity)} disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={18} /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`p-3 border rounded-sm transition-colors ${isInWishlist(product.id) ? "bg-red-500 border-red-500 text-white" : "btn-secondary hover:border-red-400 hover:text-red-500"}`}>
                <Heart size={18} className={isInWishlist(product.id) ? "fill-white" : ""} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-cream-100 rounded-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600"><Truck size={16} className="text-gold-600 shrink-0" /><span>Free Shipping</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-600"><Shield size={16} className="text-gold-600 shrink-0" /><span>Silk Certified</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-600"><RotateCcw size={16} className="text-gold-600 shrink-0" /><span>7-Day Returns</span></div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gold-200 pt-8">
          <div className="flex gap-8 border-b border-gold-200 mb-8">
            {(["description", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? "text-maroon-800" : "text-gray-400 hover:text-gray-600"}`}>
                {tab} {tab === "reviews" && `(${getProductReviews(product.id).length})`}
                {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-maroon-700" />}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cream-100 p-4 rounded-sm"><p className="text-xs text-gold-600 uppercase tracking-wider">Silk Type</p><p className="font-medium text-maroon-800">{product.silkType}</p></div>
                <div className="bg-cream-100 p-4 rounded-sm"><p className="text-xs text-gold-600 uppercase tracking-wider">Category</p><p className="font-medium text-maroon-800 capitalize">{product.category}</p></div>
                <div className="bg-cream-100 p-4 rounded-sm"><p className="text-xs text-gold-600 uppercase tracking-wider">Colors</p><p className="font-medium text-maroon-800">{product.colors.join(", ")}</p></div>
                <div className="bg-cream-100 p-4 rounded-sm"><p className="text-xs text-gold-600 uppercase tracking-wider">Rating</p><p className="font-medium text-maroon-800">{product.rating}/5</p></div>
              </div>
            </motion.div>
          ) : (
            /* ── Simple Clean Reviews ── */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-6">

              {/* Compact rating row */}
              {(() => {
                const rs = getProductReviews(product.id);
                const avg = rs.length ? rs.reduce((s, r) => s + r.rating, 0) / rs.length : 0;
                return (
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-2xl text-maroon-800">{rs.length ? avg.toFixed(1) : "—"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < Math.round(avg) ? "fill-gold-400 text-gold-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{rs.length} review{rs.length !== 1 ? "s" : ""}</span>
                  </div>
                );
              })()}

              {/* Reviews */}
              {(() => {
                const rs = getProductReviews(product.id);
                return rs.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {rs.map((review) => (
                      <div key={review.id} className="py-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-maroon-800">{review.userName}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={11} className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-gray-200"} />
                              ))}
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{timeAgo(review.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                        {review.adminReply && (
                          <div className="mt-1.5 ml-3 pl-3 border-l-2 border-gold-300">
                            <span className="text-xs font-semibold text-maroon-700">Mahalakshmi Silks</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 ml-1"><Clock size={9} />{timeAgo(review.adminReply.date)}</span>
                            <span className="text-xs text-gray-500 italic block mt-0.5">{review.adminReply.message}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
                );
              })()}

              {/* Write a review */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-maroon-800 mb-3">Write a Review</p>
                {reviewSubmitted ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-500 shrink-0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>
                    Review submitted!
                    <button onClick={() => { setReviewSubmitted(false); setReviewName(""); setReviewComment(""); setReviewRating(0); }}
                      className="text-gray-400 hover:text-gray-600 underline ml-1 text-xs">Write another</button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <input className="input-vintage text-sm" placeholder="Your name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button"
                          onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)} onClick={() => setReviewRating(star)}>
                          <Star size={20} className={star <= (reviewHover || reviewRating) ? "fill-gold-400 text-gold-400" : "text-gray-300"} />
                        </button>
                      ))}
                      {reviewRating > 0 && <span className="text-xs text-gray-400 ml-1">{["Poor", "Fair", "Good", "Very Good", "Excellent"][reviewRating - 1]}</span>}
                    </div>
                    <textarea className="input-vintage text-sm h-20 resize-none" placeholder="Your experience with this saree..."
                      value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                    <button
                      onClick={() => {
                        if (!reviewName.trim() || !reviewRating || !reviewComment.trim()) return;
                        addReview({ productId: product.id, userName: reviewName.trim(), rating: reviewRating, comment: reviewComment.trim() });
                        setReviewSubmitted(true);
                      }}
                      disabled={!reviewName.trim() || !reviewRating || !reviewComment.trim()}
                      className="btn-primary text-sm px-5 py-2 disabled:opacity-40"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl text-maroon-800 text-center mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
