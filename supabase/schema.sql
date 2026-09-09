-- ==============================================================================
-- ARTIST LUXURY GALLERY & STORE - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Create custom status types
CREATE TYPE artwork_status AS ENUM ('available', 'reserved', 'sold');
CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'sold', 'expired', 'cancelled');

-- 2. Artworks Table
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    medium TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    width_cm INTEGER NOT NULL DEFAULT 100,
    height_cm INTEGER NOT NULL DEFAULT 100,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status artwork_status NOT NULL DEFAULT 'available',
    reserved_at TIMESTAMPTZ,
    reserved_by_name TEXT,
    reserved_by_email TEXT,
    reserved_by_phone TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    story TEXT NOT NULL,
    inspiration TEXT,
    palette TEXT[] DEFAULT '{}',
    pigments TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Inquiries & Reservations Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
    artwork_title TEXT NOT NULL,
    artwork_code TEXT NOT NULL,
    artwork_price NUMERIC(10, 2) NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_location TEXT NOT NULL,
    message TEXT,
    status inquiry_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour')
);

-- 4. Artist Profile Table
CREATE TABLE IF NOT EXISTS artist_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tagline TEXT,
    bio TEXT NOT NULL,
    dreams TEXT,
    statement TEXT,
    portrait_url TEXT,
    studio_image_url TEXT,
    whatsapp_number TEXT NOT NULL,
    instagram_url TEXT,
    email TEXT,
    location TEXT,
    exhibitions JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profile ENABLE ROW LEVEL SECURITY;

-- Public can read all artworks and artist profile
CREATE POLICY "Public read artworks" ON artworks FOR SELECT USING (true);
CREATE POLICY "Public read profile" ON artist_profile FOR SELECT USING (true);

-- Public can insert inquiries / reservations
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated artist admin has full access
CREATE POLICY "Admin full access artworks" ON artworks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access inquiries" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access profile" ON artist_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Function to automatically release expired 1-hour reservations
CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS void AS $$
BEGIN
    UPDATE artworks
    SET status = 'available',
        reserved_at = NULL,
        reserved_by_name = NULL,
        reserved_by_email = NULL,
        reserved_by_phone = NULL
    WHERE status = 'reserved'
      AND reserved_at < (NOW() - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
