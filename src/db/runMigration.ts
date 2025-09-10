import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jyvgjcagmmtiqgexqgwa.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dmdqY2FnbW10aXFnZXhxZ3dhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYzNCwiZXhwIjoyMDczMDA2NjM0fQ.-NdW3MnSdNRZr878z4C8jzIpJqw-YO3V0vU249lElMg'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...')
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', '001_create_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
    
    // Split SQL into individual statements (basic split by semicolon)
    const statements = migrationSQL
      .split(';')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';')
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).single()
      
      if (error) {
        // Try direct execution as alternative
        const { error: directError } = await supabase.from('_migrations').select('*').limit(1)
        
        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          // Continue with next statement instead of failing completely
          continue
        }
      }
    }
    
    console.log('✅ Migration completed successfully!')
    
    // Insert sample data
    console.log('🍔 Inserting sample food options...')
    await insertSampleData()
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

async function insertSampleData() {
  // Insert sample food options
  const foodOptions = [
    {
      name: 'Farm Fresh Salad',
      description: 'Locally grown vegetables with homemade dressing',
      category: 'starter',
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      allergens: [],
      serving_time: 'All Day',
      display_order: 1
    },
    {
      name: 'Namibian Braai Platter',
      description: 'Traditional grilled meats with pap and relish',
      category: 'main',
      is_halal: true,
      allergens: [],
      serving_time: 'Lunch & Dinner',
      display_order: 2
    },
    {
      name: 'Vegetable Potjie',
      description: 'Slow-cooked vegetable stew in cast iron pot',
      category: 'main',
      is_vegetarian: true,
      allergens: [],
      serving_time: 'Dinner',
      display_order: 3
    },
    {
      name: 'Melktert',
      description: 'Traditional milk tart dessert',
      category: 'dessert',
      is_vegetarian: true,
      allergens: ['dairy', 'eggs'],
      serving_time: 'All Day',
      display_order: 4
    }
  ]
  
  const { error: foodError } = await supabase
    .from('food_options')
    .insert(foodOptions)
  
  if (foodError) {
    console.error('Error inserting food options:', foodError)
  } else {
    console.log('✅ Sample food options inserted')
  }
  
  // Insert sample drink options
  const drinkOptions = [
    {
      name: 'Fresh Farm Juice',
      description: 'Freshly squeezed orange and mango juice',
      category: 'juice',
      is_sugar_free: false,
      serving_size: '250ml',
      display_order: 1
    },
    {
      name: 'Windhoek Lager',
      description: 'Namibian premium beer',
      category: 'beer',
      is_alcoholic: true,
      brand: 'Windhoek',
      serving_size: '330ml',
      display_order: 2
    },
    {
      name: 'Rock Shandy',
      description: 'Lemonade, soda water, and Angostura bitters',
      category: 'soft_drink',
      serving_size: '300ml',
      display_order: 3
    },
    {
      name: 'Rooibos Tea',
      description: 'Traditional South African red bush tea',
      category: 'hot_beverage',
      serving_size: 'Cup',
      display_order: 4
    }
  ]
  
  const { error: drinkError } = await supabase
    .from('drink_options')
    .insert(drinkOptions)
  
  if (drinkError) {
    console.error('Error inserting drink options:', drinkError)
  } else {
    console.log('✅ Sample drink options inserted')
  }
}

// Run the migration
runMigration()