"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Share2, MessageCircle, Send, Link2, Check, X } from "lucide-react";
import { Product } from "@/lib/data";
import { formatPrice, getDiscountPercentage, generateWhatsAppProductMessage, openWhatsApp } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSocialMedia } from "@/context/SocialMediaContext";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { social } = useSocialMedia();
  const wishlisted = isInWishlist(product.id);
  const hasImage = product.images.length > 0 && product.images[0];
  const hasSecondImage = product.images.length > 1 && product.images[1];
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const productUrl = typeof window !== "undefined" ? `${window.location.origin}/sarees/${product.slug}` : "";

  const handleWhatsAppShare = () => {
    const msg = generateWhatsAppProductMessage(product.name, product.price, product.discountPrice ?? null, productUrl);
    openWhatsApp(msg, social.whatsappNumber);
    setShareOpen(false);
  };

  const handleTelegramShare = () => {
    const text = `✨ Check out this beautiful ${product.name} from Mahalakshmi Silks! ${productUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`, "_blank");
    setShareOpen(false);
  };

  const handleInstagramShare = () => {
    window.open(social.instagramUrl, "_blank");
    setShareOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="card-vintage group relative overflow-hidden"
    >
      {/* Image */}
      <Link href={`/sarees/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        {hasImage ? (
          <>
            {/* Primary Image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${hasSecondImage ? "group-hover:opacity-0" : "group-hover:scale-110"}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Secondary Image (shown on hover) */}
            {hasSecondImage && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <PlaceholderImage label={product.name} variant="saree" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="bg-maroon-700 text-white text-xs px-2.5 py-1 font-medium">
              {getDiscountPercentage(product.price, product.discountPrice)}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gold-500 text-white text-xs px-2.5 py-1 font-medium">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={`backdrop-blur-sm p-2 rounded-full shadow-md transition-colors ${wishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 hover:bg-red-500 hover:text-white"
              }`}
          >
            <Heart size={16} className={wishlisted ? "fill-white" : ""} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-maroon-700 hover:text-white transition-colors"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-gold-600 text-xs tracking-[0.2em] uppercase mb-1">{product.silkType}</p>
        <Link href={`/sarees/${product.slug}`}>
          <h3 className="font-heading text-lg text-maroon-800 leading-snug hover:text-maroon-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? "fill-gold-400 text-gold-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price + Share */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl text-maroon-800">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Share Button */}
          <div className="relative" ref={shareRef}>
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className={`p-2 rounded-full border transition-all duration-300 ${
                shareOpen
                  ? "bg-maroon-700 border-maroon-700 text-white"
                  : "border-gold-200 text-gray-400 hover:border-maroon-400 hover:text-maroon-700 hover:bg-maroon-50"
              }`}
              title="Share this saree"
            >
              {shareOpen ? <X size={14} /> : <Share2 size={14} />}
            </button>

            {/* Share Popup */}
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-2 bg-white border border-gold-200 rounded-lg shadow-xl p-2 z-50 min-w-[180px]"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pb-1.5 mb-1 border-b border-gray-100 font-medium">Share via</p>
                  
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors text-sm"
                  >
                    <MessageCircle size={16} className="text-green-500" />
                    WhatsApp
                  </button>

                  <button
                    onClick={handleInstagramShare}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink-500">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                    <span className="text-[10px] text-gray-400 ml-auto">copy</span>
                  </button>

                  <button
                    onClick={handleTelegramShare}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors text-sm"
                  >
                    <Send size={16} className="text-blue-500" />
                    Telegram
                  </button>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-sm"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} className="text-gray-400" />}
                      {copied ? <span className="text-green-600">Copied!</span> : "Copy Link"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
