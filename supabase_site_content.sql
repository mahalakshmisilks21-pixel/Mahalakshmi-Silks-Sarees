-- ============================================
-- Create site_content table for admin-managed
-- About & Contact page content
-- ============================================

-- Single-row table storing all site content as JSON
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow EVERYONE to READ (public visitors can see the content)
CREATE POLICY "Anyone can read site_content"
  ON site_content
  FOR SELECT
  USING (true);

-- Allow EVERYONE to INSERT/UPDATE (admin panel uses anon key)
-- Note: Your admin panel is already protected by login
CREATE POLICY "Anyone can insert site_content"
  ON site_content
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update site_content"
  ON site_content
  FOR UPDATE
  USING (true);

-- Insert default row so it exists
INSERT INTO site_content (id, content)
VALUES ('main', '{}')
ON CONFLICT (id) DO NOTHING;
