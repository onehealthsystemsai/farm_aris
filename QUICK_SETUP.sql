-- =====================================================
-- QUICK RSVP SETUP for Farm Aris
-- =====================================================
-- Run this in Supabase SQL Editor FIRST

-- 1. Create RSVP table if it doesn't exist
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Event Details
  attendees INTEGER DEFAULT 1,
  additional_attendees JSONB DEFAULT '[]'::jsonb,
  days TEXT[] DEFAULT '{}',
  
  -- Drink Preferences
  drinks TEXT[] DEFAULT '{}',
  
  -- Food Preferences
  meal_preference TEXT,
  special_requirements TEXT,
  
  -- Confirmation
  confirmation_accepted BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  -- Admin fields
  qr_code TEXT UNIQUE,
  ticket_id TEXT UNIQUE,
  notes TEXT,
  is_vip BOOLEAN DEFAULT FALSE
);

-- 2. Enable RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous RSVP insertions" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated RSVP insertions" ON rsvps;
DROP POLICY IF EXISTS "RSVPs viewable by authenticated users" ON rsvps;
DROP POLICY IF EXISTS "RSVPs updatable by authenticated users" ON rsvps;

-- 4. Create new policies
CREATE POLICY "Allow anonymous insertions" ON rsvps
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insertions" ON rsvps
FOR INSERT TO authenticated  
WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON rsvps
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow authenticated updates" ON rsvps
FOR UPDATE TO authenticated
USING (true);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RSVP table created successfully!';
  RAISE NOTICE '✅ RLS policies set up for anonymous form submissions!';
  RAISE NOTICE '🎉 Ready to accept RSVP submissions!';
END $$;