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
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          progress_completed: number | null
          progress_total: number | null
          star_map_node_id: string | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_completed?: number | null
          progress_total?: number | null
          star_map_node_id?: string | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_completed?: number | null
          progress_total?: number | null
          star_map_node_id?: string | null
          text?: string
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
