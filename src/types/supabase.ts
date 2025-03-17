
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
          name: string
          email: string
          role: string
          avatar?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          avatar?: string | null
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          date: string
          start_time: string
          end_time: string
          teacher_id: string
          student_id: string
          status: string
          attendance_confirmed: boolean
          teacher_attendance_confirmed?: boolean | null
          payment_status: string
          payment_confirmed_by_teacher?: boolean | null
          notes?: string | null
          cancelled_by?: string | null
          cancel_reason?: string | null
          reschedule_date?: string | null
          makeup_session_id?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          start_time: string
          end_time: string
          teacher_id: string
          student_id: string
          status: string
          attendance_confirmed?: boolean
          teacher_attendance_confirmed?: boolean | null
          payment_status?: string
          payment_confirmed_by_teacher?: boolean | null
          notes?: string | null
          cancelled_by?: string | null
          cancel_reason?: string | null
          reschedule_date?: string | null
          makeup_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          start_time?: string
          end_time?: string
          teacher_id?: string
          student_id?: string
          status?: string
          attendance_confirmed?: boolean
          teacher_attendance_confirmed?: boolean | null
          payment_status?: string
          payment_confirmed_by_teacher?: boolean | null
          notes?: string | null
          cancelled_by?: string | null
          cancel_reason?: string | null
          reschedule_date?: string | null
          makeup_session_id?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          session_id: string
          date: string
          amount: number
          method: string
          proof_image_url?: string | null
          notes?: string | null
          admin_fee: number
          teacher_fee: number
          confirmed_by_teacher?: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          date: string
          amount: number
          method: string
          proof_image_url?: string | null
          notes?: string | null
          admin_fee: number
          teacher_fee: number
          confirmed_by_teacher?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          date?: string
          amount?: number
          method?: string
          proof_image_url?: string | null
          notes?: string | null
          admin_fee?: number
          teacher_fee?: number
          confirmed_by_teacher?: boolean | null
          created_at?: string
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
      [_ in never]: never
    }
  }
}
