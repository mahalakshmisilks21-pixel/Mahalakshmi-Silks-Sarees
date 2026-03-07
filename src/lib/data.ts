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

const SAREE_IMAGES: string[] = [];

export const products: Product[] = [
  {
    id: "1", name: "Soft Silk Bridal Elegance", slug: "soft-silk-bridal-elegance",
    description: "A stunning soft silk saree with rich zari border, perfect for weddings and grand celebrations. Lightweight yet luxurious with a beautiful drape.",
    silkType: "Soft Silk", price: 12500, discountPrice: 10500, stock: 15,
    colors: ["Red", "Gold"], images: [],
    rating: 4.8, reviewCount: 124, isFeatured: true, isBestSeller: true, category: "wedding",
  },
  {
    id: "2", name: "Soft Silk Royal Heritage", slug: "soft-silk-royal-heritage",
    description: "An exquisite soft silk saree featuring traditional motifs with silver zari work. Comfortable to wear all day with a premium finish.",
    silkType: "Soft Silk", price: 9800, discountPrice: 8200, stock: 20,
    colors: ["Maroon", "Gold"], images: [],
    rating: 4.7, reviewCount: 89, isFeatured: true, isBestSeller: true, category: "traditional",
  },
  {
    id: "3", name: "Soft Silk Floral Dreams", slug: "soft-silk-floral-dreams",
    description: "A lightweight soft silk saree with delicate floral patterns, perfect for office wear and casual celebrations. Comfortable draping with elegant temple border.",
    silkType: "Soft Silk", price: 8500, discountPrice: 7200, stock: 35,
    colors: ["Pink", "Green"], images: [],
    rating: 4.5, reviewCount: 201, isFeatured: true, isBestSeller: true, category: "casual",
  },
  {
    id: "4", name: "Soft Silk Golden Weave", slug: "soft-silk-golden-weave",
    description: "A beautiful soft silk saree with natural golden sheen and intricate weaving patterns. Perfect for festive occasions and celebrations.",
    silkType: "Soft Silk", price: 7800, stock: 25,
    colors: ["Gold", "Cream"], images: [],
    rating: 4.3, reviewCount: 56, isFeatured: false, isBestSeller: false, category: "festive",
  },
  {
    id: "5", name: "Soft Silk Peacock Collection", slug: "soft-silk-peacock-collection",
    description: "A stunning soft silk saree with elaborate peacock motifs in rich jewel tones. The perfect blend of traditional artistry and contemporary style.",
    silkType: "Soft Silk", price: 11000, discountPrice: 9500, stock: 22,
    colors: ["Green", "Blue"], images: [],
    rating: 4.6, reviewCount: 178, isFeatured: true, isBestSeller: true, category: "designer",
  },
  {
    id: "6", name: "Soft Silk Temple Border Classic", slug: "soft-silk-temple-border-classic",
    description: "A classic soft silk saree with traditional temple border and contrast pallu. Comfortable lightweight drape with authentic zari work.",
    silkType: "Soft Silk", price: 8800, discountPrice: 7500, stock: 18,
    colors: ["Blue", "Gold"], images: [],
    rating: 4.4, reviewCount: 95, isFeatured: false, isBestSeller: true, category: "traditional",
  },
  {
    id: "7", name: "Soft Silk Party Shimmer", slug: "soft-silk-party-shimmer",
    description: "A contemporary soft silk saree blending tradition with modern aesthetics. Lightweight yet luxurious, adorned with shimmer work and cutwork border.",
    silkType: "Soft Silk", price: 9200, stock: 28,
    colors: ["Magenta", "Gold"], images: [],
    rating: 4.2, reviewCount: 143, isFeatured: false, isBestSeller: false, category: "party",
  },
  {
    id: "8", name: "Soft Silk Festive Charm", slug: "soft-silk-festive-charm",
    description: "A vibrant soft silk saree with rich color combinations and festive patterns. Perfect for Diwali, Pongal, and other celebrations.",
    silkType: "Soft Silk", price: 7500, discountPrice: 6200, stock: 30,
    colors: ["Orange", "Maroon"], images: [],
    rating: 4.1, reviewCount: 42, isFeatured: false, isBestSeller: false, category: "festive",
  },
  {
    id: "9", name: "Soft Silk Pastel Grace", slug: "soft-silk-pastel-grace",
    description: "An elegant soft silk saree in soothing pastel tones. Perfect for office wear, small gatherings, and daytime events.",
    silkType: "Soft Silk", price: 6800, stock: 40,
    colors: ["Pink", "Cream"], images: [],
    rating: 4.5, reviewCount: 67, isFeatured: true, isBestSeller: false, category: "casual",
  },
  {
    id: "10", name: "Soft Silk Designer Exclusive", slug: "soft-silk-designer-exclusive",
    description: "A premium designer soft silk saree with exclusive prints and modern motifs. Crafted for the fashion-forward woman who loves tradition.",
    silkType: "Soft Silk", price: 14500, discountPrice: 12000, stock: 8,
    colors: ["Purple", "Gold"], images: [],
    rating: 4.9, reviewCount: 34, isFeatured: true, isBestSeller: false, category: "designer",
  },
  {
    id: "11", name: "Soft Silk Wedding Special", slug: "soft-silk-wedding-special",
    description: "A premium soft silk saree crafted for weddings. Rich embroidery with traditional motifs on a lustrous soft silk base.",
    silkType: "Soft Silk", price: 15000, discountPrice: 12800, stock: 10,
    colors: ["Red", "Maroon"], images: [],
    rating: 4.7, reviewCount: 51, isFeatured: false, isBestSeller: true, category: "wedding",
  },
  {
    id: "12", name: "Soft Silk Heirloom Collection", slug: "soft-silk-heirloom-collection",
    description: "A collector's soft silk saree with intricate handwoven patterns. This heirloom piece is a treasure to be passed down through generations.",
    silkType: "Soft Silk", price: 18500, stock: 5,
    colors: ["Maroon", "White"], images: [],
    rating: 5.0, reviewCount: 18, isFeatured: true, isBestSeller: false, category: "designer",
  },
];

