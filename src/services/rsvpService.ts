import { supabase } from '../lib/supabase'

export interface RSVPFormData {
  fullName: string;
  email: string;
  phone: string;
  attendees: number;
  additionalAttendees: Array<{
    fullName: string;
    phone: string;
  }>;
  days: string[];
  drinks: string[];
  mealPreference: string;
  specialRequirements: string;
  confirmationAccepted: boolean;
}

export interface RSVPRecord {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  attendees: number;
  additional_attendees: any; // JSONB
  days: string[];
  drinks: string[];
  meal_preference: string;
  special_requirements: string;
  confirmation_accepted: boolean;
  status: string;
  qr_code?: string;
  ticket_id?: string;
  notes?: string;
  is_vip: boolean;
  sms_confirmation_sent?: boolean;
  sms_sent_at?: string;
  invitation_numbers?: any; // JSONB array of invitation numbers
}

export const rsvpService = {
  // Create new RSVP with individual user records using database function
  async create(formData: RSVPFormData): Promise<RSVPRecord | null> {
    try {
      // Use the database function to handle user creation and RSVP creation atomically
      const { data, error } = await supabase.rpc('create_rsvp_with_users', {
        p_full_name: formData.fullName,
        p_email: formData.email,
        p_phone: formData.phone,
        p_attendees: formData.attendees,
        p_additional_attendees: formData.additionalAttendees || [],
        p_days: formData.days || [],
        p_drinks: formData.drinks || [],
        p_meal_preference: formData.mealPreference || '',
        p_special_requirements: formData.specialRequirements || '',
        p_confirmation_accepted: formData.confirmationAccepted || false
      })

      if (error) {
        console.error('Error creating RSVP with users:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('✅ RSVP created successfully with individual user records:', {
        rsvpId: data,
        totalAttendees: formData.attendees,
        additionalAttendees: formData.additionalAttendees?.length || 0
      })

      // Fetch and return the full RSVP record
      if (data) {
        try {
          const fullRecord = await this.getById(data)
          
          // Send SMS confirmation after successful RSVP creation
          if (fullRecord) {
            this.sendSMSConfirmation(fullRecord, formData).catch(smsError => {
              console.warn('SMS sending failed (but RSVP was created successfully):', smsError)
            })
          }
          
          return fullRecord
        } catch (fetchError) {
          console.warn('RSVP created successfully but could not fetch full record:', fetchError)
          const partialRecord = { id: data, created_at: new Date().toISOString() } as RSVPRecord
          
          // Still try to send SMS with available data
          this.sendSMSConfirmation(partialRecord, formData).catch(smsError => {
            console.warn('SMS sending failed (but RSVP was created successfully):', smsError)
          })
          
          return partialRecord
        }
      }

      return null
    } catch (error) {
      console.error('Error in RSVP creation workflow:', error)
      throw error
    }
  },

  // Get all RSVPs (admin function)
  async getAll(): Promise<RSVPRecord[]> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching RSVPs:', error)
      throw error
    }

    return data || []
  },

  // Get RSVP by ID
  async getById(id: string): Promise<RSVPRecord | null> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching RSVP by ID:', error)
      if (error.code === 'PGRST116') {
        console.error('RSVP not found with ID:', id)
      }
      return null
    }

    return data
  },

  // Get RSVP by email
  async getByEmail(email: string): Promise<RSVPRecord | null> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return null
    }

    return data
  },

  // Update RSVP
  async update(id: string, updates: Partial<RSVPRecord>): Promise<RSVPRecord | null> {
    const { data, error } = await supabase
      .from('rsvps')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating RSVP:', error)
      throw error
    }

    return data
  },

  // Delete RSVP
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting RSVP:', error)
      throw error
    }

    return true
  },

  // Get RSVP statistics
  async getStats(): Promise<{
    totalRegistrations: number
    totalAttendees: number
    fridayAttendees: number
    saturdayAttendees: number
    campingAttendees: number
    confirmed: number
    pending: number
    cancelled: number
    vipCount: number
    mealPreferences: Record<string, number>
    drinkPreferences: Record<string, number>
  }> {
    const rsvps = await this.getAll()
    
    const stats = {
      totalRegistrations: rsvps.length,
      totalAttendees: rsvps.reduce((sum, rsvp) => sum + rsvp.attendees, 0),
      fridayAttendees: rsvps.filter(rsvp => rsvp.days.includes('friday')).length,
      saturdayAttendees: rsvps.filter(rsvp => rsvp.days.includes('saturday')).length,
      campingAttendees: rsvps.filter(rsvp => rsvp.days.includes('camping')).length,
      confirmed: rsvps.filter(rsvp => rsvp.status === 'confirmed').length,
      pending: rsvps.filter(rsvp => rsvp.status === 'pending').length,
      cancelled: rsvps.filter(rsvp => rsvp.status === 'cancelled').length,
      vipCount: rsvps.filter(rsvp => rsvp.is_vip).length,
      mealPreferences: {} as Record<string, number>,
      drinkPreferences: {} as Record<string, number>
    }

    // Count meal preferences
    rsvps.forEach(rsvp => {
      if (rsvp.meal_preference) {
        stats.mealPreferences[rsvp.meal_preference] = (stats.mealPreferences[rsvp.meal_preference] || 0) + 1
      }
    })

    // Count drink preferences
    rsvps.forEach(rsvp => {
      rsvp.drinks.forEach(drink => {
        stats.drinkPreferences[drink] = (stats.drinkPreferences[drink] || 0) + 1
      })
    })

    return stats
  },

  // Get all attendees including additional attendees
  async getAllAttendees(): Promise<Array<{
    name: string;
    phone: string;
    email?: string;
    isPrimary: boolean;
    rsvpId: string;
    mealPreference?: string;
    specialRequirements?: string;
  }>> {
    const rsvps = await this.getAll()
    const allAttendees: Array<any> = []

    rsvps.forEach(rsvp => {
      // Add primary attendee
      allAttendees.push({
        name: rsvp.full_name,
        phone: rsvp.phone,
        email: rsvp.email,
        isPrimary: true,
        rsvpId: rsvp.id,
        mealPreference: rsvp.meal_preference,
        specialRequirements: rsvp.special_requirements
      })

      // Add additional attendees
      if (rsvp.additional_attendees && Array.isArray(rsvp.additional_attendees)) {
        rsvp.additional_attendees.forEach((attendee: any) => {
          allAttendees.push({
            name: attendee.fullName,
            phone: attendee.phone,
            isPrimary: false,
            rsvpId: rsvp.id,
            mealPreference: rsvp.meal_preference,
            specialRequirements: rsvp.special_requirements
          })
        })
      }
    })

    return allAttendees
  },

  // Send SMS confirmation for RSVP registration
  async sendSMSConfirmation(rsvp: RSVPRecord, formData: RSVPFormData): Promise<boolean> {
    try {
      // Prepare attendees array with primary attendee and additional attendees
      const attendees = []
      
      // Add primary attendee
      attendees.push({
        name: formData.fullName,
        phone: formData.phone
      })
      
      // Add additional attendees
      if (formData.additionalAttendees && formData.additionalAttendees.length > 0) {
        formData.additionalAttendees.forEach(attendee => {
          attendees.push({
            name: attendee.fullName,
            phone: attendee.phone
          })
        })
      }

      const { data, error } = await supabase.functions.invoke('send-rsvp-sms', {
        body: {
          rsvpId: rsvp.id,
          attendees: attendees
        }
      })

      if (error) {
        console.error('Edge Function error:', error)
        throw new Error(`SMS Edge Function failed: ${error.message}`)
      }

      if (data?.success) {
        console.log('✅ SMS confirmations sent successfully:', {
          rsvpId: rsvp.id,
          totalAttempted: data.totalAttempted,
          successful: data.successful,
          failed: data.failed,
          invitationNumbers: data.invitationNumbers
        })
        return true
      } else {
        console.error('SMS sending failed:', data?.error)
        throw new Error(data?.error || 'SMS sending failed')
      }
    } catch (error) {
      console.error('Error sending SMS confirmation:', error)
      throw error
    }
  }
}