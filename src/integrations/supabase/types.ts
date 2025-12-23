export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_user_message: boolean
          message_text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_user_message: boolean
          message_text: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_user_message?: boolean
          message_text?: string
          user_id?: string
        }
        Relationships: []
      }
      physical_test_results: {
        Row: {
          age: number
          created_at: string
          flexibility_score: number | null
          height: number
          id: string
          level: string
          overall_score: number
          pushups: number
          recommendations: string[] | null
          running_time: number
          situps: number
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          age: number
          created_at?: string
          flexibility_score?: number | null
          height: number
          id?: string
          level: string
          overall_score: number
          pushups: number
          recommendations?: string[] | null
          running_time: number
          situps: number
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          age?: number
          created_at?: string
          flexibility_score?: number | null
          height?: number
          id?: string
          level?: string
          overall_score?: number
          pushups?: number
          recommendations?: string[] | null
          running_time?: number
          situps?: number
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          completed_onboarding: boolean | null
          created_at: string | null
          id: string
          selected_avatar: number | null
          selected_ideas: string[] | null
          updated_at: string | null
          username: string
        }
        Insert: {
          completed_onboarding?: boolean | null
          created_at?: string | null
          id: string
          selected_avatar?: number | null
          selected_ideas?: string[] | null
          updated_at?: string | null
          username: string
        }
        Update: {
          completed_onboarding?: boolean | null
          created_at?: string | null
          id?: string
          selected_avatar?: number | null
          selected_ideas?: string[] | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      star_map_nodes: {
        Row: {
          category: string
          connections: string[]
          created_at: string
          description: string
          description_en: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          name_en: string
          position_x: number
          position_y: number
          requirements: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          connections?: string[]
          created_at?: string
          description: string
          description_en: string
          display_order?: number
          id: string
          is_active?: boolean
          name: string
          name_en: string
          position_x: number
          position_y: number
          requirements?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          connections?: string[]
          created_at?: string
          description?: string
          description_en?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          name_en?: string
          position_x?: number
          position_y?: number
          requirements?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      star_map_progress: {
        Row: {
          category: string
          created_at: string
          id: string
          mastered_at: string | null
          node_id: string
          progress_score: number
          status: string
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          mastered_at?: string | null
          node_id: string
          progress_score?: number
          status?: string
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          mastered_at?: string | null
          node_id?: string
          progress_score?: number
          status?: string
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      talent_test_results: {
        Row: {
          created_at: string
          execution_score: number
          harmony_score: number
          id: string
          innovation_score: number
          leadership_score: number
          primary_talent: string
          recommendations: string[] | null
          strengths: string[] | null
          talent_description: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          execution_score?: number
          harmony_score?: number
          id?: string
          innovation_score?: number
          leadership_score?: number
          primary_talent: string
          recommendations?: string[] | null
          strengths?: string[] | null
          talent_description?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          execution_score?: number
          harmony_score?: number
          id?: string
          innovation_score?: number
          leadership_score?: number
          primary_talent?: string
          recommendations?: string[] | null
          strengths?: string[] | null
          talent_description?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          breakdown_status: string | null
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          is_ai_generated: boolean
          parent_task_id: string | null
          progress_completed: number | null
          progress_total: number | null
          star_map_node_id: string | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          breakdown_status?: string | null
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          parent_task_id?: string | null
          progress_completed?: number | null
          progress_total?: number | null
          star_map_node_id?: string | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          breakdown_status?: string | null
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          parent_task_id?: string | null
          progress_completed?: number | null
          progress_total?: number | null
          star_map_node_id?: string | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
