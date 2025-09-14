// =====================================================
// Test Supabase Connection Script
// =====================================================
// Run with: node TEST_SUPABASE_CONNECTION.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('📊 Environment Check:')
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
console.log(`   VITE_SUPABASE_PUBLISHABLE_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n🧪 Testing database connection...')
    
    // Test 1: Check if we can connect
    const { data: connectionTest, error: connectionError } = await supabase
      .from('rsvps')
      .select('count', { count: 'exact' })
      .limit(0)
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    console.log(`📈 Current RSVP count: ${connectionTest?.length || 0}`)
    
    // Test 2: Check RLS policies
    console.log('\n🔒 Testing RLS policies...')
    
    const testData = {
      full_name: 'Test User ' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      phone: '+264 81 000 0000',
      attendees: 1,
      additional_attendees: [],
      days: ['saturday'],
      drinks: ['Test Drink'],
      meal_preference: 'standard',
      special_requirements: 'Test requirements',
      confirmation_accepted: true
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('rsvps')
      .insert(testData)
      .select('id')
      .single()
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError)
      if (insertError.code === '42501') {
        console.error('🚨 RLS Policy Error: Anonymous users cannot insert. Run the RESEARCH_BASED_SETUP.sql script first!')
      }
      return false
    }
    
    console.log('✅ Anonymous insert successful:', insertData?.id)
    
    // Test 3: Clean up test data
    if (insertData?.id) {
      // Note: This will likely fail due to RLS, but that's expected
      await supabase
        .from('rsvps')
        .delete()
        .eq('id', insertData.id)
      
      console.log('🧹 Test cleanup attempted')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Your Supabase connection is ready.')
    console.log('\n📋 Next steps:')
    console.log('   1. Make sure you ran RESEARCH_BASED_SETUP.sql in Supabase')
    console.log('   2. Test the RSVP form at http://localhost:5175')
    console.log('   3. Check Supabase dashboard for submitted RSVPs')
  } else {
    console.log('\n💥 Tests failed. Check the errors above and:')
    console.log('   1. Verify your environment variables are correct')
    console.log('   2. Run RESEARCH_BASED_SETUP.sql in your Supabase SQL editor')
    console.log('   3. Check your Supabase project is active')
  }
  process.exit(success ? 0 : 1)
})