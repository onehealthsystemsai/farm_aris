import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type RSVP = Database['public']['Tables']['rsvps']['Row']
type RSVPInsert = Database['public']['Tables']['rsvps']['Insert']
type RSVPUpdate = Database['public']['Tables']['rsvps']['Update']

export const rsvpService = {
  // Create new RSVP
  async create(rsvpData: RSVPInsert): Promise<RSVP | null> {
    const { data, error } = await supabase
      .from('rsvps')
      .insert(rsvpData)
      .select()
      .single()

    if (error) {
      console.error('Error creating RSVP:', error)
      throw error
    }

    return data
  },

  // Get all RSVPs (admin function)
  async getAll(): Promise<RSVP[]> {
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
  async getById(id: string): Promise<RSVP | null> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching RSVP:', error)
      return null
    }

    return data
  },

  // Get RSVP by email
  async getByEmail(email: string): Promise<RSVP | null> {
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
  async update(id: string, updates: RSVPUpdate): Promise<RSVP | null> {
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
    total: number
    confirmed: number
    pending: number
    cancelled: number
    totalGuests: number
  }> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('status, num_guests')

    if (error) {
      console.error('Error fetching RSVP stats:', error)
      throw error
    }

    const stats = {
      total: data?.length || 0,
      confirmed: data?.filter(rsvp => rsvp.status === 'confirmed').length || 0,
      pending: data?.filter(rsvp => rsvp.status === 'pending').length || 0,
      cancelled: data?.filter(rsvp => rsvp.status === 'cancelled').length || 0,
      totalGuests: data?.reduce((sum, rsvp) => sum + (rsvp.num_guests || 0), 0) || 0
    }

    return stats
  }
}