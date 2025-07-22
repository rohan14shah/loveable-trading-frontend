export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          sent_at: string | null
          stock_symbol: string | null
          title: string
          trade_signal_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          sent_at?: string | null
          stock_symbol?: string | null
          title: string
          trade_signal_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          sent_at?: string | null
          stock_symbol?: string | null
          title?: string
          trade_signal_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_trade_signal_id_fkey"
            columns: ["trade_signal_id"]
            isOneToOne: false
            referencedRelation: "trade_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          notifications_enabled: boolean | null
          push_notification_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notifications_enabled?: boolean | null
          push_notification_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notifications_enabled?: boolean | null
          push_notification_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_predictions: {
        Row: {
          confidence: number | null
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          id: string
          predicted_sentiment: Database["public"]["Enums"]["sentiment_label"]
          raw_analysis: Json | null
          reasoning_summary: string
          stock_symbol: string
          year: number
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          id?: string
          predicted_sentiment: Database["public"]["Enums"]["sentiment_label"]
          raw_analysis?: Json | null
          reasoning_summary: string
          stock_symbol: string
          year: number
        }
        Update: {
          confidence?: number | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          predicted_sentiment?: Database["public"]["Enums"]["sentiment_label"]
          raw_analysis?: Json | null
          reasoning_summary?: string
          stock_symbol?: string
          year?: number
        }
        Relationships: []
      }
      trade_signals: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          price: number | null
          signal_data: Json | null
          signal_name: string
          signal_type: Database["public"]["Enums"]["signal_type"]
          stock_symbol: string
          triggered_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          price?: number | null
          signal_data?: Json | null
          signal_name: string
          signal_type: Database["public"]["Enums"]["signal_type"]
          stock_symbol: string
          triggered_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          price?: number | null
          signal_data?: Json | null
          signal_name?: string
          signal_type?: Database["public"]["Enums"]["signal_type"]
          stock_symbol?: string
          triggered_at?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          added_at: string
          company_name: string | null
          id: string
          stock_symbol: string
          user_id: string
        }
        Insert: {
          added_at?: string
          company_name?: string | null
          id?: string
          stock_symbol: string
          user_id: string
        }
        Update: {
          added_at?: string
          company_name?: string | null
          id?: string
          stock_symbol?: string
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
      document_type: "10-K" | "earnings"
      notification_type: "trade_signal" | "price_alert" | "news_alert"
      sentiment_label: "positive" | "neutral" | "negative"
      signal_type: "buy" | "sell"
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
    Enums: {
      document_type: ["10-K", "earnings"],
      notification_type: ["trade_signal", "price_alert", "news_alert"],
      sentiment_label: ["positive", "neutral", "negative"],
      signal_type: ["buy", "sell"],
    },
  },
} as const
