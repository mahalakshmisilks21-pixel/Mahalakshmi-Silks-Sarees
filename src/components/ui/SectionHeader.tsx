"use client";

import { motion } from "framer-motion";

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-400" />
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-gold-500">
        <path
          d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5L10 0Z"
          fill="currentColor"
        />
      </svg>
      <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-400" />
    </motion.div>
  );
}

export function SectionHeader({
  subtitle,
  title,
  description,
}: {
  subtitle: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-12">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-subheading"
      >
        {subtitle}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="section-heading"
      >
        {title}
      </motion.h2>
      <OrnamentDivider className="my-4" />
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-600 max-w-2xl mx-auto mt-4"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
