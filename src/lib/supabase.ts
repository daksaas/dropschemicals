import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Types for our blog posts
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  tags: string[]
  category: string
  status: 'draft' | 'published' | 'archived'
  author_id: string
  published_at?: string
  created_at: string
  updated_at: string
  view_count: number
}

export interface CreateBlogPost {
  title: string
  slug?: string
  excerpt?: string
  content?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
  category?: string
  status?: 'draft' | 'published'
}

export interface UpdateBlogPost {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  featured_image?: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
  category?: string
  status?: 'draft' | 'published' | 'archived'
  published_at?: string
}