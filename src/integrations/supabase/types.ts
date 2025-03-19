export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      payments: {
        Row: {
          admin_fee: number
          amount: number
          confirmed_by_teacher: boolean | null
          created_at: string
          date: string
          id: string
          method: string
          notes: string | null
          proof_image_url: string | null
          session_id: string
          teacher_fee: number
        }
        Insert: {
          admin_fee?: number
          amount: number
          confirmed_by_teacher?: boolean | null
          created_at?: string
          date: string
          id?: string
          method: string
          notes?: string | null
          proof_image_url?: string | null
          session_id: string
          teacher_fee?: number
        }
        Update: {
          admin_fee?: number
          amount?: number
          confirmed_by_teacher?: boolean | null
          created_at?: string
          date?: string
          id?: string
          method?: string
          notes?: string | null
          proof_image_url?: string | null
          session_id?: string
          teacher_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          attendance_confirmed: boolean
          cancel_reason: string | null
          cancelled_by: string | null
          created_at: string
          date: string
          end_time: string
          id: string
          makeup_session_id: string | null
          notes: string | null
          payment_confirmed_by_teacher: boolean | null
          payment_status: string
          reschedule_date: string | null
          start_time: string
          status: string
          student_id: string
          teacher_attendance_confirmed: boolean | null
          teacher_id: string
        }
        Insert: {
          attendance_confirmed?: boolean
          cancel_reason?: string | null
          cancelled_by?: string | null
          created_at?: string
          date: string
          end_time: string
          id?: string
          makeup_session_id?: string | null
          notes?: string | null
          payment_confirmed_by_teacher?: boolean | null
          payment_status?: string
          reschedule_date?: string | null
          start_time: string
          status?: string
          student_id: string
          teacher_attendance_confirmed?: boolean | null
          teacher_id: string
        }
        Update: {
          attendance_confirmed?: boolean
          cancel_reason?: string | null
          cancelled_by?: string | null
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          makeup_session_id?: string | null
          notes?: string | null
          payment_confirmed_by_teacher?: boolean | null
          payment_status?: string
          reschedule_date?: string | null
          start_time?: string
          status?: string
          student_id?: string
          teacher_attendance_confirmed?: boolean | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_makeup_session_id_fkey"
            columns: ["makeup_session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
