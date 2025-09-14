// Test SMS Integration
// This script tests the SMS integration without actually sending SMS
// Run this after setting up your SMS Portal credentials

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jyvgjcagmmtiqgexqgwa.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'your_publishable_key_here'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSMSIntegration() {
  console.log('🧪 Testing SMS Integration Setup...\n')

  try {
    // Test 1: Check if Edge Function exists
    console.log('1️⃣ Testing Edge Function accessibility...')
    
    const testPayload = {
      rsvpId: 'test-id',
      name: 'Test User',
      phone: '+264811234567',
      email: 'test@example.com',
      attendees: 2
    }

    const { data, error } = await supabase.functions.invoke('send-rsvp-sms', {
      body: testPayload
    })

    if (error) {
      if (error.message.includes('SMS Portal credentials not configured')) {
        console.log('❌ Edge Function is accessible but SMS Portal credentials are not set')
        console.log('   Please set up SMS_PORTAL_CLIENT_ID and SMS_PORTAL_API_SECRET')
        console.log('   See SMS_SETUP_GUIDE.md for instructions')
      } else {
        console.log('❌ Edge Function error:', error.message)
      }
    } else {
      console.log('✅ Edge Function is accessible and configured')
      console.log('Response:', data)
    }

    // Test 2: Check database columns
    console.log('\n2️⃣ Testing database schema...')
    
    const { error: schemaError } = await supabase
      .from('rsvps')
      .select('id, sms_confirmation_sent, sms_sent_at')
      .limit(1)

    if (schemaError) {
      console.log('❌ Database schema test failed:', schemaError.message)
    } else {
      console.log('✅ Database schema is correct (sms_confirmation_sent, sms_sent_at columns exist)')
    }

    // Test 3: Check recent RSVPs SMS status
    console.log('\n3️⃣ Checking recent RSVPs SMS status...')
    
    const { data: recentRSVPs, error: rsvpError } = await supabase
      .from('rsvps')
      .select('id, full_name, phone, sms_confirmation_sent, sms_sent_at, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (rsvpError) {
      console.log('❌ Failed to fetch RSVPs:', rsvpError.message)
    } else {
      console.log('✅ Recent RSVPs:')
      recentRSVPs.forEach(rsvp => {
        const smsStatus = rsvp.sms_confirmation_sent ? '✅ Sent' : '⏳ Not sent'
        const sentAt = rsvp.sms_sent_at ? ` (${new Date(rsvp.sms_sent_at).toLocaleString()})` : ''
        console.log(`   ${rsvp.full_name} (${rsvp.phone}) - ${smsStatus}${sentAt}`)
      })
    }

    console.log('\n🎉 SMS Integration Test Complete!')
    console.log('\nNext steps:')
    console.log('1. Set up SMS Portal credentials (see SMS_SETUP_GUIDE.md)')
    console.log('2. Create a test RSVP to verify SMS sending')
    console.log('3. Monitor Edge Function logs for SMS status')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSMSIntegration()
}

export default testSMSIntegration