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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'worker' | 'employer'
          phone: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          skills: string[] | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'worker' | 'employer'
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          skills?: string[] | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'worker' | 'employer'
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          skills?: string[] | null
          rating?: number | null
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          location: string
          payment: number
          duration: number
          date: string
          status: 'open' | 'assigned' | 'completed'
          employer_id: string
          worker_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          location: string
          payment: number
          duration: number
          date: string
          status?: 'open' | 'assigned' | 'completed'
          employer_id: string
          worker_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          location?: string
          payment?: number
          duration?: number
          date?: string
          status?: 'open' | 'assigned' | 'completed'
          employer_id?: string
          worker_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
