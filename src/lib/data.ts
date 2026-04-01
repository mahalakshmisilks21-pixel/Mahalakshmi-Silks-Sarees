export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  silkType: string;
  price: number;
  discountPrice?: number;
  stock: number;
  colors: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  adminReply?: {
    message: string;
    date: string;
  };
}

export const SILK_TYPES = [
  "Soft Silk",
] as const;

export const COLORS = [
  "Red", "Maroon", "Gold", "Green", "Blue", "Pink",
  "Purple", "Orange", "Black", "White", "Cream", "Magenta",
] as const;

export const CATEGORIES = [
  { name: "Wedding Collection", slug: "wedding", image: "/images/collections/wedding.png", description: "Elegant soft silk sarees for your special day" },
  { name: "Festive Collection", slug: "festive", image: "/images/collections/festive.png", description: "Vibrant soft silks for celebrations and festivals" },
  { name: "Casual Elegance", slug: "casual", image: "/images/collections/casual.png", description: "Lightweight soft silk sarees for everyday grace" },
  { name: "Designer Collection", slug: "designer", image: "/images/collections/designer.png", description: "Exclusive designer soft silk sarees" },
  { name: "Traditional Wear", slug: "traditional", image: "/images/collections/traditional.png", description: "Classic soft silk sarees with traditional motifs" },
  { name: "Party Wear", slug: "party", image: "/images/collections/party.png", description: "Glamorous soft silk sarees for parties and events" },
];

/* All product & review data comes from Supabase — no mock data */
export const products: Product[] = [];
export const reviews: Review[] = [];
export const offers: { id: string; title: string; description: string; code: string; discount: number }[] = [];
