-- Create users table for attendee management
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

-- Create food_options table
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

-- Create drink_options table
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

-- Create attendance table
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

-- Create user_food_selections junction table
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

-- Create user_drink_selections junction table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_rsvp_id ON attendance(rsvp_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(attendance_status);
CREATE INDEX IF NOT EXISTS idx_user_food_selections_user_id ON user_food_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_drink_selections_user_id ON user_drink_selections(user_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_food_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_drink_selections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Food options are viewable by everyone" ON food_options
  FOR SELECT USING (true);

CREATE POLICY "Drink options are viewable by everyone" ON drink_options
  FOR SELECT USING (true);

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for attendance
CREATE POLICY "Users can view their own attendance" ON attendance
  FOR SELECT USING (auth.uid()::text = user_id::text OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin'
  ));

-- Create RLS policies for food and drink selections
CREATE POLICY "Users can view their own food selections" ON user_food_selections
  FOR SELECT USING (auth.uid()::text = user_id::text OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin'
  ));

CREATE POLICY "Users can manage their own food selections" ON user_food_selections
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own drink selections" ON user_drink_selections
  FOR SELECT USING (auth.uid()::text = user_id::text OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid()::uuid AND users.role = 'admin'
  ));

CREATE POLICY "Users can manage their own drink selections" ON user_drink_selections
  FOR ALL USING (auth.uid()::text = user_id::text);