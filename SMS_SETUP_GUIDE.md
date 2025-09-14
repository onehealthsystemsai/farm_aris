# SMS Integration Setup Guide

## Environment Variables Setup

You need to set up the following environment variables in your Supabase Edge Function secrets:

### Required Variables:
1. `SMS_PORTAL_CLIENT_ID` - Your SMS Portal Client ID
2. `SMS_PORTAL_API_SECRET` - Your SMS Portal API Secret

### How to Set Up Environment Variables:

#### Option 1: Using Supabase CLI
```bash
# Set SMS Portal Client ID
supabase secrets set SMS_PORTAL_CLIENT_ID=your_client_id_here

# Set SMS Portal API Secret  
supabase secrets set SMS_PORTAL_API_SECRET=your_api_secret_here
```

#### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Edge Functions" section
3. Click on "Environment Variables" or "Secrets"
4. Add the two variables mentioned above

## Testing the Integration

After setting up the environment variables, you can test the SMS integration by:

1. Creating a test RSVP through your website
2. Check the Edge Function logs for SMS sending status
3. Verify that the `sms_confirmation_sent` and `sms_sent_at` fields are updated in the database

## SMS Message Format

The SMS will be sent with this format:
```
Dear [Name],

Thank you for registering for the Farm Aris Grand Opening! 🌾

Event Details:
📅 Date: 17-18 January 2025
🗺️ Location: Grootfontein, Namibia
👥 Attendees: [Number]

We're excited to see you there!

Best regards,
Farm Aris Team
```

## Troubleshooting

1. **SMS not sending**: Check Edge Function logs for error messages
2. **Phone number issues**: Ensure phone numbers are in correct format (starting with +264 for Namibia)
3. **Credentials issues**: Verify SMS Portal credentials are correctly set in environment variables
4. **Database not updating**: Check that the RSVP record exists and the Edge Function has proper database access

## Monitoring SMS Status

You can check SMS status by querying the rsvps table:
```sql
SELECT id, full_name, phone, sms_confirmation_sent, sms_sent_at 
FROM rsvps 
ORDER BY created_at DESC;
```