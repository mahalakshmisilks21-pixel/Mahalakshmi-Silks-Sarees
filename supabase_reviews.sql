-- =============================================
-- Reviews table for Mahalakshmi Silks
-- Run this in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 0,
  comment TEXT DEFAULT '',
  date TEXT DEFAULT '',
  "adminReply" JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and allow all access
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
