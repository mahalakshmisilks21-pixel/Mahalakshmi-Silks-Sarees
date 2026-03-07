-- =============================================
-- Mahalakshmi Silks – Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  "silkType" TEXT DEFAULT 'Soft Silk',
  price NUMERIC NOT NULL,
  "discountPrice" NUMERIC,
  stock INTEGER DEFAULT 0,
  colors TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  "reviewCount" INTEGER DEFAULT 0,
  "isFeatured" BOOLEAN DEFAULT false,
  "isBestSeller" BOOLEAN DEFAULT false,
  category TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  "totalAmount" NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'processing',
  "paymentMethod" TEXT DEFAULT '',
  "paymentStatus" TEXT DEFAULT 'pending',
  "shippingAddress" TEXT DEFAULT '',
  date TEXT DEFAULT '',
  "trackingId" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  orders INTEGER DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  "joinDate" TEXT DEFAULT '',
  address TEXT DEFAULT '',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL,
  "productName" TEXT DEFAULT '',
  type TEXT DEFAULT 'restock',
  quantity INTEGER DEFAULT 0,
  "previousStock" INTEGER DEFAULT 0,
  "newStock" INTEGER DEFAULT 0,
  note TEXT DEFAULT '',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Row Level Security (allow all for now)
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to inventory_logs" ON inventory_logs FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Seed default products
-- =============================================
INSERT INTO products (id, name, slug, description, "silkType", price, "discountPrice", stock, colors, images, rating, "reviewCount", "isFeatured", "isBestSeller", category) VALUES
('1', 'Soft Silk Bridal Elegance', 'soft-silk-bridal-elegance', 'A stunning soft silk saree with rich zari border, perfect for weddings and grand celebrations. Lightweight yet luxurious with a beautiful drape.', 'Soft Silk', 12500, 10500, 15, ARRAY['Red','Gold'], '{}', 4.8, 124, true, true, 'wedding'),
('2', 'Soft Silk Royal Heritage', 'soft-silk-royal-heritage', 'An exquisite soft silk saree featuring traditional motifs with silver zari work. Comfortable to wear all day with a premium finish.', 'Soft Silk', 9800, 8200, 20, ARRAY['Maroon','Gold'], '{}', 4.7, 89, true, true, 'traditional'),
('3', 'Soft Silk Floral Dreams', 'soft-silk-floral-dreams', 'A lightweight soft silk saree with delicate floral patterns, perfect for office wear and casual celebrations.', 'Soft Silk', 8500, 7200, 35, ARRAY['Pink','Green'], '{}', 4.5, 201, true, true, 'casual'),
('4', 'Soft Silk Golden Weave', 'soft-silk-golden-weave', 'A beautiful soft silk saree with natural golden sheen and intricate weaving patterns.', 'Soft Silk', 7800, NULL, 25, ARRAY['Gold','Cream'], '{}', 4.3, 56, false, false, 'festive'),
('5', 'Soft Silk Peacock Collection', 'soft-silk-peacock-collection', 'A stunning soft silk saree with elaborate peacock motifs in rich jewel tones.', 'Soft Silk', 11000, 9500, 22, ARRAY['Green','Blue'], '{}', 4.6, 178, true, true, 'designer'),
('6', 'Soft Silk Temple Border Classic', 'soft-silk-temple-border-classic', 'A classic soft silk saree with traditional temple border and contrast pallu.', 'Soft Silk', 8800, 7500, 18, ARRAY['Blue','Gold'], '{}', 4.4, 95, false, true, 'traditional'),
('7', 'Soft Silk Party Shimmer', 'soft-silk-party-shimmer', 'A contemporary soft silk saree blending tradition with modern aesthetics.', 'Soft Silk', 9200, NULL, 28, ARRAY['Magenta','Gold'], '{}', 4.2, 143, false, false, 'party'),
('8', 'Soft Silk Festive Charm', 'soft-silk-festive-charm', 'A vibrant soft silk saree with rich color combinations and festive patterns.', 'Soft Silk', 7500, 6200, 30, ARRAY['Orange','Maroon'], '{}', 4.1, 42, false, false, 'festive'),
('9', 'Soft Silk Pastel Grace', 'soft-silk-pastel-grace', 'An elegant soft silk saree in soothing pastel tones.', 'Soft Silk', 6800, NULL, 40, ARRAY['Pink','Cream'], '{}', 4.5, 67, true, false, 'casual'),
('10', 'Soft Silk Designer Exclusive', 'soft-silk-designer-exclusive', 'A premium designer soft silk saree with exclusive prints and modern motifs.', 'Soft Silk', 14500, 12000, 8, ARRAY['Purple','Gold'], '{}', 4.9, 34, true, false, 'designer'),
('11', 'Soft Silk Wedding Special', 'soft-silk-wedding-special', 'A premium soft silk saree crafted for weddings.', 'Soft Silk', 15000, 12800, 10, ARRAY['Red','Maroon'], '{}', 4.7, 51, false, true, 'wedding'),
('12', 'Soft Silk Heirloom Collection', 'soft-silk-heirloom-collection', 'A collector''s soft silk saree with intricate handwoven patterns.', 'Soft Silk', 18500, NULL, 5, ARRAY['Maroon','White'], '{}', 5.0, 18, true, false, 'designer')
ON CONFLICT (id) DO NOTHING;
