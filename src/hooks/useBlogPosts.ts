import { useState, useEffect } from 'react'
import { supabase, BlogPost, CreateBlogPost, UpdateBlogPost } from '@/lib/supabase'
import { toast } from 'sonner'

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      toast.error('Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  // Create a new blog post
  const createPost = async (postData: CreateBlogPost): Promise<BlogPost | null> => {
    try {
      // Generate slug if not provided
      if (!postData.slug) {
        postData.slug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      // Prepare the data for insertion
      const insertData = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || null,
        content: postData.content || null,
        featured_image: postData.featured_image || null,
        meta_title: postData.meta_title || null,
        meta_description: postData.meta_description || null,
        tags: postData.tags || [],
        category: postData.category || 'general',
        status: postData.status || 'draft',
        published_at: postData.status === 'published' ? new Date().toISOString() : null,
        author_id: null // Let the database handle this with uid()
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      setPosts(prev => [data, ...prev])
      toast.success('Blog post created successfully!')
      return data
    } catch (err) {
      console.error('Create post error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }

  // Update a blog post
  const updatePost = async (id: string, updates: UpdateBlogPost): Promise<BlogPost | null> => {
    try {
      // Set published_at when changing status to published
      const updateData = { ...updates }
      if (updates.status === 'published') {
        const currentPost = posts.find(p => p.id === id)
        if (currentPost && !currentPost.published_at) {
          updateData.published_at = new Date().toISOString()
        }
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      setPosts(prev => prev.map(post => post.id === id ? data : post))
      toast.success('Blog post updated successfully!')
      return data
    } catch (err) {
      console.error('Update post error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }

  // Delete a blog post
  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        throw error
      }

      setPosts(prev => prev.filter(post => post.id !== id))
      toast.success('Blog post deleted successfully!')
      return true
    } catch (err) {
      console.error('Delete post error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }

  // Get published posts for public blog page
  const getPublishedPosts = async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Get published posts error:', error)
        throw error
      }
      return data || []
    } catch (err) {
      console.error('Failed to fetch published posts:', err)
      return []
    }
  }

  // Get post by slug for public viewing
  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        console.error('Get post by slug error:', error)
        throw error
      }

      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ view_count: data.view_count + 1 })
        .eq('id', data.id)

      return data
    } catch (err) {
      console.error('Failed to fetch post by slug:', err)
      return null
    }
  }

  // Subscribe to real-time changes
  useEffect(() => {
    fetchPosts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          console.log('Real-time update:', payload)
          fetchPosts() // Refetch all posts on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPublishedPosts,
    getPostBySlug,
    refetch: fetchPosts
  }
}