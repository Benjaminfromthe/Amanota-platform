/**
 * Auto-generated Supabase database types.
 * Re-generate with: npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 * Hand-authored here to match the migration in supabase/migrations/001_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type FacultyType =
  | "Software Engineering"
  | "Networking"
  | "Information Management"
  | "Business"
  | "Theology"
  | "Nursing"
  | "Education";

export type CampusType = "masoro" | "gishushu";
export type UserRole = "student" | "tutor";
export type TierType = "recorded" | "online" | "campus" | "custom_location";
export type BookingStatus = "pending" | "upcoming" | "completed" | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          student_id: string;
          faculty: FacultyType;
          campus: CampusType;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          student_id?: string;
          faculty?: FacultyType;
          campus?: CampusType;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          student_id?: string;
          faculty?: FacultyType;
          campus?: CampusType;
          role?: UserRole;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          course_code: string;
          faculty: FacultyType;
          campus: string;
          description: string;
          video_url: string;
          thumbnail_url: string | null;
          duration: string | null;
          rating: number;
          review_count: number;
          tags: string[];
          price_recorded: number;
          price_online: number;
          price_campus: number;
          price_custom: number;
          creator_id: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          course_code: string;
          faculty: FacultyType;
          campus?: string;
          description?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          duration?: string | null;
          rating?: number;
          review_count?: number;
          tags?: string[];
          price_recorded?: number;
          price_online?: number;
          price_campus?: number;
          price_custom?: number;
          creator_id?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          course_code?: string;
          faculty?: FacultyType;
          campus?: string;
          description?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          duration?: string | null;
          rating?: number;
          review_count?: number;
          tags?: string[];
          price_recorded?: number;
          price_online?: number;
          price_campus?: number;
          price_custom?: number;
          creator_id?: string | null;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          lesson_id: string;
          student_id: string;
          tutor_id: string | null;
          tier_type: TierType;
          price_rwf: number;
          status: BookingStatus;
          scheduled_at: string | null;
          scheduled_time: string | null;
          location: string | null;
          payment_method: string | null;
          phone_number: string | null;
          tutor_cut_rwf: number;
          platform_cut_rwf: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          student_id: string;
          tutor_id?: string | null;
          tier_type: TierType;
          price_rwf: number;
          status?: BookingStatus;
          scheduled_at?: string | null;
          scheduled_time?: string | null;
          location?: string | null;
          payment_method?: string | null;
          phone_number?: string | null;
          tutor_cut_rwf?: number;
          platform_cut_rwf?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: BookingStatus;
          scheduled_at?: string | null;
          scheduled_time?: string | null;
          location?: string | null;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance_rwf: number;
          total_earned_rwf: number;
          total_spent_rwf: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance_rwf?: number;
          total_earned_rwf?: number;
          total_spent_rwf?: number;
        };
        Update: {
          balance_rwf?: number;
          total_earned_rwf?: number;
          total_spent_rwf?: number;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          booking_id: string | null;
          lesson_id: string | null;
          tutor_id: string | null;
          student_id: string | null;
          total_amount: number;
          tutor_cut: number;
          platform_cut: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          lesson_id?: string | null;
          tutor_id?: string | null;
          student_id?: string | null;
          total_amount: number;
          tutor_cut: number;
          platform_cut: number;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      campus_type: CampusType;
      user_role: UserRole;
      tier_type: TierType;
      booking_status: BookingStatus;
      faculty_type: FacultyType;
    };
  };
}
