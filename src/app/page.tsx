"use client";

import { useRef, useEffect } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Award, Tag } from "lucide-react";
import { CATEGORIES, reviews, offers } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader, OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage, PlaceholderBanner } from "@/components/ui/PlaceholderImage";
import { useAdmin } from "@/context/AdminContext";

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
    <section className="relative w-full h-[80vh] overflow-hidden bg-black">
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
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-400 corner-pulse" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-400 corner-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-400 corner-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-400 corner-pulse" style={{ animationDelay: "1.5s" }} />

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
      <div className="relative h-full flex flex-col justify-between p-8 md:p-14">
        {/* Top section */}
        <div className="flex items-start justify-between mt-8">
          {/* Mahalakshmi Silks - letter by letter */}
          <div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
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
                className="text-shimmer ml-4 md:ml-8 text-glow"
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
        <div className="flex items-end justify-between">
          {/* Description + Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-md"
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
              <Link href="/sarees" className="inline-flex items-center gap-2 bg-gold-500/90 backdrop-blur-sm text-white font-medium text-sm px-8 py-3 rounded-sm hover:bg-gold-500 hover:scale-105 transition-all duration-300 shadow-xl tracking-wider uppercase hover:shadow-gold-500/30 hover:shadow-2xl">
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
  return (
    <section className="py-8 px-4 bg-maroon-800 vintage-pattern-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-maroon-800/90" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Special Deals</p>
          <h2 className="font-heading text-4xl text-white mb-2">Festive Offers</h2>
          <OrnamentDivider className="my-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-maroon-700/50 backdrop-blur-sm border border-gold-500/30 p-8 rounded-sm text-center hover:border-gold-400 transition-all duration-500 group"
            >
              <Tag className="text-gold-400 mx-auto mb-4" size={32} />
              <h3 className="font-heading text-2xl text-white mb-2">{offer.title}</h3>
              <p className="text-gold-200 text-sm mb-4">{offer.description}</p>
              <div className="bg-maroon-900/50 border border-dashed border-gold-500 inline-block px-4 py-2 rounded-sm">
                <span className="text-gold-400 font-mono tracking-wider text-sm">{offer.code}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Customer Reviews ─── */
function ReviewsSection() {
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Testimonials"
          title="What Our Customers Say"
          description="Real stories from women who found their perfect silk saree with us."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white border border-gold-200 p-8 rounded-sm relative"
            >
              <span className="absolute -top-4 left-6 font-heading text-6xl text-gold-300 leading-none">&ldquo;</span>
              <div className="flex items-center gap-1 mb-4 mt-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < review.rating ? "fill-gold-400 text-gold-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center">
                  <span className="font-heading text-maroon-700 text-sm">{review.userName[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-maroon-800 text-sm">{review.userName}</p>
                  <p className="text-gray-400 text-xs">{review.date}</p>
                </div>
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
      <ReviewsSection />
      <CTASection />
    </>
  );
}
