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
    }
  }
}