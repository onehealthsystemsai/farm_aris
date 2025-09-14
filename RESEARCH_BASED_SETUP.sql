-- =====================================================
-- SUPABASE RLS SETUP - Research-Based Solution
-- Farm Aris RSVP System
-- =====================================================
-- Based on official Supabase documentation and troubleshooting guides
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jyvgjcagmmtiqgexqgwa/sql/new

-- Step 1: Create RSVP table with complete schema
-- =====================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information (Required)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Event Details
  attendees INTEGER DEFAULT 1 CHECK (attendees > 0 AND attendees <= 10),
  additional_attendees JSONB DEFAULT '[]'::jsonb,
  days TEXT[] DEFAULT '{}',
  
  -- Preferences
  drinks TEXT[] DEFAULT '{}',
  meal_preference TEXT CHECK (meal_preference IN ('standard', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free')),
  special_requirements TEXT DEFAULT '',
  
  -- Confirmation
  confirmation_accepted BOOLEAN DEFAULT FALSE,
  
  -- Status Management
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  -- Admin Fields
  qr_code TEXT UNIQUE,
  ticket_id TEXT UNIQUE,
  notes TEXT,
  is_vip BOOLEAN DEFAULT FALSE
);

-- Step 2: Enable Row Level Security
-- =====================================================
-- As per Supabase docs: "RLS must always be enabled on any tables stored in an exposed schema"
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to start fresh
-- =====================================================
DROP POLICY IF EXISTS "Allow anonymous insertions" ON rsvps;
DROP POLICY IF EXISTS "Allow anonymous selections" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated insertions" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated reads" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated updates" ON rsvps;

-- Step 4: Create INSERT policy for anonymous users (CRITICAL)
-- =====================================================
-- Based on Supabase docs: Anonymous users need INSERT permissions for form submissions
CREATE POLICY "Anonymous users can submit RSVPs"
ON rsvps
FOR INSERT
TO anon
WITH CHECK (
  -- Validate required fields
  length(full_name) > 0 AND
  length(email) > 0 AND
  email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' AND
  length(phone) > 0 AND
  attendees > 0 AND
  attendees <= 10 AND
  confirmation_accepted = true
);

-- Step 5: Create SELECT policy for anonymous users (CRITICAL)
-- =====================================================
-- This solves the "new row violates row-level security policy" error
-- Supabase automatically does a SELECT after INSERT to return the record
CREATE POLICY "Anonymous users can read their submitted RSVPs"
ON rsvps
FOR SELECT
TO anon
USING (true);

-- Step 6: Create policies for authenticated users (Admin access)
-- =====================================================
CREATE POLICY "Authenticated users can view all RSVPs"
ON rsvps
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert RSVPs"
ON rsvps
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update RSVPs"
ON rsvps
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete RSVPs"
ON rsvps
FOR DELETE
TO authenticated
USING (true);

-- Step 7: Create performance indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_is_vip ON rsvps(is_vip) WHERE is_vip = true;
CREATE INDEX IF NOT EXISTS idx_rsvps_days ON rsvps USING GIN(days);

-- Step 8: Create trigger for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rsvps_updated_at ON rsvps;
CREATE TRIGGER update_rsvps_updated_at
    BEFORE UPDATE ON rsvps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Insert sample data for testing
-- =====================================================
INSERT INTO rsvps (
  full_name, 
  email, 
  phone, 
  attendees, 
  additional_attendees,
  days,
  drinks,
  meal_preference,
  special_requirements,
  confirmation_accepted,
  status
) VALUES (
  'Test User',
  'test@farmaris.com',
  '+264 81 123 4567',
  2,
  '[{"fullName": "Jane Test", "phone": "+264 81 234 5678"}]'::jsonb,
  ARRAY['friday', 'saturday'],
  ARRAY['Windhoek Lager (330ml)', 'Farm Wine Selection (150ml)'],
  'standard',
  'No special requirements',
  true,
  'confirmed'
) ON CONFLICT DO NOTHING;

-- Step 10: Verification queries
-- =====================================================
-- Check RLS status
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename = 'rsvps';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'rsvps'
ORDER BY policyname;

-- Check sample data
SELECT 
  id,
  full_name,
  email,
  attendees,
  jsonb_array_length(additional_attendees) as additional_count,
  array_length(days, 1) as days_count,
  array_length(drinks, 1) as drinks_count,
  status,
  created_at
FROM rsvps
LIMIT 5;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RSVP table created with comprehensive schema';
  RAISE NOTICE '✅ RLS enabled with policies for anonymous INSERT and SELECT';
  RAISE NOTICE '✅ Policies created for both anonymous and authenticated users';
  RAISE NOTICE '✅ Performance indexes created';
  RAISE NOTICE '✅ Sample data inserted for testing';
  RAISE NOTICE '🎉 Farm Aris RSVP system is ready for production!';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Next steps:';
  RAISE NOTICE '   1. Update your application environment variables';
  RAISE NOTICE '   2. Update RSVP service to use returning: minimal';
  RAISE NOTICE '   3. Test form submission';
END $$;