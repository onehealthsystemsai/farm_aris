import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SQL execution failed: ${error}`)
  }
  
  return response.json()
}

async function createTables() {
  console.log('🚀 Creating Farm Aris database tables...\n')
  
  const tables = [
    {
      name: 'users',
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
        )
      `
    },
    {
      name: 'food_options',
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
        )
      `
    },
    {
      name: 'drink_options',
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
        )
      `
    },
    {
      name: 'attendance',
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
        )
      `
    },
    {
      name: 'user_food_selections',
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
        )
      `
    },
    {
      name: 'user_drink_selections',
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
        )
      `
    }
  ]
  
  for (const table of tables) {
    try {
      console.log(`Creating ${table.name} table...`)
      await executeSQL(table.sql)
      console.log(`✅ ${table.name} table created successfully`)
    } catch (error) {
      console.error(`❌ Failed to create ${table.name} table:`, error.message)
    }
  }
  
  console.log('\n✨ All tables created successfully!')
}

createTables().catch(console.error)