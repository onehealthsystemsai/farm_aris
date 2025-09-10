const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env')
  process.exit(1)
}

console.log('🔗 Connecting to Supabase:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Farm Aris database tables...\n')
    
    // Create users table
    console.log('1️⃣ Creating users table...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (usersError) {
      console.log('⚠️ Users table might already exist or:', usersError.message)
    } else {
      console.log('✅ Users table created')
    }
    
    // Create food_options table
    console.log('\n2️⃣ Creating food_options table...')
    const { error: foodError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (foodError) {
      console.log('⚠️ Food options table might already exist or:', foodError.message)
    } else {
      console.log('✅ Food options table created')
    }
    
    // Create drink_options table
    console.log('\n3️⃣ Creating drink_options table...')
    const { error: drinkError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (drinkError) {
      console.log('⚠️ Drink options table might already exist or:', drinkError.message)
    } else {
      console.log('✅ Drink options table created')
    }
    
    // Create attendance table
    console.log('\n4️⃣ Creating attendance table...')
    const { error: attendanceError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (attendanceError) {
      console.log('⚠️ Attendance table might already exist or:', attendanceError.message)
    } else {
      console.log('✅ Attendance table created')
    }
    
    // Create junction tables
    console.log('\n5️⃣ Creating user_food_selections table...')
    const { error: foodSelError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (foodSelError) {
      console.log('⚠️ User food selections table might already exist or:', foodSelError.message)
    } else {
      console.log('✅ User food selections table created')
    }
    
    console.log('\n6️⃣ Creating user_drink_selections table...')
    const { error: drinkSelError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (drinkSelError) {
      console.log('⚠️ User drink selections table might already exist or:', drinkSelError.message)
    } else {
      console.log('✅ User drink selections table created')
    }
    
    console.log('\n🎉 Database setup complete!')
    console.log('\n📝 Note: Row Level Security (RLS) policies should be configured in the Supabase dashboard.')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()