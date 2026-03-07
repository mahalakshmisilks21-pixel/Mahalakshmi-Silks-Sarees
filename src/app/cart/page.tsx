"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="text-gold-300 mx-auto mb-6" />
          <h1 className="font-heading text-3xl text-maroon-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven&apos;t added any beautiful silk sarees to your cart yet.
          </p>
          <Link href="/sarees" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-maroon-800 to-maroon-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Your Selection</p>
          <h1 className="font-heading text-4xl text-white">Shopping Cart</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-vintage p-4 flex gap-4"
              >
                <div className="relative w-24 h-32 rounded-sm overflow-hidden shrink-0">
                    <PlaceholderImage label={item.product.name.slice(0, 20)} variant="saree" />
                  </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gold-600 text-xs tracking-wider uppercase">{item.product.silkType}</p>
                  <Link href={`/sarees/${item.product.slug}`}>
                    <h3 className="font-heading text-lg text-maroon-800 hover:text-maroon-600 truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="font-heading text-lg text-maroon-800 mt-1">
                    {formatPrice(item.product.discountPrice || item.product.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gold-200 rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-cream-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-cream-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-maroon-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <button onClick={clearCart} className="text-sm text-maroon-600 hover:text-maroon-800 underline">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="card-vintage p-6">
              <h2 className="font-heading text-xl text-maroon-800 mb-4">Order Summary</h2>
              <OrnamentDivider className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">{totalPrice >= 5000 ? "FREE" : formatPrice(199)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 5%)</span>
                  <span className="font-medium">{formatPrice(totalPrice * 0.05)}</span>
                </div>
              </div>

              <div className="border-t border-gold-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-heading text-lg text-maroon-800">Total</span>
                  <span className="font-heading text-xl text-maroon-800">
                    {formatPrice(totalPrice + totalPrice * 0.05 + (totalPrice >= 5000 ? 0 : 199))}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="input-vintage pl-9 py-2 text-sm"
                  />
                </div>
                <button className="btn-secondary py-2 px-4 text-sm">Apply</button>
              </div>

              <Link href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight size={16} />
                </Link>

              <Link href="/sarees" className="block text-center text-sm text-maroon-600 hover:text-maroon-800 mt-4">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
