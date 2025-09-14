// Direct SMS test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jyvgjcagmmtiqgexqgwa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dmdqY2FnbW10aXFnZXhxZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzA2MzQsImV4cCI6MjA3MzAwNjYzNH0.hftscrp2fspxoSFZ78V9xRYSg6y3Ag4Hx_5vEbiviwk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function sendTestSMS() {
  console.log('🚀 Sending test SMS to 0812222331...')
  
  try {
    const { data, error } = await supabase.functions.invoke('send-rsvp-sms', {
      body: {
        rsvpId: 'aa0c185a-b2c0-4bf4-ba54-41fa90bbe077',
        name: 'Test User SMS',
        phone: '0812222331',
        email: 'test@farmaris.com',
        attendees: 2
      }
    })

    if (error) {
      console.error('❌ Edge Function Error:', error)
      return
    }

    if (data?.success) {
      console.log('✅ SMS sent successfully!')
      console.log('Phone:', data.phone)
      console.log('Message ID:', data.messageId)
      
      // Check database update
      const { data: rsvpData, error: dbError } = await supabase
        .from('rsvps')
        .select('sms_confirmation_sent, sms_sent_at')
        .eq('id', 'aa0c185a-b2c0-4bf4-ba54-41fa90bbe077')
        .single()
      
      if (!dbError && rsvpData) {
        console.log('✅ Database updated:', {
          sms_sent: rsvpData.sms_confirmation_sent,
          sent_at: rsvpData.sms_sent_at
        })
      }
    } else {
      console.error('❌ SMS sending failed:', data?.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

sendTestSMS()