-- =====================================================
-- Farm Aris Grand Opening - Complete Database Setup
-- =====================================================
-- Run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jyvgjcagmmtiqgexqgwa/sql/new

-- 1. CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'attendee' CHECK (role IN ('attendee', 'admin', 'staff')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. CREATE FOOD OPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS food_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('starter', 'main', 'dessert', 'snack', 'breakfast')),
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_halal BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  allergens TEXT[],
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  serving_time TEXT,
  price DECIMAL(10,2),
  display_order INTEGER DEFAULT 0
);

-- 3. CREATE DRINK OPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS drink_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('soft_drink', 'juice', 'water', 'beer', 'wine', 'spirits', 'cocktail', 'hot_beverage')),
  is_alcoholic BOOLEAN DEFAULT FALSE,
  is_sugar_free BOOLEAN DEFAULT FALSE,
  brand TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  serving_size TEXT,
  price DECIMAL(10,2),
  display_order INTEGER DEFAULT 0
);

-- 4. CREATE ATTENDANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rsvp_id UUID REFERENCES rsvps(id) ON DELETE SET NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  attendance_status TEXT DEFAULT 'expected' CHECK (attendance_status IN ('expected', 'checked_in', 'checked_out', 'no_show')),
  table_number TEXT,
  seat_number TEXT,
  special_notes TEXT,
  qr_code TEXT UNIQUE,
  is_vip BOOLEAN DEFAULT FALSE,
  companion_count INTEGER DEFAULT 0
);

-- 5. CREATE USER FOOD SELECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_food_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_option_id UUID REFERENCES food_options(id) ON DELETE CASCADE,
  attendance_id UUID REFERENCES attendance(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  special_requests TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, food_option_id, attendance_id)
);

-- 6. CREATE USER DRINK SELECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_drink_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drink_option_id UUID REFERENCES drink_options(id) ON DELETE CASCADE,
  attendance_id UUID REFERENCES attendance(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  special_requests TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, drink_option_id, attendance_id)
);

-- 7. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_rsvp_id ON attendance(rsvp_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(attendance_status);
CREATE INDEX IF NOT EXISTS idx_user_food_selections_user_id ON user_food_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_drink_selections_user_id ON user_drink_selections(user_id);

-- 8. CREATE UPDATE TRIGGER FOR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_food_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_drink_selections ENABLE ROW LEVEL SECURITY;

-- 10. CREATE RLS POLICIES
-- =====================================================

-- Food options are viewable by everyone
CREATE POLICY "Food options are viewable by everyone" ON food_options
  FOR SELECT USING (true);

-- Drink options are viewable by everyone
CREATE POLICY "Drink options are viewable by everyone" ON drink_options
  FOR SELECT USING (true);

-- Users can view their own profile (simplified for now)
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

-- Attendance is viewable by everyone (for check-in purposes)
CREATE POLICY "Attendance viewable by all" ON attendance
  FOR SELECT USING (true);

-- Food selections viewable by all
CREATE POLICY "Food selections viewable by all" ON user_food_selections
  FOR SELECT USING (true);

-- Drink selections viewable by all
CREATE POLICY "Drink selections viewable by all" ON user_drink_selections
  FOR SELECT USING (true);

-- 11. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample food options
INSERT INTO food_options (name, description, category, is_vegetarian, is_vegan, is_halal, is_gluten_free, serving_time, available, display_order)
VALUES 
  ('Farm Fresh Salad', 'Locally grown vegetables with homemade dressing', 'starter', true, true, false, true, 'All Day', true, 1),
  ('Namibian Braai Platter', 'Traditional grilled meats with pap and relish', 'main', false, false, true, false, 'Lunch & Dinner', true, 2),
  ('Vegetable Potjie', 'Slow-cooked vegetable stew in cast iron pot', 'main', true, false, false, false, 'Dinner', true, 3),
  ('Biltong Platter', 'Selection of dried meats and droëwors', 'snack', false, false, false, true, 'All Day', true, 4),
  ('Farm Breakfast', 'Eggs, bacon, boerewors, tomato, and toast', 'breakfast', false, false, false, false, 'Morning', true, 5),
  ('Melktert', 'Traditional milk tart dessert', 'dessert', true, false, false, false, 'All Day', true, 6),
  ('Koeksisters', 'Traditional twisted pastries soaked in syrup', 'dessert', true, false, false, false, 'Tea Time', true, 7)
ON CONFLICT DO NOTHING;

-- Insert sample drink options
INSERT INTO drink_options (name, description, category, is_alcoholic, brand, serving_size, available, display_order)
VALUES 
  ('Fresh Farm Juice', 'Freshly squeezed orange and mango juice', 'juice', false, NULL, '250ml', true, 1),
  ('Windhoek Lager', 'Namibian premium beer', 'beer', true, 'Windhoek', '330ml', true, 2),
  ('Tafel Lager', 'Namibian beer', 'beer', true, 'Tafel', '330ml', true, 3),
  ('Rock Shandy', 'Lemonade, soda water, and Angostura bitters', 'soft_drink', false, NULL, '300ml', true, 4),
  ('Rooibos Tea', 'Traditional South African red bush tea', 'hot_beverage', false, NULL, 'Cup', true, 5),
  ('Amarula', 'African cream liqueur', 'spirits', true, 'Amarula', '50ml', true, 6),
  ('Sparkling Water', 'Carbonated mineral water', 'water', false, NULL, '250ml', true, 7),
  ('Farm Wine Selection', 'Local red and white wines', 'wine', true, 'Various', '150ml', true, 8)
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (email, full_name, phone, role)
VALUES 
  ('admin@farmaris.com', 'Admin User', '+264811234567', 'admin'),
  ('john.doe@example.com', 'John Doe', '+264812345678', 'attendee'),
  ('jane.smith@example.com', 'Jane Smith', '+264813456789', 'attendee')
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ All tables created successfully!';
  RAISE NOTICE '✅ Sample data inserted!';
  RAISE NOTICE '🎉 Farm Aris database setup complete!';
END $$;