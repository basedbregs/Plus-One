export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string | null
          id: string
          opening_id: string
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          opening_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          opening_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string
          category: Database["public"]["Enums"]["event_category"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          is_crowd_sourced: boolean | null
          location: unknown
          price_info: string | null
          source: Database["public"]["Enums"]["event_source"] | null
          source_url: string | null
          start_time: string
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          address: string
          category?: Database["public"]["Enums"]["event_category"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_crowd_sourced?: boolean | null
          location: unknown
          price_info?: string | null
          source?: Database["public"]["Enums"]["event_source"] | null
          source_url?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          address?: string
          category?: Database["public"]["Enums"]["event_category"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          is_crowd_sourced?: boolean | null
          location?: unknown
          price_info?: string | null
          source?: Database["public"]["Enums"]["event_source"] | null
          source_url?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          applicant_id: string
          created_at: string | null
          event_id: string
          id: string
          opening_id: string
          poster_id: string
          status: Database["public"]["Enums"]["match_status"] | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          event_id: string
          id?: string
          opening_id: string
          poster_id: string
          status?: Database["public"]["Enums"]["match_status"] | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          event_id?: string
          id?: string
          opening_id?: string
          poster_id?: string
          status?: Database["public"]["Enums"]["match_status"] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      openings: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: string
          expires_at: string | null
          id: string
          is_featured: boolean | null
          poster_id: string
          spots_available: number | null
          spots_filled: number | null
          status: Database["public"]["Enums"]["opening_status"] | null
          title: string
          type: Database["public"]["Enums"]["opening_type"] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          poster_id: string
          spots_available?: number | null
          spots_filled?: number | null
          status?: Database["public"]["Enums"]["opening_status"] | null
          title: string
          type?: Database["public"]["Enums"]["opening_type"] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          poster_id?: string
          spots_available?: number | null
          spots_filled?: number | null
          status?: Database["public"]["Enums"]["opening_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["opening_type"] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          id: string
          interests: string[] | null
          onboarding_complete: boolean | null
          phone_verified: boolean | null
          rating_avg: number | null
          rating_count: number | null
          university_email: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          id: string
          interests?: string[] | null
          onboarding_complete?: boolean | null
          phone_verified?: boolean | null
          rating_avg?: number | null
          rating_count?: number | null
          university_email?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          interests?: string[] | null
          onboarding_complete?: boolean | null
          phone_verified?: boolean | null
          rating_avg?: number | null
          rating_count?: number | null
          university_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          match_id: string
          rated_id: string
          rater_id: string
          score: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          match_id: string
          rated_id: string
          rater_id: string
          score: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          match_id?: string
          rated_id?: string
          rater_id?: string
          score?: number
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          category: string | null
          claimed_by: string | null
          created_at: string | null
          description: string | null
          hours: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          location: unknown
          name: string
          website: string | null
        }
        Insert: {
          address: string
          category?: string | null
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location: unknown
          name: string
          website?: string | null
        }
        Update: {
          address?: string
          category?: string | null
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          location?: unknown
          name?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      event_category: "music" | "sports" | "food" | "nightlife" | "festival" | "study" | "campus" | "arts" | "comedy" | "other"
      event_source: "manual" | "eventbrite" | "visitknoxville" | "facebook" | "utk_calendar" | "ticketmaster"
      event_status: "active" | "cancelled" | "past"
      match_status: "active" | "completed" | "cancelled"
      opening_status: "open" | "filled" | "cancelled" | "expired"
      opening_type: "spare_ticket" | "solo_plus_one" | "group_plus_one" | "wingman" | "tailgate_buddy" | "study_break" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Venue = Database['public']['Tables']['venues']['Row'];
export type Opening = Database['public']['Tables']['openings']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Rating = Database['public']['Tables']['ratings']['Row'];

export type EventCategory = Database['public']['Enums']['event_category'];
export type OpeningType = Database['public']['Enums']['opening_type'];
export type OpeningStatus = Database['public']['Enums']['opening_status'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type MatchStatus = Database['public']['Enums']['match_status'];

// Extended types with joins
export type EventWithVenue = Event & { venues: Venue | null };
export type OpeningWithEvent = Opening & { events: EventWithVenue; profiles: Profile };
export type ApplicationWithProfile = Application & { profiles: Profile };
export type MatchWithDetails = Match & { events: Event; profiles: Profile; opening: Opening };
