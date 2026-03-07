"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Users, Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeader, OrnamentDivider } from "@/components/ui/SectionHeader";
import { PlaceholderBanner, PlaceholderImage } from "@/components/ui/PlaceholderImage";

const values = [
  { icon: Award, title: "Authentic Craftsmanship", description: "Every saree is handwoven by skilled artisans using traditional techniques passed down through generations.", color: "from-amber-500 to-yellow-600" },
  { icon: Users, title: "Artisan Partnerships", description: "We work directly with weaving communities in and around Erode, ensuring fair wages and preserving their art.", color: "from-rose-500 to-pink-600" },
  { icon: Heart, title: "Quality Promise", description: "Each piece undergoes rigorous quality checks. We sell only genuine handloom silk and silk cotton sarees.", color: "from-emerald-500 to-teal-600" },
  { icon: MapPin, title: "Erode Heritage", description: "Rooted in Erode, the heart of Tamil Nadu's textile tradition, bringing you the finest soft silk sarees.", color: "from-violet-500 to-purple-600" },
];

const milestones = [
  { year: "Founded", event: "Established in Erode with a passion for fancy handloom silk & silk cotton sarees", color: "bg-amber-500" },
  { year: "Growth", event: "Expanded our collection of soft silk and silk cotton sarees for every occasion", color: "bg-rose-500" },
  { year: "Community", event: "Partnered with local artisan families across Erode district", color: "bg-emerald-500" },
  { year: "Online", event: "Launched online store to reach customers across Tamil Nadu and India", color: "bg-violet-500" },
  { year: "Today", event: "Serving thousands of happy customers with premium soft silk sarees", color: "bg-gold-500" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
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
      `}</style>

      {/* Hero - Deep jewel tone gradient */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900" />
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
            Fancy Handloom Silk<br />&amp; Silk Cotton Sarees
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-purple-200/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Mahalakshmi Silks is born from a deep love for India&apos;s textile heritage.
            Based in Erode, Tamil Nadu, we bring you the finest soft silk sarees crafted with generations of expertise.
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
              <h2 className="font-heading text-4xl text-[#2d1b4e] mb-6">Preserving India&apos;s Silk Legacy</h2>
              <OrnamentDivider className="justify-start my-6" />
              <p className="text-gray-600 leading-relaxed mb-4">
                At Mahalakshmi Silks, we believe every silk saree tells a story. A story of the artisan&apos;s
                dedication, the rich cultural heritage of Erode&apos;s textile tradition, and the timeless beauty of
                handcrafted textiles.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our mission is to bring the finest fancy handloom silk and silk cotton sarees to your
                doorstep while ensuring the livelihoods of the weaving communities who create these masterpieces.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each saree in our collection is carefully curated, quality-verified, and sourced
                from skilled artisan families in and around Erode, Tamil Nadu.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <PlaceholderImage label="Artisan Weaving" variant="about" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b4e]/30 to-transparent" />
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
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <v.icon className="text-white" size={28} />
                  </div>
                  <h3 className="font-heading text-lg text-white mb-3">{v.title}</h3>
                  <p className="text-cream-200/60 text-sm leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
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
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16 pb-10 last:pb-0"
              >
                <div className={`absolute left-3.5 top-1 w-5 h-5 rounded-full ${m.color} border-4 border-[#faf5ee] shadow-lg`} />
                <p className="text-[#2d1b4e] text-sm font-medium tracking-wider opacity-70">{m.year}</p>
                <p className="text-[#2d1b4e] mt-1 font-medium">{m.event}</p>
              </motion.div>
            ))}
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
