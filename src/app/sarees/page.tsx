"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, X, Star, ShoppingCart, Search } from "lucide-react";
import { products as allProducts, SILK_TYPES, COLORS, CATEGORIES, Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { Dropdown } from "@/components/ui/Dropdown";

const PRICE_RANGES = [
  { label: "Under ₹7,000", min: 0, max: 7000 },
  { label: "₹7,000 - ₹10,000", min: 7000, max: 10000 },
  { label: "₹10,000 - ₹15,000", min: 10000, max: 15000 },
  { label: "Above ₹15,000", min: 15000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Best Sellers", value: "bestseller" },
];

export default function SareesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-maroon-600">Loading...</div></div>}>
      <SareesContent />
    </Suspense>
  );
}

function SareesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const { products } = useAdmin();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= range.min && price < range.max;
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "bestseller":
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [search, selectedCategories, selectedColors, selectedPriceRange, sortBy, products]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedPriceRange(null);
    setSortBy("newest");
  };

  const activeFilterCount =
    selectedCategories.length + selectedColors.length + (selectedPriceRange !== null ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-maroon-800 to-maroon-900 py-2 px-4 vintage-pattern-bg relative">
        <div className="absolute inset-0 bg-maroon-800/80" />
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Our Collection</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Soft Silk Sarees</h1>
          <p className="text-cream-200 max-w-xl mx-auto">
            Explore our exquisite range of premium soft silk sarees for every occasion
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sarees by name or description..."
              className="input-vintage pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2 relative"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <Dropdown
              options={SORT_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value }))}
              value={sortBy}
              onChange={setSortBy}
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border border-gold-200 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg text-maroon-800">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-maroon-600 hover:text-maroon-800 flex items-center gap-1">
                      <X size={14} /> Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Collection */}
                  <div>
                    <h4 className="text-sm font-medium text-maroon-800 mb-3">Collection</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.slug)}
                            onChange={() => toggleCategory(cat.slug)}
                            className="accent-maroon-700"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-maroon-700">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-medium text-maroon-800 mb-3">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${selectedColors.includes(color)
                            ? "bg-maroon-700 text-white border-maroon-700"
                            : "border-gold-200 text-gray-600 hover:border-maroon-400"
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="text-sm font-medium text-maroon-800 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range, i) => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="price"
                            checked={selectedPriceRange === i}
                            onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                            className="accent-maroon-700"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-maroon-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing {filteredProducts.length} of {products.length} sarees
        </p>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-heading text-2xl text-maroon-800 mb-2">No sarees found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
