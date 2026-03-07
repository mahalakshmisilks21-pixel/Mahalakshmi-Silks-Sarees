"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/lib/data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const hasImage = product.images.length > 0 && product.images[0];
  const hasSecondImage = product.images.length > 1 && product.images[1];

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

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="font-heading text-xl text-maroon-800">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
