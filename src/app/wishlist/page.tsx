"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-cream-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-gold-600 tracking-[0.3em] uppercase text-xs mb-1">Your Saved Items</p>
                        <h1 className="font-heading text-3xl md:text-4xl text-maroon-900">My Wishlist</h1>
                    </div>
                    <Link href="/sarees" className="flex items-center gap-2 text-sm text-maroon-700 hover:text-maroon-500 transition-colors">
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                {wishlist.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="w-24 h-24 rounded-full bg-maroon-100 flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} className="text-maroon-400" />
                        </div>
                        <h2 className="font-heading text-2xl text-maroon-800 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save your favourite sarees and come back to them anytime.</p>
                        <Link href="/sarees" className="btn-primary inline-flex items-center gap-2">
                            <ShoppingBag size={16} /> Explore Sarees
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-6">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {wishlist.map((product, i) => {
                                    const hasImage = product.images?.length > 0 && product.images[0];
                                    return (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            transition={{ duration: 0.4, delay: i * 0.05 }}
                                            className="card-vintage group relative overflow-hidden"
                                        >
                                            {/* Image */}
                                            <Link href={`/sarees/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
                                                {hasImage ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <PlaceholderImage label={product.name} variant="saree" />
                                                )}
                                                {product.discountPrice && (
                                                    <span className="absolute top-3 left-3 bg-maroon-700 text-white text-xs px-2.5 py-1">
                                                        {getDiscountPercentage(product.price, product.discountPrice)}% OFF
                                                    </span>
                                                )}
                                            </Link>

                                            {/* Info */}
                                            <div className="p-4">
                                                <p className="text-gold-600 text-xs tracking-[0.2em] uppercase mb-1">{product.silkType}</p>
                                                <Link href={`/sarees/${product.slug}`}>
                                                    <h3 className="font-heading text-base text-maroon-800 hover:text-maroon-600 transition-colors line-clamp-2 leading-snug mb-3">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="font-heading text-lg text-maroon-800">
                                                        {formatPrice(product.discountPrice || product.price)}
                                                    </span>
                                                    {product.discountPrice && (
                                                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { addToCart(product); }}
                                                        disabled={product.stock === 0}
                                                        className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        <ShoppingBag size={14} />
                                                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromWishlist(product.id)}
                                                        className="p-2 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors rounded-sm"
                                                        title="Remove from wishlist"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
