-- =====================================================
-- SUPABASE RLS SETUP - Working Version
-- Farm Aris RSVP System - Fixed for Supabase
-- =====================================================
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jyvgjcagmmtiqgexqgwa/sql/new

-- Step 1: Create RSVP table
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
  
  -- Preferences
  drinks TEXT[] DEFAULT '{}',
  meal_preference TEXT,
  special_requirements TEXT DEFAULT '',
  
  -- Confirmation
  confirmation_accepted BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'confirmed',
  
  -- Admin Fields
  qr_code TEXT,
  ticket_id TEXT,
  notes TEXT,
  is_vip BOOLEAN DEFAULT FALSE
);

-- Step 2: Enable RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Step 3: Clean up existing policies
DROP POLICY IF EXISTS "Allow anonymous insertions" ON rsvps;
DROP POLICY IF EXISTS "Allow anonymous selections" ON rsvps;
DROP POLICY IF EXISTS "Anonymous users can submit RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Anonymous users can read their submitted RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Authenticated users can view all RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Authenticated users can insert RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Authenticated users can update RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Authenticated users can delete RSVPs" ON rsvps;

-- Step 4: Create INSERT policy for anonymous users
CREATE POLICY "anon_can_insert_rsvps" ON rsvps
FOR INSERT TO anon
WITH CHECK (
  length(full_name) > 0 AND
  length(email) > 0 AND
  length(phone) > 0 AND
  confirmation_accepted = true
);

-- Step 5: Create SELECT policy for anonymous users (CRITICAL FIX)
CREATE POLICY "anon_can_select_rsvps" ON rsvps
FOR SELECT TO anon
USING (true);

-- Step 6: Create policies for authenticated users
CREATE POLICY "auth_can_view_rsvps" ON rsvps
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "auth_can_insert_rsvps" ON rsvps
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "auth_can_update_rsvps" ON rsvps
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "auth_can_delete_rsvps" ON rsvps
FOR DELETE TO authenticated
USING (true);

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);

-- Step 8: Test insert (this should work now)
INSERT INTO rsvps (
  full_name, 
  email, 
  phone, 
  attendees,
  days,
  drinks,
  meal_preference,
  confirmation_accepted
) VALUES (
  'Test User Setup',
  'setup-test@farmaris.com',
  '+264 81 999 9999',
  1,
  ARRAY['saturday'],
  ARRAY['Test Drink'],
  'standard',
  true
) ON CONFLICT DO NOTHING;

-- Step 9: Verification
SELECT 'Setup Complete!' as status;
SELECT COUNT(*) as total_rsvps FROM rsvps;

-- Success message
SELECT '✅ Table created successfully' as step_1;
SELECT '✅ RLS enabled with anonymous policies' as step_2;  
SELECT '✅ Test data inserted' as step_3;
SELECT '🎉 Ready for RSVP form submissions!' as final_status;