"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Users, Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useSiteContent } from "@/context/SiteContentContext";

const VALUE_ICONS = [Award, Users, Heart, MapPin];
const VALUE_COLORS = [
  "from-amber-500 to-yellow-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
];

const MILESTONE_COLORS = [
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-gold-500",
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  const { siteContent } = useSiteContent();

  const heroLines = siteContent.aboutHeroTitle.split("\n");
  const missionParagraphs = siteContent.aboutMissionDescription.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .float-slow { animation: float-slow 6s ease-in-out infinite; }
        @keyframes shine-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .collage-img {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .collage-img:hover {
          transform: scale(1.05) translateY(-8px);
          box-shadow: 0 25px 60px rgba(45,27,78,0.35);
          z-index: 50 !important;
        }
        .collage-img:hover .shine-overlay {
          animation: shine-sweep 0.8s ease-in-out;
        }
        .collage-img:hover .img-inner {
          transform: scale(1.08);
        }
        .collage-wrapper:hover .collage-img:not(:hover) {
          filter: grayscale(40%) brightness(0.85);
          transform: scale(0.97);
        }
        .collage-img .img-inner {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Hero - Deep jewel tone gradient */}
      <section className="relative py-12 px-4 overflow-hidden">
        {siteContent.aboutHeroBannerImage ? (
          <>
            <img src={siteContent.aboutHeroBannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-maroon-900/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900" />
        )}
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl float-slow" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl float-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-rose-500/10 blur-2xl float-slow" style={{ animationDelay: "4s" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-300 tracking-[0.3em] uppercase text-xs">Our Story</span>
            <Sparkles size={14} className="text-amber-400" />
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="font-heading text-5xl md:text-6xl text-white mb-6">
            {heroLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-purple-200/80 max-w-2xl mx-auto text-lg leading-relaxed">
            {siteContent.aboutHeroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Mission - Warm earthy tones */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#faf5ee] to-[#f0e6d3]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-700 tracking-[0.3em] uppercase text-xs">Our Mission</span>
              </div>
              <h2 className="font-heading text-4xl text-[#2d1b4e] mb-6">{siteContent.aboutMissionTitle}</h2>
              <OrnamentDivider className="justify-start my-6" />
              {missionParagraphs.map((p, i) => (
                <p key={i} className={`text-gray-600 leading-relaxed ${i < missionParagraphs.length - 1 ? "mb-4" : ""}`}>
                  {p}
                </p>
              ))}
            </motion.div>
            {/* 3-Image Staggered Collage with Hover Effects */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative collage-wrapper" style={{ minHeight: "520px", perspective: "1000px" }}>
              {/* Image 1 — Large (main) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="collage-img absolute top-0 right-0 w-[75%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 cursor-pointer"
              >
                <div className="img-inner w-full h-full">
                  {siteContent.aboutMissionImages?.[0] ? (
                    <img src={siteContent.aboutMissionImages[0]} alt="Our Heritage" className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage label="Heritage" variant="about" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b4e]/40 to-transparent pointer-events-none" />
                {/* Golden shine sweep overlay */}
                <div className="shine-overlay absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.3), transparent)", transform: "translateX(-100%) skewX(-15deg)" }} />
              </motion.div>

              {/* Image 2 — Medium (bottom-left, rotated) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="collage-img absolute bottom-0 left-0 w-[55%] aspect-[4/5] rounded-xl overflow-hidden shadow-xl z-20 cursor-pointer"
                style={{ border: "3px solid #d4a853", rotate: "-3deg" }}
              >
                <div className="img-inner w-full h-full">
                  {siteContent.aboutMissionImages?.[1] ? (
                    <img src={siteContent.aboutMissionImages[1]} alt="Craftsmanship" className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage label="Artisan" variant="about" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#2d1b4e]/20 pointer-events-none" />
                <div className="shine-overlay absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.3), transparent)", transform: "translateX(-100%) skewX(-15deg)" }} />
              </motion.div>

              {/* Image 3 — Small (top-left floating, ornamental) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="collage-img absolute top-[10%] left-[5%] w-[35%] aspect-square rounded-lg overflow-hidden z-30 cursor-pointer"
                style={{ border: "4px solid white", boxShadow: "0 10px 40px rgba(45,27,78,0.25)" }}
              >
                <div className="img-inner w-full h-full">
                  {siteContent.aboutMissionImages?.[2] ? (
                    <img src={siteContent.aboutMissionImages[2]} alt="Detail" className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage label="Detail" variant="about" />
                  )}
                </div>
                <div className="shine-overlay absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", transform: "translateX(-100%) skewX(-15deg)" }} />
              </motion.div>

              {/* Decorative floating seal badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.6 }}
                className="absolute bottom-[15%] right-[5%] w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center z-40 shadow-xl"
                style={{ border: "3px solid white" }}
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <div className="text-center">
                  <p className="text-white text-[9px] font-bold tracking-wider uppercase leading-tight">Hand</p>
                  <p className="text-white text-[9px] font-bold tracking-wider uppercase leading-tight">Crafted</p>
                  <p className="text-amber-100 text-[7px] mt-0.5">✦ ERODE ✦</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - Colorful gradient cards */}
      <section className="py-12 px-4 bg-gradient-to-b from-maroon-800 to-maroon-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-400 tracking-[0.3em] uppercase text-sm mb-3">What We Stand For</p>
            <h2 className="font-heading text-4xl text-white mb-4">Our Values</h2>
            <p className="text-cream-200/70 max-w-lg mx-auto">The principles that guide every thread of our business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.aboutValues.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              const color = VALUE_COLORS[i % VALUE_COLORS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className="font-heading text-lg text-white mb-3">{v.title}</h3>
                    <p className="text-cream-200/60 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - Rich warm background */}
      <section className="py-12 px-4 bg-gradient-to-br from-[#faf5ee] to-[#f5ebe0]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#2d1b4e] tracking-[0.3em] uppercase text-sm mb-3 opacity-60">Our Journey</p>
            <h2 className="font-heading text-4xl text-[#2d1b4e] mb-4">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400 via-rose-400 to-violet-400" />
            {siteContent.aboutMilestones.map((m, i) => {
              const color = MILESTONE_COLORS[i % MILESTONE_COLORS.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-16 pb-10 last:pb-0"
                >
                  <div className={`absolute left-3.5 top-1 w-5 h-5 rounded-full ${color} border-4 border-[#faf5ee] shadow-lg`} />
                  <p className="text-[#2d1b4e] text-sm font-medium tracking-wider opacity-70">{m.year}</p>
                  <p className="text-[#2d1b4e] mt-1 font-medium">{m.event}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Jewel gradient */}
      <section className="py-12 px-4 bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber-400 tracking-[0.4em] uppercase text-sm mb-4">Start Your Journey</p>
          <h2 className="font-heading text-4xl text-white mb-6">Discover Your Perfect Saree</h2>
          <Link href="/sarees" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium text-lg px-10 py-4 rounded-full hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-xl hover:shadow-amber-500/30 hover:shadow-2xl hover:scale-105">
            Explore Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