export const reviews: Review[] = [
  { id: "1", productId: "1", userName: "Priya Sharma", rating: 5, comment: "Absolutely stunning saree! The zari work is impeccable and the silk quality is premium. Wore it to my sister's wedding and received so many compliments.", date: "2025-12-15" },
  { id: "2", productId: "1", userName: "Lakshmi Devi", rating: 5, comment: "Worth every penny. The color is vibrant and the weave is flawless. This is truly a bridal masterpiece.", date: "2025-11-20" },
  { id: "3", productId: "2", userName: "Anita Gupta", rating: 4, comment: "Beautiful saree with rich zari work. The soft silk drapes so well and is very comfortable for all-day wear.", date: "2025-10-08" },
  { id: "4", productId: "5", userName: "Meera Patel", rating: 5, comment: "The peacock motifs are gorgeous! Soft silk drapes beautifully and the colors are exactly as shown in the pictures.", date: "2025-09-25" },
  { id: "5", productId: "3", userName: "Kavitha Nair", rating: 4, comment: "Perfect for daily office wear. Light, comfortable, and elegant. The floral pattern is subtle yet beautiful.", date: "2025-08-12" },
  { id: "6", productId: "9", userName: "Deepa Krishnan", rating: 5, comment: "Love the pastel tones! So elegant and comfortable. Got compliments from everyone at the event.", date: "2025-07-30" },
];

export const offers = [
  { id: "1", title: "Wedding Season Sale", description: "Up to 30% off on Wedding Collection", code: "WEDDING30", discount: 30 },
  { id: "2", title: "First Purchase", description: "Get 15% off on your first order", code: "FIRST15", discount: 15 },
  { id: "3", title: "Festive Special", description: "Buy 2, Get 10% off on both", code: "FESTIVE10", discount: 10 },
];
