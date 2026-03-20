"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Clock, MessageCircle, Send, Link2, Check, Share2, X } from "lucide-react";
import { formatPrice, getDiscountPercentage, timeAgo, generateWhatsAppProductMessage, openWhatsApp } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useWishlist } from "@/context/WishlistContext";
import { useReviews } from "@/context/ReviewContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useSocialMedia } from "@/context/SocialMediaContext";

export default function SareeDetailPage() {
  const params = useParams();
  const { products } = useAdmin();
  const product = products.find((p) => p.slug === params.slug);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getProductReviews, addReview } = useReviews();
  const { social } = useSocialMedia();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close share popup on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    if (shareOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [shareOpen]);

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
            {(() => {
              /* ── Image Viewer State ── */
              const [lightboxOpen, setLightboxOpen] = useState(false);
              const [autoPlay, setAutoPlay] = useState(true);
              const [progress, setProgress] = useState(0);
              const [mobileZoomed, setMobileZoomed] = useState(false);
              const [mobilePan, setMobilePan] = useState({ x: 0, y: 0 });
              const lastTapRef = useRef(0);
              const autoPlayInterval = 4000;

              // Auto-play slideshow
              useEffect(() => {
                if (!autoPlay || !hasImages || product.images.length <= 1) return;
                const startTime = Date.now();
                const timer = setInterval(() => {
                  const elapsed = Date.now() - startTime;
                  const p = (elapsed % autoPlayInterval) / autoPlayInterval;
                  setProgress(p);
                  if (elapsed > 0 && elapsed % autoPlayInterval < 50) {
                    setSelectedImage((prev) => (prev + 1) % product.images.length);
                  }
                }, 50);
                return () => clearInterval(timer);
              }, [autoPlay, hasImages, product.images.length, selectedImage]);

              // Lightbox keyboard controls
              useEffect(() => {
                if (!lightboxOpen) return;
                const handleKey = (e: KeyboardEvent) => {
                  if (e.key === "Escape") setLightboxOpen(false);
                  if (e.key === "ArrowRight") setSelectedImage((prev) => (prev + 1) % product.images.length);
                  if (e.key === "ArrowLeft") setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
                };
                window.addEventListener("keydown", handleKey);
                return () => window.removeEventListener("keydown", handleKey);
              }, [lightboxOpen, product.images.length]);

              // Mobile double-tap handler
              const handleDoubleTap = () => {
                const now = Date.now();
                if (now - lastTapRef.current < 300) {
                  setMobileZoomed(!mobileZoomed);
                  setMobilePan({ x: 0, y: 0 });
                }
                lastTapRef.current = now;
              };

              return (
                <>
                  {/* Main Image */}
                  <div
                    className="relative aspect-[4/5] rounded-sm overflow-hidden border-2 border-gold-200 mb-4 cursor-crosshair"
                    ref={imageRef}
                    onMouseEnter={() => { setShowZoom(true); setAutoPlay(false); }}
                    onMouseLeave={() => { setShowZoom(false); setAutoPlay(true); }}
                    onMouseMove={(e) => {
                      if (!imageRef.current) return;
                      const rect = imageRef.current.getBoundingClientRect();
                      setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                    }}
                    onClick={() => {
                      if (window.innerWidth >= 1024) setLightboxOpen(true);
                    }}
                    onTouchEnd={handleDoubleTap}
                  >
                    {hasImages ? (
                      <img
                        src={product.images[selectedImage] || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300"
                        style={mobileZoomed ? { transform: `scale(2.5) translate(${mobilePan.x}px, ${mobilePan.y}px)` } : {}}
                        draggable={false}
                        onTouchMove={(e) => {
                          if (!mobileZoomed) return;
                          const touch = e.touches[0];
                          setMobilePan((prev) => ({
                            x: Math.max(-60, Math.min(60, prev.x + (touch.clientX > (imageRef.current?.getBoundingClientRect().left ?? 0) + (imageRef.current?.getBoundingClientRect().width ?? 0) / 2 ? -1 : 1))),
                            y: Math.max(-60, Math.min(60, prev.y + (touch.clientY > (imageRef.current?.getBoundingClientRect().top ?? 0) + (imageRef.current?.getBoundingClientRect().height ?? 0) / 2 ? -1 : 1))),
                          }));
                        }}
                      />
                    ) : (
                      <PlaceholderImage label={product.name} variant="saree" />
                    )}

                    {/* Discount badge */}
                    {product.discountPrice && (
                      <span className="absolute top-4 left-4 bg-maroon-700 text-white text-sm px-3 py-1.5 font-medium z-10">
                        {getDiscountPercentage(product.price, product.discountPrice)}% OFF
                      </span>
                    )}

                    {/* Magnifier indicator (hover crosshair) */}
                    {showZoom && hasImages && (
                      <div className="absolute w-28 h-28 border-2 border-gold-500/50 bg-white/10 pointer-events-none rounded-full z-20 backdrop-blur-[1px]"
                        style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%`, transform: "translate(-50%, -50%)" }} />
                    )}

                    {/* Click-to-expand hint */}
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none lg:flex hidden">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      Click to expand
                    </div>

                    {/* Mobile zoom hint */}
                    {mobileZoomed && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full z-30 lg:hidden">
                        Double-tap to exit zoom
                      </div>
                    )}
                  </div>

                  {/* Magnifier Panel (Desktop) — appears to the right */}
                  {showZoom && hasImages && imageRef.current && (() => {
                    const rect = imageRef.current.getBoundingClientRect();
                    return (
                      <div className="hidden lg:block fixed border-2 border-gold-200 rounded-sm shadow-2xl bg-white z-[9999] pointer-events-none"
                        style={{
                          left: `${rect.right + 16}px`, top: `${rect.top}px`,
                          width: `${Math.min(500, window.innerWidth - rect.right - 32)}px`, height: `${rect.height}px`,
                          backgroundImage: `url(${product.images[selectedImage] || product.images[0]})`,
                          backgroundSize: "300%", backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`, backgroundRepeat: "no-repeat"
                        }} />
                    );
                  })()}

                  {/* Thumbnails with auto-play progress */}
                  {hasImages && product.images.length > 1 && (
                    <div className="flex gap-3 items-end">
                      {product.images.map((img, i) => (
                        <button key={i}
                          onClick={() => { setSelectedImage(i); setAutoPlay(false); setTimeout(() => setAutoPlay(true), 8000); }}
                          onMouseEnter={() => setAutoPlay(false)}
                          onMouseLeave={() => setAutoPlay(true)}
                          className={`relative w-20 h-24 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === i ? "border-maroon-700 shadow-md" : "border-gold-200 opacity-60 hover:opacity-100"}`}
                        >
                          <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                          {/* Progress bar on active thumbnail */}
                          {selectedImage === i && autoPlay && (
                            <div className="absolute bottom-0 left-0 h-0.5 bg-maroon-700 transition-none"
                              style={{ width: `${progress * 100}%` }} />
                          )}
                        </button>
                      ))}
                      {/* Auto-play toggle */}
                      <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`ml-auto text-[10px] px-2.5 py-1 rounded-full border transition-colors ${autoPlay ? "bg-maroon-700 text-white border-maroon-700" : "text-gray-500 border-gray-300 hover:border-maroon-400"}`}
                      >
                        {autoPlay ? "⏸ Auto" : "▶ Auto"}
                      </button>
                    </div>
                  )}

                  {/* ── Full-Screen Lightbox ── */}
                  <AnimatePresence>
                    {lightboxOpen && hasImages && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                      >
                        {/* Close button */}
                        <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10" onClick={() => setLightboxOpen(false)}>
                          <X size={28} />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-6 left-6 text-white/60 text-sm font-medium">
                          {selectedImage + 1} / {product.images.length}
                        </div>

                        {/* Previous button */}
                        {product.images.length > 1 && (
                          <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length); }}
                          >
                            <ChevronRight size={24} className="rotate-180" />
                          </button>
                        )}

                        {/* Main lightbox image */}
                        <motion.img
                          key={selectedImage}
                          src={product.images[selectedImage]}
                          alt={product.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm"
                          onClick={(e) => e.stopPropagation()}
                        />

                        {/* Next button */}
                        {product.images.length > 1 && (
                          <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev + 1) % product.images.length); }}
                          >
                            <ChevronRight size={24} />
                          </button>
                        )}

                        {/* Lightbox thumbnails */}
                        {product.images.length > 1 && (
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.images.map((img, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                                className={`w-14 h-16 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === i ? "border-white shadow-lg" : "border-white/30 opacity-50 hover:opacity-80"}`}
                              >
                                <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Keyboard hint */}
                        <div className="absolute bottom-6 right-6 text-white/30 text-[10px] hidden lg:block">
                          ← → Navigate &nbsp;|&nbsp; Esc Close
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              );
            })()}
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
            <div className="flex items-center gap-3 mb-8">
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

              {/* Share Button — next to Wishlist */}
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className={`p-3 border rounded-sm transition-colors ${shareOpen ? "bg-maroon-700 border-maroon-700 text-white" : "btn-secondary hover:border-maroon-400 hover:text-maroon-700"}`}
                  title="Share this saree"
                >
                  {shareOpen ? <X size={18} /> : <Share2 size={18} />}
                </button>

                <AnimatePresence>
                  {shareOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 bg-white border border-gold-200 rounded-lg shadow-xl p-2 z-50 min-w-[200px]"
                    >
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2.5 pb-1.5 mb-1 border-b border-gray-100 font-medium">Share via</p>

                      <button
                        onClick={() => {
                          const url = typeof window !== "undefined" ? window.location.href : "";
                          const msg = generateWhatsAppProductMessage(product.name, product.price, product.discountPrice ?? null, url);
                          openWhatsApp(msg, social.whatsappNumber);
                          setShareOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors text-sm"
                      >
                        <MessageCircle size={16} className="text-green-500" />
                        WhatsApp
                      </button>

                      <button
                        onClick={() => {
                          window.open(social.instagramUrl, "_blank");
                          setShareOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors text-sm"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-500">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        Instagram
                      </button>

                      <button
                        onClick={() => {
                          const url = typeof window !== "undefined" ? window.location.href : "";
                          const text = `Check out this beautiful ${product.name} from Mahalakshmi Silks! ${url}`;
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
                          setShareOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors text-sm"
                      >
                        <Send size={16} className="text-blue-500" />
                        Telegram
                      </button>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard.writeText(window.location.href);
                              setLinkCopied(true);
                              setTimeout(() => { setLinkCopied(false); setShareOpen(false); }, 1500);
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-sm"
                        >
                          {linkCopied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} className="text-gray-400" />}
                          {linkCopied ? <span className="text-green-600">Copied!</span> : "Copy Link"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-cream-100 rounded-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600"><Truck size={16} className="text-gold-600 shrink-0" /><span>Free Shipping</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-600"><Shield size={16} className="text-gold-600 shrink-0" /><span>Silk Certified</span></div>
              <div className="flex items-center gap-2 text-xs text-gray-600"><RotateCcw size={16} className="text-gold-600 shrink-0" /><span>7-Day Returns</span></div>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-gold-200 pt-8">
          <h2 className="font-heading text-2xl text-maroon-800 mb-6">Reviews ({getProductReviews(product.id).length})</h2>

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
