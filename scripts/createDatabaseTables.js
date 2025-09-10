require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://jyvgjcagmmtiqgexqgwa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dmdqY2FnbW10aXFnZXhxZ3dhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMDYzNCwiZXhwIjoyMDczMDA2NjM0fQ.-NdW3MnSdNRZr878z4C8jzIpJqw-YO3V0vU249lElMg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  console.log('🚀 Creating Farm Aris database tables...\n')
  
  try {
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('rsvps')
      .select('id')
      .limit(1)
    
    if (testError && !testError.message.includes('relation')) {
      console.log('✅ Connected to Supabase successfully!')
    }
    
    // Create sample data for food_options
    console.log('🍔 Creating food options...')
    const foodOptions = [
      {
        name: 'Farm Fresh Salad',
        description: 'Locally grown vegetables with homemade dressing',
        category: 'starter',
        is_vegetarian: true,
        is_vegan: true,
        is_gluten_free: true,
        serving_time: 'All Day',
        available: true,
        display_order: 1
      },
      {
        name: 'Namibian Braai Platter',
        description: 'Traditional grilled meats with pap and relish',
        category: 'main',
        is_halal: true,
        serving_time: 'Lunch & Dinner',
        available: true,
        display_order: 2
      },
      {
        name: 'Vegetable Potjie',
        description: 'Slow-cooked vegetable stew in cast iron pot',
        category: 'main',
        is_vegetarian: true,
        serving_time: 'Dinner',
        available: true,
        display_order: 3
      },
      {
        name: 'Biltong Platter',
        description: 'Selection of dried meats and droëwors',
        category: 'snack',
        serving_time: 'All Day',
        available: true,
        display_order: 4
      },
      {
        name: 'Melktert',
        description: 'Traditional milk tart dessert',
        category: 'dessert',
        is_vegetarian: true,
        serving_time: 'All Day',
        available: true,
        display_order: 5
      },
      {
        name: 'Koeksisters',
        description: 'Traditional twisted pastries soaked in syrup',
        category: 'dessert',
        is_vegetarian: true,
        serving_time: 'Tea Time',
        available: true,
        display_order: 6
      }
    ]
    
    // Try to insert food options (will fail if table doesn't exist)
    const { data: foodData, error: foodError } = await supabase
      .from('food_options')
      .insert(foodOptions)
      .select()
    
    if (foodError) {
      console.log('ℹ️ Food options table needs to be created first')
      console.log('   Please run the SQL script in Supabase Dashboard')
    } else {
      console.log('✅ Food options created:', foodData.length, 'items')
    }
    
    // Create sample data for drink_options
    console.log('\n🥤 Creating drink options...')
    const drinkOptions = [
      {
        name: 'Fresh Farm Juice',
        description: 'Freshly squeezed orange and mango juice',
        category: 'juice',
        is_alcoholic: false,
        serving_size: '250ml',
        available: true,
        display_order: 1
      },
      {
        name: 'Windhoek Lager',
        description: 'Namibian premium beer',
        category: 'beer',
        is_alcoholic: true,
        brand: 'Windhoek',
        serving_size: '330ml',
        available: true,
        display_order: 2
      },
      {
        name: 'Tafel Lager',
        description: 'Namibian beer',
        category: 'beer',
        is_alcoholic: true,
        brand: 'Tafel',
        serving_size: '330ml',
        available: true,
        display_order: 3
      },
      {
        name: 'Rock Shandy',
        description: 'Lemonade, soda water, and Angostura bitters',
        category: 'soft_drink',
        is_alcoholic: false,
        serving_size: '300ml',
        available: true,
        display_order: 4
      },
      {
        name: 'Rooibos Tea',
        description: 'Traditional South African red bush tea',
        category: 'hot_beverage',
        is_alcoholic: false,
        serving_size: 'Cup',
        available: true,
        display_order: 5
      },
      {
        name: 'Amarula',
        description: 'African cream liqueur',
        category: 'spirits',
        is_alcoholic: true,
        brand: 'Amarula',
        serving_size: '50ml',
        available: true,
        display_order: 6
      },
      {
        name: 'Sparkling Water',
        description: 'Carbonated mineral water',
        category: 'water',
        is_alcoholic: false,
        serving_size: '250ml',
        available: true,
        display_order: 7
      }
    ]
    
    const { data: drinkData, error: drinkError } = await supabase
      .from('drink_options')
      .insert(drinkOptions)
      .select()
    
    if (drinkError) {
      console.log('ℹ️ Drink options table needs to be created first')
      console.log('   Please run the SQL script in Supabase Dashboard')
    } else {
      console.log('✅ Drink options created:', drinkData.length, 'items')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📝 IMPORTANT: Table Creation Instructions')
    console.log('='.repeat(60))
    console.log('\nThe Supabase JavaScript client cannot create tables directly.')
    console.log('Please follow these steps:\n')
    console.log('1. Go to your Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard/project/jyvgjcagmmtiqgexqgwa/sql/new')
    console.log('\n2. Copy and run the SQL script from:')
    console.log('   src/db/migrations/001_create_tables.sql')
    console.log('\n3. After creating tables, run this script again to add sample data')
    console.log('\n' + '='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the script
createTables()