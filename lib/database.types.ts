export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// 多语言文本类型定义
export type I18nText = string | Record<string, string>

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          username: I18nText
          avatar_url: string | null
          bio: I18nText
          blueprints_created: number | null
          total_likes: number | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: I18nText
          avatar_url?: string | null
          bio?: I18nText
          blueprints_created?: number | null
          total_likes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: I18nText
          avatar_url?: string | null
          bio?: I18nText
          blueprints_created?: number | null
          total_likes?: number | null
          created_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          slug: string
          name: I18nText
          rarity: number
          element: I18nText
          role: string[] | null
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: I18nText
          rarity: number
          element: I18nText
          role?: string[] | null
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: I18nText
          rarity?: number
          element?: I18nText
          role?: string[] | null
          image_url?: string
          created_at?: string
        }
      }
      character_guides: {
        Row: {
          id: string
          character_id: string
          overview_text: I18nText
          skill_priority: Json | null
          equipment_recommendations: Json | null
          team_comps: Json | null
          author_id: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          character_id: string
          overview_text?: I18nText
          skill_priority?: Json | null
          equipment_recommendations?: Json | null
          team_comps?: Json | null
          author_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          overview_text?: I18nText
          skill_priority?: Json | null
          equipment_recommendations?: Json | null
          team_comps?: Json | null
          author_id?: string | null
          updated_at?: string
        }
      }
      blueprints: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          image_url: string
          code: string
          tags: string[] | null
          author_id: string
          likes: number | null
          downloads: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description?: I18nText
          image_url: string
          code: string
          tags?: string[] | null
          author_id: string
          likes?: number | null
          downloads?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          image_url?: string
          code?: string
          tags?: string[] | null
          author_id?: string
          likes?: number | null
          downloads?: number | null
          created_at?: string
        }
      }
      squads: {
        Row: {
          id: string
          title: I18nText
          description: I18nText
          author_id: string
          members: string[] | null
          likes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: I18nText
          description?: I18nText
          author_id: string
          members?: string[] | null
          likes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: I18nText
          description?: I18nText
          author_id?: string
          members?: string[] | null
          likes?: number | null
          created_at?: string
        }
      }
      blueprint_likes: {
        Row: {
          id: string
          user_id: string
          blueprint_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blueprint_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blueprint_id?: string
          created_at?: string
        }
      }
      saved_blueprints: {
        Row: {
          id: string
          user_id: string
          blueprint_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blueprint_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blueprint_id?: string
          created_at?: string
        }
      }
      squad_likes: {
        Row: {
          id: string
          user_id: string
          squad_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          squad_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          squad_id?: string
          created_at?: string
        }
      }
      saved_squads: {
        Row: {
          id: string
          user_id: string
          squad_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          squad_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          squad_id?: string
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