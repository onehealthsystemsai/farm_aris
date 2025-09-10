import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a singleton Supabase client to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'farm-aris-auth',
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'farm-aris-website'
        }
      }
    })
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()

// Export types for use throughout the app
export type { Database } from '../types/database.types'