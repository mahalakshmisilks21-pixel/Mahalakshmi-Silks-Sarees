"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Truck, Check, ChevronRight, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, generateWhatsAppOrderMessage, openWhatsApp } from "@/lib/utils";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useSocialMedia } from "@/context/SocialMediaContext";

type Step = "address" | "summary" | "whatsapp" | "confirmation";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { social } = useSocialMedia();
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [orderId, setOrderId] = useState("");
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (step === "confirmation" && !orderId) {
      setOrderId(Date.now().toString().slice(-8));
    }
  }, [step, orderId]);

  if (!isAuthenticated) return null;

  const shipping = totalPrice >= 5000 ? 0 : 199;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + tax + shipping;

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "summary", label: "Summary", icon: Truck },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { key: "confirmation", label: "Done", icon: Check },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  const handleWhatsAppOrder = () => {
    const orderItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
    }));

    const message = generateWhatsAppOrderMessage(
      orderItems,
      address,
      totalPrice,
      shipping,
      tax,
      grandTotal
    );

    openWhatsApp(message, social.whatsappNumber);
    clearCart();
    setStep("confirmation");
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-maroon-800 mb-4">Cart is Empty</h1>
          <Link href="/sarees" className="btn-primary">Shop Sarees</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="bg-gradient-to-b from-maroon-800 to-maroon-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Secure</p>
          <h1 className="font-heading text-4xl text-white">Checkout</h1>
        </div>
      </section>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentIdx ? "text-maroon-700" : "text-gray-300"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  i < currentIdx ? "bg-maroon-700 border-maroon-700 text-white" :
                  i === currentIdx ? "border-maroon-700 text-maroon-700" :
                  "border-gray-300"
                }`}>
                  {i < currentIdx ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span className="hidden md:block text-sm font-medium">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-0.5 mx-2 ${i < currentIdx ? "bg-maroon-700" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Address */}
        {step === "address" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-vintage p-8">
            <h2 className="font-heading text-2xl text-maroon-800 mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="input-vintage" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="input-vintage" placeholder="+91 98765 43210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="input-vintage" placeholder="House no, street name, locality" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-vintage" placeholder="Chennai" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State</label>
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-vintage" placeholder="Tamil Nadu" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">PIN Code</label>
                <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="input-vintage" placeholder="600001" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setStep("summary")} className="btn-primary flex items-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {step === "summary" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-vintage p-8">
            <h2 className="font-heading text-2xl text-maroon-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 border-b border-gold-100 pb-4">
                    <div className="relative w-16 h-20 rounded-sm overflow-hidden shrink-0">
                      <PlaceholderImage label={item.product.name.slice(0, 15)} variant="saree" />
                    </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-maroon-800 text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-heading text-maroon-800">
                    {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-cream-100 p-4 rounded-sm mb-6">
              <p className="text-sm font-medium text-maroon-800 mb-1">Shipping to:</p>
              <p className="text-sm text-gray-600">{address.fullName}, {address.street}, {address.city}, {address.state} - {address.pincode}</p>
            </div>

            <OrnamentDivider className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-sm"><span>Tax (5% GST)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-heading text-lg text-maroon-800 pt-2 border-t border-gold-200">
                <span>Total</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep("address")} className="btn-secondary">Back</button>
              <button onClick={() => setStep("whatsapp")} className="btn-primary flex items-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* WhatsApp Order */}
        {step === "whatsapp" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-vintage p-8">
            <h2 className="font-heading text-2xl text-maroon-800 mb-4">Order via WhatsApp</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your order details will be sent to our WhatsApp. We&apos;ll confirm your order and share payment details instantly!
            </p>

            {/* How it works */}
            <div className="bg-cream-100 rounded-sm p-6 mb-6">
              <h3 className="font-heading text-lg text-maroon-800 mb-4">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Send Order", desc: "Click the button below to send your order details via WhatsApp" },
                  { step: "2", title: "Get Payment Link", desc: "We'll reply with UPI/bank details for easy payment" },
                  { step: "3", title: "Confirmation", desc: "Once payment is received, we'll confirm and ship your order" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-maroon-800 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order preview */}
            <div className="bg-cream-100 p-4 rounded-sm mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                <span className="font-heading text-maroon-800">{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-xs text-gray-400">📍 {address.fullName}, {address.city}, {address.state}</p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("summary")} className="btn-secondary">Back</button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-3 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <MessageCircle size={20} />
                Send Order on WhatsApp
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirmation */}
        {step === "confirmation" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-vintage p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check size={40} className="text-green-600" />
            </motion.div>
            <h2 className="font-heading text-3xl text-maroon-800 mb-4">Order Sent Successfully!</h2>
            <p className="text-gray-600 mb-2">Your order has been sent via WhatsApp.</p>
            <p className="text-sm text-gray-400 mb-4">Order #ORD-{orderId}</p>
            <div className="bg-green-50 border border-green-200 rounded-sm p-4 max-w-md mx-auto mb-8">
              <p className="text-sm text-green-700">
                💬 Check your WhatsApp! Our team will reply shortly with payment details and order confirmation.
              </p>
            </div>
            <OrnamentDivider className="my-6" />
            <div className="flex gap-4 justify-center">
              <Link href="/orders" className="btn-secondary">Track Order</Link>
              <Link href="/sarees" className="btn-primary">Continue Shopping</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
