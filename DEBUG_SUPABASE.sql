-- =====================================================
-- DEBUG SUPABASE SETUP for Farm Aris
-- =====================================================

-- Step 1: Check if rsvps table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'rsvps';

-- Step 2: Show current RLS status
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename = 'rsvps';

-- Step 3: Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'rsvps';

-- Step 4: Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'rsvps'
ORDER BY ordinal_position;

-- Step 5: Try a simple insert test (this should work after running the setup)
-- INSERT INTO rsvps (full_name, email, phone) VALUES ('Test User', 'test@example.com', '+1234567890');

-- Step 6: Show any existing data
SELECT COUNT(*) as total_rsvps FROM rsvps;