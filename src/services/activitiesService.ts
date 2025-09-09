import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type Activity = Database['public']['Tables']['activities']['Row']
type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export const activitiesService = {
  // Get all activities
  async getAll(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching activities:', error)
      throw error
    }

    return data || []
  },

  // Get featured activities
  async getFeatured(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('is_featured', true)
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching featured activities:', error)
      throw error
    }

    return data || []
  },

  // Get activities by category
  async getByCategory(category: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('category', category)
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching activities by category:', error)
      throw error
    }

    return data || []
  },

  // Get activity by ID
  async getById(id: string): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching activity:', error)
      return null
    }

    return data
  },

  // Create new activity (admin function)
  async create(activityData: ActivityInsert): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single()

    if (error) {
      console.error('Error creating activity:', error)
      throw error
    }

    return data
  }
}