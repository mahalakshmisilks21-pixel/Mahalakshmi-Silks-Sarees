"use client";

import { useRef, useEffect, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader, OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage, PlaceholderBanner } from "@/components/ui/PlaceholderImage";
import { useAdmin } from "@/context/AdminContext";
import { usePromotions } from "@/context/PromotionContext";
import { openWhatsApp, getWhatsAppSubscriptionMessage } from "@/lib/utils";
import { useSocialMedia } from "@/context/SocialMediaContext";

/* ─── Hero ─── */
function HeroSection() {
  const titleLetters = "Mahalakshmi".split("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const safePlay = () => {
      video.play().catch(() => {
        // Browser paused video to save power — ignore silently
      });
    };

    const handleEnded = () => {
      setTimeout(() => {
        video.currentTime = 0;
        safePlay();
      }, 15000);
    };

    // Play when visible via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) safePlay(); },
      { threshold: 0.3 }
    );
    observer.observe(video);

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      observer.disconnect();
    };
  }, []);
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden bg-black">
      {/* Shimmer keyframes injected via style tag */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(230,174,27,0.3), 0 0 20px rgba(230,174,27,0.1); }
          50% { text-shadow: 0 0 20px rgba(230,174,27,0.6), 0 0 40px rgba(230,174,27,0.3), 0 0 60px rgba(230,174,27,0.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #e6ae1b 0%, #fff8dc 25%, #e6ae1b 50%, #fff8dc 75%, #e6ae1b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .text-glow { animation: glow 2s ease-in-out infinite; }
        .float-effect { animation: float 3s ease-in-out infinite; }
        .corner-pulse { animation: pulse-border 2s ease-in-out infinite; }
      `}</style>

      <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/soft-silk-saree.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />

      {/* ── Decorative corner ornaments with pulse ── */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-l-2 border-gold-400 corner-pulse" />
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-r-2 border-gold-400 corner-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-l-2 border-gold-400 corner-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-r-2 border-gold-400 corner-pulse" style={{ animationDelay: "1.5s" }} />

      {/* ── Top decorative line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <div className="w-20 h-px bg-gold-400/50" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-gold-400 text-lg inline-block"
        >✦</motion.span>
        <div className="w-20 h-px bg-gold-400/50" />
      </motion.div>

      {/* ── Main content ── */}
      <div className="relative h-full flex flex-col justify-between p-4 sm:p-8 md:p-14">
        {/* Top section */}
        <div className="flex items-start justify-between mt-8">
          {/* Mahalakshmi Silks - letter by letter */}
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                  className="inline-block drop-shadow-2xl"
                  style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
                >
                  {letter}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-shimmer ml-2 sm:ml-4 md:ml-8 text-glow"
              >
                Silks
              </motion.span>
            </h1>
          </div>

          {/* Special Offer - floating effect */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-right hidden md:block float-effect"
          >
            <p style={{ fontFamily: "var(--font-script)" }} className="text-3xl lg:text-4xl text-gold-300 text-glow">
              Special Offer
            </p>
          </motion.div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          {/* Description + Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-sm sm:max-w-md"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.4 }}
              className="text-cream-200/90 text-sm md:text-base leading-relaxed mb-6"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              Discover our collection of India&apos;s finest silk sarees. Each piece is a
              masterwork of tradition, woven with love by artisan families who have
              perfected their craft over generations.
            </motion.p>
            {/* Decorative line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="flex items-center gap-3 mb-6 origin-left"
            >
              <div className="w-12 h-px bg-gold-400/50" />
              <span className="text-gold-400 text-xs">✦</span>
              <div className="w-12 h-px bg-gold-400/50" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <Link href="/sarees" className="inline-flex items-center gap-2 bg-gold-500/90 backdrop-blur-sm text-white font-medium text-xs sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3 rounded-sm hover:bg-gold-500 hover:scale-105 transition-all duration-300 shadow-xl tracking-wider uppercase hover:shadow-gold-500/30 hover:shadow-2xl">
                Explore Collection <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Saree SALE - bottom right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 1.5, type: "spring", bounce: 0.4 }}
            className="text-right hidden md:block"
          >
            <p style={{ fontFamily: "var(--font-script)" }} className="text-5xl lg:text-7xl text-white/90 text-glow">
              Saree
            </p>
            <motion.p
              initial={{ letterSpacing: "0em", opacity: 0 }}
              animate={{ letterSpacing: "0.5em", opacity: 1 }}
              transition={{ duration: 1.2, delay: 2 }}
              className="text-gold-400 text-2xl lg:text-3xl font-heading uppercase mt-1 text-shimmer"
            >
              SALE
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom decorative line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <div className="w-20 h-px bg-gold-400/50" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-gold-400 text-lg inline-block"
        >✦</motion.span>
        <div className="w-20 h-px bg-gold-400/50" />
      </motion.div>
    </section>
  );
}

/* ─── Trust Badges ─── */
function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Free Shipping", desc: "Orders above ₹5,000" },
    { icon: Shield, title: "Silk Mark Certified", desc: "100% authentic silk" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
    { icon: Award, title: "Artisan Crafted", desc: "Handwoven with love" },
  ];

  return (
    <section className="bg-maroon-800 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 justify-center text-center md:text-left"
            >
              <badge.icon className="text-gold-400 shrink-0" size={28} />
              <div>
                <p className="text-white font-medium text-sm">{badge.title}</p>
                <p className="text-gold-200 text-xs">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Sarees ─── */
function FeaturedSection() {
  const { products } = useAdmin();
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Curated Selection"
          title="Featured Silk Sarees"
          description="Handpicked masterpieces from our collection, each representing the pinnacle of Indian silk weaving artistry."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/sarees" className="btn-secondary inline-flex items-center gap-2">
            View All Sarees <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Categories ─── */
function CategoriesSection() {
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-cream-100 to-cream-50 vintage-pattern-bg">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Explore Our Collections"
          title="Soft Silk Collections"
          description="Discover our curated collections of premium soft silk sarees for every occasion."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/sarees?category=${cat.slug}`}
                className="group block relative aspect-[4/3] overflow-hidden rounded-sm"
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <PlaceholderImage label={cat.name} variant="category" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 via-maroon-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-heading text-xl text-white mb-1">{cat.name}</h3>
                  <p className="text-gold-200 text-xs leading-relaxed">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-gold-400 text-xs mt-2 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Best Sellers ─── */
function BestSellersSection() {
  const { products } = useAdmin();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Customer Favorites"
          title="Best Sellers"
          description="The most loved sarees from our collection, trusted by thousands of happy customers."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Offers Banner ─── */
function OffersSection() {
  const { offers } = usePromotions();
  const activeOffers = offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section className="py-14 px-4 bg-gradient-to-b from-cream-50 to-cream-100">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          subtitle="Special Deals"
          title="Festive Offers"
          description="Exclusive savings on our finest silk collections"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative bg-white border border-gold-200 rounded-sm p-6 hover:shadow-md transition-shadow group overflow-hidden"
            >
              {/* Vintage corner accent */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold-400 rounded-tl-sm" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold-400 rounded-br-sm" />

              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-cream-100 border border-gold-200 flex items-center justify-center shrink-0">
                  <span className="font-heading text-maroon-700 text-lg">{offer.discount}%</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg text-maroon-800 leading-snug">{offer.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex-1 border-t border-dashed border-gold-300" />
                <span className="bg-cream-100 border border-gold-300 text-maroon-700 font-mono text-xs tracking-widest px-4 py-1.5 rounded-sm">
                  {offer.code}
                </span>
                <div className="flex-1 border-t border-dashed border-gold-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── CTA Banner ─── */
function CTASection() {
  return (
    <section className="relative py-12 px-4 overflow-hidden bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900">
      <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <p className="text-amber-400 tracking-[0.4em] uppercase text-xs mb-3">
          Begin Your Journey
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 leading-tight">
          Drape Yourself in<br />Heritage & Grace
        </h2>
        <p className="text-purple-200/70 mb-6 max-w-xl mx-auto text-sm">
          Every silk saree from Mahalakshmi is a celebration of Indian craftsmanship.
          Find your perfect drape today.
        </p>
        <Link href="/sarees" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium px-8 py-3 rounded-full hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:scale-105">
          Shop Now <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}


/* ─── WhatsApp CTA ─── */
function WhatsAppCTASection() {
  const [phone, setPhone] = useState("");
  const { social } = useSocialMedia();

  const handleSubscribe = () => {
    const msg = getWhatsAppSubscriptionMessage(phone || "a customer");
    openWhatsApp(msg, social.whatsappNumber);
  };

  return (
    <section className="py-14 px-4 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <MessageCircle size={32} className="text-white" />
        </div>

        <h2 className="font-heading text-3xl md:text-4xl text-white mb-3">
          Get Exclusive Offers on WhatsApp! 📲
        </h2>
        <p className="text-green-100 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Join our WhatsApp community for early access to new collections, festival offers, and exclusive discounts. Be the first to know!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
          <input
            type="tel"
            placeholder="Your WhatsApp number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 w-full sm:w-auto bg-white/15 backdrop-blur-sm border border-white/30 px-5 py-3 rounded-full text-sm text-white placeholder:text-green-200 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
          />
          <button
            onClick={handleSubscribe}
            className="flex items-center gap-2 bg-white text-green-600 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm whitespace-nowrap"
          >
            <MessageCircle size={18} />
            Join on WhatsApp
          </button>
        </div>

        <p className="text-green-200/70 text-xs mt-4">
          💬 We respect your privacy. No spam, only the best deals!
        </p>
      </motion.div>
    </section>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <FeaturedSection />
      <CategoriesSection />
      <BestSellersSection />
      <OffersSection />

      <CTASection />
      <WhatsAppCTASection />
    </>
  );
}
