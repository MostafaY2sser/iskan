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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          contact_info: string | null
          id: number
          name: string
        }
        Insert: {
          contact_info?: string | null
          id?: number
          name: string
        }
        Update: {
          contact_info?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      booking_agents: {
        Row: {
          agent_id: number
          assigned_at: string | null
          booking_id: number
          id: number
        }
        Insert: {
          agent_id: number
          assigned_at?: string | null
          booking_id: number
          id?: number
        }
        Update: {
          agent_id?: number
          assigned_at?: string | null
          booking_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_agents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          bed_count: number
          created_at: string | null
          customer_id: string
          end_date: string
          id: number
          residence_id: number
          start_date: string
          status: string | null
        }
        Insert: {
          bed_count: number
          created_at?: string | null
          customer_id: string
          end_date: string
          id?: number
          residence_id: number
          start_date: string
          status?: string | null
        }
        Update: {
          bed_count?: number
          created_at?: string | null
          customer_id?: string
          end_date?: string
          id?: number
          residence_id?: number
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_residence_id_fkey"
            columns: ["residence_id"]
            isOneToOne: false
            referencedRelation: "residences"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          booking_id: number
          commission_rate: number | null
          created_at: string | null
          end_date: string
          final_price: number | null
          id: number
          photo_id: number | null
          start_date: string
        }
        Insert: {
          booking_id: number
          commission_rate?: number | null
          created_at?: string | null
          end_date: string
          final_price?: number | null
          id?: number
          photo_id?: number | null
          start_date: string
        }
        Update: {
          booking_id?: number
          commission_rate?: number | null
          created_at?: string | null
          end_date?: string
          final_price?: number | null
          id?: number
          photo_id?: number | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_details: {
        Row: {
          approx_employee_count: number | null
          business_activity: string | null
          company_name: string | null
          created_at: string | null
          favorite_area: string | null
          first_phone_number: string | null
          registration_number: string | null
          responsible_person: string | null
          responsible_position: string | null
          second_phone_number: string | null
          second_responsible_person: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approx_employee_count?: number | null
          business_activity?: string | null
          company_name?: string | null
          created_at?: string | null
          favorite_area?: string | null
          first_phone_number?: string | null
          registration_number?: string | null
          responsible_person?: string | null
          responsible_position?: string | null
          second_phone_number?: string | null
          second_responsible_person?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approx_employee_count?: number | null
          business_activity?: string | null
          company_name?: string | null
          created_at?: string | null
          favorite_area?: string | null
          first_phone_number?: string | null
          registration_number?: string | null
          responsible_person?: string | null
          responsible_position?: string | null
          second_phone_number?: string | null
          second_responsible_person?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          doc_type: string | null
          document_tag: string | null
          expiry_date: string | null
          id: number
          photo_id: number | null
          residence_id: number | null
          status: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          doc_type?: string | null
          document_tag?: string | null
          expiry_date?: string | null
          id?: number
          photo_id?: number | null
          residence_id?: number | null
          status?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          doc_type?: string | null
          document_tag?: string | null
          expiry_date?: string | null
          id?: number
          photo_id?: number | null
          residence_id?: number | null
          status?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_residence_id_fkey"
            columns: ["residence_id"]
            isOneToOne: false
            referencedRelation: "residences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          link: string | null
          message: string
          read_status: boolean | null
          status_history_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          link?: string | null
          message: string
          read_status?: boolean | null
          status_history_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          link?: string | null
          message?: string
          read_status?: boolean | null
          status_history_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_status_history_id_fkey"
            columns: ["status_history_id"]
            isOneToOne: false
            referencedRelation: "status_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_details: {
        Row: {
          address: string | null
          business_activity: string
          city: string | null
          created_at: string | null
          phone_number: string
          region: string | null
          registration_number: string
          updated_at: string | null
          user_id: string
          val_license_number: string
        }
        Insert: {
          address?: string | null
          business_activity: string
          city?: string | null
          created_at?: string | null
          phone_number: string
          region?: string | null
          registration_number: string
          updated_at?: string | null
          user_id: string
          val_license_number: string
        }
        Update: {
          address?: string | null
          business_activity?: string
          city?: string | null
          created_at?: string | null
          phone_number?: string
          region?: string | null
          registration_number?: string
          updated_at?: string | null
          user_id?: string
          val_license_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "owner_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          residence_id: number
          score: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          residence_id: number
          score: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          residence_id?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_residence_id_fkey"
            columns: ["residence_id"]
            isOneToOne: false
            referencedRelation: "residences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      residence_company_details: {
        Row: {
          address: string | null
          business_activity: string
          city: string | null
          company_name: string
          created_at: string | null
          phone_number: string
          region: string | null
          registration_number: string
          responsible_person: string
          updated_at: string | null
          user_id: string
          val_license_number: string
        }
        Insert: {
          address?: string | null
          business_activity: string
          city?: string | null
          company_name: string
          created_at?: string | null
          phone_number: string
          region?: string | null
          registration_number: string
          responsible_person: string
          updated_at?: string | null
          user_id: string
          val_license_number: string
        }
        Update: {
          address?: string | null
          business_activity?: string
          city?: string | null
          company_name?: string
          created_at?: string | null
          phone_number?: string
          region?: string | null
          registration_number?: string
          responsible_person?: string
          updated_at?: string | null
          user_id?: string
          val_license_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "residence_company_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      residence_services: {
        Row: {
          created_at: string | null
          extra_cost: number | null
          id: number
          residence_id: number
          service_id: number
          service_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          extra_cost?: number | null
          id?: number
          residence_id: number
          service_id: number
          service_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          extra_cost?: number | null
          id?: number
          residence_id?: number
          service_id?: number
          service_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residence_services_residence_id_fkey"
            columns: ["residence_id"]
            isOneToOne: false
            referencedRelation: "residences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residence_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      residences: {
        Row: {
          amenities: string | null
          bed_count: number
          building_year: number
          created_at: string | null
          description: string | null
          id: number
          location: string
          name: string
          path_room_count: number
          photo_id: number | null
          price_per_bed: number
          residence_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          amenities?: string | null
          bed_count: number
          building_year: number
          created_at?: string | null
          description?: string | null
          id?: number
          location: string
          name: string
          path_room_count: number
          photo_id?: number | null
          price_per_bed: number
          residence_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          amenities?: string | null
          bed_count?: number
          building_year?: number
          created_at?: string | null
          description?: string | null
          id?: number
          location?: string
          name?: string
          path_room_count?: number
          photo_id?: number | null
          price_per_bed?: number
          residence_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "residences_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      special_requests: {
        Row: {
          bed_count: number
          created_at: string | null
          customer_id: string
          id: number
          preferred_area1: string | null
          preferred_area2: string | null
          preferred_area3: string | null
          services_required: string | null
          special_requirements: string | null
          status: string | null
        }
        Insert: {
          bed_count: number
          created_at?: string | null
          customer_id: string
          id?: number
          preferred_area1?: string | null
          preferred_area2?: string | null
          preferred_area3?: string | null
          services_required?: string | null
          special_requirements?: string | null
          status?: string | null
        }
        Update: {
          bed_count?: number
          created_at?: string | null
          customer_id?: string
          id?: number
          preferred_area1?: string | null
          preferred_area2?: string | null
          preferred_area3?: string | null
          services_required?: string | null
          special_requirements?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "special_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          entity_id: number
          entity_type: string
          id: number
          new_status: string | null
          old_status: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          entity_id: number
          entity_type: string
          id?: number
          new_status?: string | null
          old_status?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          entity_id?: number
          entity_type?: string
          id?: number
          new_status?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          entity_id: number
          entity_type: string
          file_path: string
          id: number
          uploaded_at: string | null
        }
        Insert: {
          entity_id: number
          entity_type: string
          file_path: string
          id?: number
          uploaded_at?: string | null
        }
        Update: {
          entity_id?: number
          entity_type?: string
          file_path?: string
          id?: number
          uploaded_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          status: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_contract_or_admin: {
        Args: { contract_id: number }
        Returns: boolean
      }
      get_my_user_type: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_document_owner_or_admin: {
        Args: { doc_id: number }
        Returns: boolean
      }
      is_residence_owner_or_admin: {
        Args: { res_id: number }
        Returns: boolean
      }
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
