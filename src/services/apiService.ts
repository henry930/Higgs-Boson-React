import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;
const STATIC_MODE = API_CONFIG.STATIC_MODE;

console.log('🔧 API_BASE_URL configured as:', API_BASE_URL);
console.log('🔧 STATIC_MODE:', STATIC_MODE);

// Import fallback data
import { fallbackData } from '../data/fallbackData';

// Add a connectivity test - only if not in static mode
const testConnectivity = async () => {
  if (STATIC_MODE) {
    console.log('📦 Running in static mode - using fallback data only');
    return false;
  }
  
  try {
    // Use a specific API endpoint instead of just /api/ to avoid CloudFront routing issues
    const response = await fetch(`${API_BASE_URL}/api/appointments/availability/?date=2024-01-01`, { 
      method: 'GET',
      mode: 'cors'
    });
    console.log('✅ Backend connectivity test passed:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error);
    console.error('Backend server might not be running or API endpoint not available');
    console.log('📦 Will use fallback data');
    return false;
  }
};

// Test connectivity on module load (only if not in static mode)
if (!STATIC_MODE) {
  testConnectivity();
}

export interface ApiResponse<T> {
  status?: 'success' | 'error';  // For fallback data
  success?: boolean;              // For Supabase API responses
  data?: T;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('API Request:', url);
      
      const response = await fetch(url, {
        headers: {
          // Only add Content-Type for non-GET requests
          ...(options.method && options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
          ...options.headers,
        },
        mode: 'cors', // Explicitly enable CORS
        // Removed credentials: 'include' to avoid CORS conflicts with wildcard origins
        ...options,
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Read as text to see what we actually got
        const responseText = await response.text();
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}...`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error'}`);
      }
      
      console.log('API Response Data:', data);
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Throw the error so try-catch blocks in calling methods can handle it
      throw error;
    }
  }

  // Benefits
  async getBenefits() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback benefits data');
      return {
        status: 'success' as const,
        data: fallbackData.benefits,
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/benefits/');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback benefits data');
      return {
        status: 'success' as const,
        data: fallbackData.benefits,
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createBenefit(benefit: any) {
    try {
      return this.request<any>('/api/benefits', {
        method: 'POST',
        body: JSON.stringify(benefit),
      });
    } catch (error) {
      console.log('📦 Create benefit failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateBenefit(id: number, benefit: any) {
    try {
      return this.request<any>(`/api/benefits/${id}`, {
        method: 'PUT',
        body: JSON.stringify(benefit),
      });
    } catch (error) {
      console.log('📦 Update benefit failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteBenefit(id: number) {
    try {
      return this.request<any>(`/api/benefits/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete benefit failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Process Steps
  async getProcessSteps() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback process steps data');
      return {
        status: 'success' as const,
        data: fallbackData.processSteps,
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/process-steps/');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback process steps data');
      return {
        status: 'success' as const,
        data: fallbackData.processSteps,
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createProcessStep(step: any) {
    try {
      return this.request<any>('/api/process-steps', {
        method: 'POST',
        body: JSON.stringify(step),
      });
    } catch (error) {
      console.log('📦 Create process step failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateProcessStep(id: number, step: any) {
    try {
      return this.request<any>(`/api/process-steps/${id}`, {
        method: 'PUT',
        body: JSON.stringify(step),
      });
    } catch (error) {
      console.log('📦 Update process step failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteProcessStep(id: number) {
    try {
      return this.request<any>(`/api/process-steps/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete process step failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Testimonials
  async getTestimonials() {
    console.log('📡 ApiService.getTestimonials called');
    
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback testimonials data');
      return {
        status: 'success' as const,
        data: fallbackData.testimonials,
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      console.log('📡 Attempting API call to /api/testimonials/');
      const result = await this.request<any[]>('/api/testimonials/');
      console.log('📡 API call successful, result:', result);
      
      // Standardize response format
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 API call failed, using fallback testimonials data');
      console.log('📦 Error was:', error);
      return {
        status: 'success' as const,
        data: fallbackData.testimonials,
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createTestimonial(testimonial: any) {
    try {
      return this.request<any>('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonial),
      });
    } catch (error) {
      console.log('📦 Create testimonial failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateTestimonial(id: number, testimonial: any) {
    try {
      return this.request<any>(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(testimonial),
      });
    } catch (error) {
      console.log('📦 Update testimonial failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteTestimonial(id: number) {
    try {
      return this.request<any>(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete testimonial failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Hero Slides
  async getHeroSlides() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback hero slides data');
      return {
        status: 'success' as const,
        data: fallbackData.heroSlides,
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/hero-slides/');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback hero slides data');
      return {
        status: 'success' as const,
        data: fallbackData.heroSlides,
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createHeroSlide(slide: any) {
    try {
      return this.request<any>('/api/hero-slides', {
        method: 'POST',
        body: JSON.stringify(slide),
      });
    } catch (error) {
      console.log('📦 Create hero slide failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateHeroSlide(id: number, slide: any) {
    try {
      return this.request<any>(`/api/hero-slides/${id}`, {
        method: 'PUT',
        body: JSON.stringify(slide),
      });
    } catch (error) {
      console.log('📦 Update hero slide failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteHeroSlide(id: number) {
    try {
      return this.request<any>(`/api/hero-slides/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete hero slide failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Team Members
  async getTeamMembers() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback team data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/team');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback team data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createTeamMember(member: any) {
    try {
      return this.request<any>('/api/team', {
        method: 'POST',
        body: JSON.stringify(member),
      });
    } catch (error) {
      console.log('📦 Create team member failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateTeamMember(id: number, member: any) {
    try {
      return this.request<any>(`/api/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(member),
      });
    } catch (error) {
      console.log('📦 Update team member failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteTeamMember(id: number) {
    try {
      return this.request<any>(`/api/team/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete team member failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Services
  async getServices() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback services data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/services/');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback services data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createService(service: any) {
    try {
      return this.request<any>('/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });
    } catch (error) {
      console.log('📦 Create service failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updateService(id: number, service: any) {
    try {
      return this.request<any>(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(service),
      });
    } catch (error) {
      console.log('📦 Update service failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deleteService(id: number) {
    try {
      return this.request<any>(`/api/services/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete service failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  // Pages
  async getPages() {
    if (STATIC_MODE) {
      console.log('📦 Static mode: Using fallback pages data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (static mode)'
      };
    }
    
    try {
      const result = await this.request<any[]>('/api/pages');
      return {
        status: 'success' as const,
        data: result,
        message: 'Data fetched successfully'
      };
    } catch (error) {
      console.log('📦 Using fallback pages data');
      return {
        status: 'success' as const,
        data: [],
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async getPageBySlug(slug: string) {
    console.log('📡 ApiService.getPageBySlug called with slug:', slug);
    
    if (STATIC_MODE) {
      console.log('📦 Static mode: Page not found');
      return {
        status: 'error' as const,
        message: 'Page not found (static mode)'
      };
    }
    
    try {
      const result = await this.request<any>(`/api/pages/slug/${encodeURIComponent(slug)}/`);
      console.log('📥 ApiService.getPageBySlug result:', result);
      return result;
    } catch (error) {
      console.log('📦 Page not found');
      return {
        status: 'error' as const,
        message: 'Page not found (backend unavailable)'
      };
    }
  }

  async createPage(page: any) {
    try {
      return this.request<any>('/api/pages', {
        method: 'POST',
        body: JSON.stringify(page),
      });
    } catch (error) {
      console.log('📦 Create page failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Create operation failed (backend unavailable)'
      };
    }
  }

  async updatePage(id: number, page: any) {
    try {
      return this.request<any>(`/api/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(page),
      });
    } catch (error) {
      console.log('📦 Update page failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Update operation failed (backend unavailable)'
      };
    }
  }

  async deletePage(id: number) {
    try {
      return this.request<any>(`/api/pages/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('📦 Delete page failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Delete operation failed (backend unavailable)'
      };
    }
  }

  async incrementPageViews(slug: string) {
    try {
      return this.request<any>(`/api/pages/slug/${encodeURIComponent(slug)}/views/`, {
        method: 'POST',
      });
    } catch (error) {
      console.log('📦 Increment page views failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Page views update failed (backend unavailable)'
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      return this.request<{ status: string; message: string }>('/health');
    } catch (error) {
      console.log('📦 Health check failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Health check failed (backend unavailable)'
      };
    }
  }

  // Job Applications
  async getJobPositions() {
    try {
      return await this.request<any[]>('/api/job-positions/');
    } catch (error) {
      console.log('📦 Using fallback job positions data');
      // Return fallback job positions if API is unavailable
      return {
        status: 'success' as const,
        data: [
          {
            id: 1,
            title: 'Senior AI Engineer',
            department: 'Engineering',
            location: 'Remote / London',
            type: 'Full-time',
            experience: '5+ years',
            description: 'Join our AI engineering team to build cutting-edge solutions that transform how businesses develop software.',
            requirements: [
              '5+ years of experience in AI/ML engineering',
              'Strong Python programming skills',
              'Experience with TensorFlow, PyTorch, or similar frameworks'
            ],
            benefits: [
              'Competitive salary + equity',
              'Remote-first culture',
              'Health & dental insurance'
            ]
          }
        ],
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async submitJobApplication(applicationData: FormData) {
    try {
      return this.request<any>('/api/job-applications/', {
        method: 'POST',
        body: applicationData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it
        } as any,
      });
    } catch (error) {
      console.log('📦 Submit job application failed - API unavailable');
      return {
        status: 'error' as const,
        message: 'Job application submission failed (backend unavailable)'
      };
    }
  }

  async getJobApplications() {
    return this.request<any[]>('/api/job-applications/');
  }
}

export const apiService = new ApiService();
export default apiService;
