export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          phone?: string
          avatar_url?: string
          role: 'attendee' | 'admin' | 'staff'
          is_active: boolean
          last_login?: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          phone?: string
          avatar_url?: string
          role?: 'attendee' | 'admin' | 'staff'
          is_active?: boolean
          last_login?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          phone?: string
          avatar_url?: string
          role?: 'attendee' | 'admin' | 'staff'
          is_active?: boolean
          last_login?: string
          metadata?: Json
        }
      }
      rsvps: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone?: string
          num_guests: number
          dietary_requirements?: string
          accommodation_needed: boolean
          transportation_needed: boolean
          message?: string
          status: 'pending' | 'confirmed' | 'cancelled'
          qr_code?: string
          ticket_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string
          num_guests?: number
          dietary_requirements?: string
          accommodation_needed?: boolean
          transportation_needed?: boolean
          message?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          qr_code?: string
          ticket_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string
          num_guests?: number
          dietary_requirements?: string
          accommodation_needed?: boolean
          transportation_needed?: boolean
          message?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          qr_code?: string
          ticket_id?: string
        }
      }
      activities: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          start_time: string
          end_time: string
          location?: string
          capacity?: number
          image_url?: string
          is_featured: boolean
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          start_time: string
          end_time: string
          location?: string
          capacity?: number
          image_url?: string
          is_featured?: boolean
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          start_time?: string
          end_time?: string
          location?: string
          capacity?: number
          image_url?: string
          is_featured?: boolean
          category?: string
        }
      }
      gallery: {
        Row: {
          id: string
          created_at: string
          title?: string
          description?: string
          image_url: string
          category?: string
          is_featured: boolean
          display_order?: number
        }
        Insert: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url: string
          category?: string
          is_featured?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string
          category?: string
          is_featured?: boolean
          display_order?: number
        }
      }
      guest_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email?: string
          message: string
          is_public: boolean
          is_approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email?: string
          message: string
          is_public?: boolean
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          message?: string
          is_public?: boolean
          is_approved?: boolean
        }
      }
      weather_data: {
        Row: {
          id: string
          created_at: string
          date: string
          temperature_high: number
          temperature_low: number
          condition: string
          humidity: number
          wind_speed: number
          location: string
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          temperature_high: number
          temperature_low: number
          condition: string
          humidity: number
          wind_speed: number
          location: string
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          temperature_high?: number
          temperature_low?: number
          condition?: string
          humidity?: number
          wind_speed?: number
          location?: string
        }
      }
      food_options: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast'
          is_vegetarian: boolean
          is_vegan: boolean
          is_halal: boolean
          is_gluten_free: boolean
          allergens?: string[]
          image_url?: string
          available: boolean
          serving_time?: string
          price?: number
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast'
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_halal?: boolean
          is_gluten_free?: boolean
          allergens?: string[]
          image_url?: string
          available?: boolean
          serving_time?: string
          price?: number
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          category?: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast'
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_halal?: boolean
          is_gluten_free?: boolean
          allergens?: string[]
          image_url?: string
          available?: boolean
          serving_time?: string
          price?: number
          display_order?: number
        }
      }
      drink_options: {
        Row: {
          id: string
          created_at: string
          name: string
          description?: string
          category: 'soft_drink' | 'juice' | 'water' | 'beer' | 'wine' | 'spirits' | 'cocktail' | 'hot_beverage'
          is_alcoholic: boolean
          is_sugar_free: boolean
          brand?: string
          image_url?: string
          available: boolean
          serving_size?: string
          price?: number
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string
          category: 'soft_drink' | 'juice' | 'water' | 'beer' | 'wine' | 'spirits' | 'cocktail' | 'hot_beverage'
          is_alcoholic?: boolean
          is_sugar_free?: boolean
          brand?: string
          image_url?: string
          available?: boolean
          serving_size?: string
          price?: number
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          category?: 'soft_drink' | 'juice' | 'water' | 'beer' | 'wine' | 'spirits' | 'cocktail' | 'hot_beverage'
          is_alcoholic?: boolean
          is_sugar_free?: boolean
          brand?: string
          image_url?: string
          available?: boolean
          serving_size?: string
          price?: number
          display_order?: number
        }
      }
      attendance: {
        Row: {
          id: string
          created_at: string
          user_id?: string
          rsvp_id?: string
          check_in_time?: string
          check_out_time?: string
          attendance_status: 'expected' | 'checked_in' | 'checked_out' | 'no_show'
          table_number?: string
          seat_number?: string
          special_notes?: string
          qr_code?: string
          is_vip: boolean
          companion_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          rsvp_id?: string
          check_in_time?: string
          check_out_time?: string
          attendance_status?: 'expected' | 'checked_in' | 'checked_out' | 'no_show'
          table_number?: string
          seat_number?: string
          special_notes?: string
          qr_code?: string
          is_vip?: boolean
          companion_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          rsvp_id?: string
          check_in_time?: string
          check_out_time?: string
          attendance_status?: 'expected' | 'checked_in' | 'checked_out' | 'no_show'
          table_number?: string
          seat_number?: string
          special_notes?: string
          qr_code?: string
          is_vip?: boolean
          companion_count?: number
        }
      }
      user_food_selections: {
        Row: {
          id: string
          created_at: string
          user_id?: string
          food_option_id?: string
          attendance_id?: string
          quantity: number
          special_requests?: string
          confirmed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          food_option_id?: string
          attendance_id?: string
          quantity?: number
          special_requests?: string
          confirmed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          food_option_id?: string
          attendance_id?: string
          quantity?: number
          special_requests?: string
          confirmed?: boolean
        }
      }
      user_drink_selections: {
        Row: {
          id: string
          created_at: string
          user_id?: string
          drink_option_id?: string
          attendance_id?: string
          quantity: number
          special_requests?: string
          confirmed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          drink_option_id?: string
          attendance_id?: string
          quantity?: number
          special_requests?: string
          confirmed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          drink_option_id?: string
          attendance_id?: string
          quantity?: number
          special_requests?: string
          confirmed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rsvp_status: 'pending' | 'confirmed' | 'cancelled'
      activity_category: 'tour' | 'entertainment' | 'dining' | 'activities' | 'ceremony'
      food_category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast'
      drink_category: 'soft_drink' | 'juice' | 'water' | 'beer' | 'wine' | 'spirits' | 'cocktail' | 'hot_beverage'
      attendance_status: 'expected' | 'checked_in' | 'checked_out' | 'no_show'
      user_role: 'attendee' | 'admin' | 'staff'
    }
  }
}