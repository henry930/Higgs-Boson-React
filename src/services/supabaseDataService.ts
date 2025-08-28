import { supabase } from '../lib/supabase'
import type { Page } from '../lib/supabase'

export const dataService = {
  // Fetch all published pages
  async getPages(): Promise<Page[]> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pages:', error)
      return []
    }
  },

  // Fetch a specific page by slug
  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching page ${slug}:`, error)
      return null
    }
  },

  // Submit contact form
  async submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData])

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  },

  // Get home page data (for backwards compatibility)
  async getHomeData(): Promise<any> {
    try {
      const homePage = await this.getPageBySlug('home')
      if (homePage && homePage.content) {
        return JSON.parse(homePage.content)
      }
      
      // Fallback to default data if no home page in database
      return {
        hero: {
          title: "Higgs Boson Consultancy",
          subtitle: "Expert consulting services for modern businesses",
          description: "We provide cutting-edge solutions and strategic insights to help your business thrive in today's competitive landscape."
        },
        benefits: [
          {
            title: "Expert Consultation",
            description: "Get professional advice from industry experts"
          },
          {
            title: "Custom Solutions",
            description: "Tailored strategies for your specific needs"
          },
          {
            title: "Proven Results",
            description: "Track record of successful implementations"
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
      // Return fallback data on error
      return {
        hero: {
          title: "Higgs Boson Consultancy",
          subtitle: "Expert consulting services",
        },
        benefits: []
      }
    }
  },

  // AI Chat Session Management
  async createChatSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .insert([{ session_id: sessionId }])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error creating chat session:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  },

  async updateChatSession(sessionId: string, updates: {
    customer_name?: string
    customer_email?: string
    customer_phone?: string
    customer_company?: string
    project_requirements?: string
    estimated_quote?: number
    status?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ai_chat_sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating chat session:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  },

  async saveChatMessage(sessionId: string, speaker: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('ai_chat_messages')
        .insert([{
          session_id: sessionId,
          speaker,
          message,
          timestamp: new Date().toISOString()
        }])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error saving chat message:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  },

  async getChatSession(sessionId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching chat session:', error)
      return null
    }
  },

  async getChatMessages(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      return []
    }
  }
}
