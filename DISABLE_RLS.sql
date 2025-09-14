-- =====================================================
-- DISABLE RLS TEMPORARILY for Farm Aris RSVP Testing
-- =====================================================
-- Run this in Supabase SQL Editor to allow form submissions

-- Method 1: Completely disable RLS (TEMPORARY - for testing only)
ALTER TABLE rsvps DISABLE ROW LEVEL SECURITY;

-- OR if you prefer to keep RLS enabled, use Method 2 instead:
-- Method 2: Create a very permissive policy
-- DROP POLICY IF EXISTS "Allow all operations" ON rsvps;
-- CREATE POLICY "Allow all operations" ON rsvps FOR ALL USING (true) WITH CHECK (true);

-- Check if table exists and show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'rsvps';

-- Show table info
\d rsvps