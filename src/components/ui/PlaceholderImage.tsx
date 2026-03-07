"use client";

interface PlaceholderImageProps {
  label?: string;
  className?: string;
  variant?: "saree" | "category" | "hero" | "about";
}

const COLORS: Record<string, { bg: string; accent: string; pattern: string }> = {
  saree: { bg: "#FDF6E3", accent: "#8B1A1A", pattern: "#C8A96E" },
  category: { bg: "#F5ECD7", accent: "#6B0F0F", pattern: "#D4A853" },
  hero: { bg: "#FFF8E7", accent: "#7A1616", pattern: "#B8942D" },
  about: { bg: "#F9F1E0", accent: "#5C0D0D", pattern: "#C9A54A" },
};

export function PlaceholderImage({ label = "Silk Saree", className = "", variant = "saree" }: PlaceholderImageProps) {
  const c = COLORS[variant];

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`} style={{ backgroundColor: c.bg }}>
      <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`weave-${variant}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={c.bg} />
            <path d="M0 20h40M20 0v40" stroke={c.pattern} strokeWidth="0.5" opacity="0.3" />
            <circle cx="20" cy="20" r="2" fill={c.pattern} opacity="0.2" />
          </pattern>
          <pattern id={`border-${variant}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" />
            <path d="M0 10L10 0L20 10L10 20Z" fill={c.accent} opacity="0.15" />
          </pattern>
          <linearGradient id={`shimmer-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.pattern} stopOpacity="0.1" />
            <stop offset="50%" stopColor={c.pattern} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c.pattern} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Background weave pattern */}
        <rect width="400" height="500" fill={`url(#weave-${variant})`} />

        {/* Decorative border */}
        <rect x="15" y="15" width="370" height="470" rx="2" fill="none" stroke={c.pattern} strokeWidth="1.5" opacity="0.4" />
        <rect x="25" y="25" width="350" height="450" rx="2" fill="none" stroke={c.accent} strokeWidth="0.5" opacity="0.2" />

        {/* Temple border pattern at top */}
        <rect x="25" y="25" width="350" height="50" fill={`url(#border-${variant})`} />

        {/* Paisley / Mango motif (simplified) */}
        <g transform="translate(200,220)" opacity="0.15">
          <path d="M0-60C30-60 50-30 50 10C50 50 25 80 0 90C-25 80-50 50-50 10C-50-30-30-60 0-60Z" fill={c.accent} />
          <path d="M0-40C18-40 30-18 30 6C30 30 15 48 0 54C-15 48-30 30-30 6C-30-18-18-40 0-40Z" fill={c.bg} />
          <circle cx="0" cy="5" r="8" fill={c.accent} opacity="0.3" />
        </g>

        {/* Shimmer overlay */}
        <rect width="400" height="500" fill={`url(#shimmer-${variant})`} />

        {/* Saree fold lines */}
        <line x1="60" y1="150" x2="340" y2="150" stroke={c.pattern} strokeWidth="0.5" opacity="0.25" />
        <line x1="60" y1="300" x2="340" y2="300" stroke={c.pattern} strokeWidth="0.5" opacity="0.25" />
        <line x1="60" y1="380" x2="340" y2="380" stroke={c.pattern} strokeWidth="0.5" opacity="0.25" />

        {/* Temple border pattern at bottom (pallu) */}
        <rect x="25" y="425" width="350" height="50" fill={`url(#border-${variant})`} />

        {/* Zari corner accents */}
        <path d="M25 25L75 25L25 75Z" fill={c.pattern} opacity="0.15" />
        <path d="M375 25L325 25L375 75Z" fill={c.pattern} opacity="0.15" />
        <path d="M25 475L75 475L25 425Z" fill={c.pattern} opacity="0.15" />
        <path d="M375 475L325 475L375 425Z" fill={c.pattern} opacity="0.15" />

        {/* Label */}
        <text x="200" y="260" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fill={c.accent} opacity="0.5">{label}</text>
        <text x="200" y="285" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill={c.pattern} opacity="0.4">Mahalakshmi Silk Sarees</text>
      </svg>
    </div>
  );
}

export function PlaceholderBanner({ label = "Silk Heritage", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`} style={{ backgroundColor: "#FDF6E3" }}>
      <svg width="100%" height="100%" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="banner-weave" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#FDF6E3" />
            <path d="M0 30h60M30 0v60" stroke="#C8A96E" strokeWidth="0.3" opacity="0.3" />
            <circle cx="30" cy="30" r="1.5" fill="#C8A96E" opacity="0.2" />
            <circle cx="0" cy="0" r="1.5" fill="#C8A96E" opacity="0.2" />
            <circle cx="60" cy="0" r="1.5" fill="#C8A96E" opacity="0.2" />
            <circle cx="0" cy="60" r="1.5" fill="#C8A96E" opacity="0.2" />
            <circle cx="60" cy="60" r="1.5" fill="#C8A96E" opacity="0.2" />
          </pattern>
          <linearGradient id="banner-grad" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#C8A96E" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="1600" height="600" fill="url(#banner-weave)" />
        <rect width="1600" height="600" fill="url(#banner-grad)" />

        {/* Decorative border */}
        <rect x="30" y="30" width="1540" height="540" rx="2" fill="none" stroke="#C8A96E" strokeWidth="1" opacity="0.3" />

        {/* Repeating temple motifs across top */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
          <path key={i} d={`M${120 * i + 60} 50L${120 * i + 80} 30L${120 * i + 100} 50`} stroke="#8B1A1A" strokeWidth="1" fill="none" opacity="0.15" />
        ))}

        {/* Large paisley motifs */}
        <g transform="translate(300,300)" opacity="0.08">
          <path d="M0-100C50-100 90-50 90 20C90 90 45 140 0 160C-45 140-90 90-90 20C-90-50-50-100 0-100Z" fill="#8B1A1A" />
        </g>
        <g transform="translate(1300,300)" opacity="0.08">
          <path d="M0-100C50-100 90-50 90 20C90 90 45 140 0 160C-45 140-90 90-90 20C-90-50-50-100 0-100Z" fill="#8B1A1A" />
        </g>

        <text x="800" y="290" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fill="#8B1A1A" opacity="0.35">{label}</text>
        <text x="800" y="325" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fill="#C8A96E" opacity="0.4">Mahalakshmi Silk Sarees</text>
      </svg>
    </div>
  );
}
