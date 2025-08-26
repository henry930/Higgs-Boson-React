const API_BASE_URL = 'http://localhost:8000';

console.log('🔧 API_BASE_URL configured as:', API_BASE_URL);

// Import fallback data
import { fallbackData } from '../data/fallbackData';

// Add a connectivity test
const testConnectivity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/`, { 
      method: 'GET',
      mode: 'cors'
    });
    console.log('✅ Backend connectivity test passed:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error);
    console.error('Backend server might not be running on http://localhost:8000');
    console.log('📦 Will use fallback data');
    return false;
  }
};

// Test connectivity on module load
let isBackendAvailable = true;
testConnectivity().then(result => {
  isBackendAvailable = result;
});

export interface ApiResponse<T> {
  status: 'success' | 'error';
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
        credentials: 'include', // Include cookies if needed
        ...options,
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Benefits
  async getBenefits() {
    try {
      return await this.request<any[]>('/api/benefits/');
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
    return this.request<any>('/api/benefits', {
      method: 'POST',
      body: JSON.stringify(benefit),
    });
  }

  async updateBenefit(id: number, benefit: any) {
    return this.request<any>(`/api/benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(benefit),
    });
  }

  async deleteBenefit(id: number) {
    return this.request<any>(`/api/benefits/${id}`, {
      method: 'DELETE',
    });
  }

  // Process Steps
  async getProcessSteps() {
    try {
      return await this.request<any[]>('/api/process-steps/');
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
    return this.request<any>('/api/process-steps', {
      method: 'POST',
      body: JSON.stringify(step),
    });
  }

  async updateProcessStep(id: number, step: any) {
    return this.request<any>(`/api/process-steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(step),
    });
  }

  async deleteProcessStep(id: number) {
    return this.request<any>(`/api/process-steps/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonials
  async getTestimonials() {
    try {
      return await this.request<any[]>('/api/testimonials/');
    } catch (error) {
      console.log('📦 Using fallback testimonials data');
      return {
        status: 'success' as const,
        data: fallbackData.testimonials,
        message: 'Using fallback data (backend unavailable)'
      };
    }
  }

  async createTestimonial(testimonial: any) {
    return this.request<any>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  async updateTestimonial(id: number, testimonial: any) {
    return this.request<any>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial),
    });
  }

  async deleteTestimonial(id: number) {
    return this.request<any>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Hero Slides
  async getHeroSlides() {
    try {
      return await this.request<any[]>('/api/hero-slides/');
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
    return this.request<any>('/api/hero-slides', {
      method: 'POST',
      body: JSON.stringify(slide),
    });
  }

  async updateHeroSlide(id: number, slide: any) {
    return this.request<any>(`/api/hero-slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slide),
    });
  }

  async deleteHeroSlide(id: number) {
    return this.request<any>(`/api/hero-slides/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Members
  async getTeamMembers() {
    return this.request<any[]>('/api/team');
  }

  async createTeamMember(member: any) {
    return this.request<any>('/api/team', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async updateTeamMember(id: number, member: any) {
    return this.request<any>(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  }

  async deleteTeamMember(id: number) {
    return this.request<any>(`/api/team/${id}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices() {
    return this.request<any[]>('/api/services/');
  }

  async createService(service: any) {
    return this.request<any>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async updateService(id: number, service: any) {
    return this.request<any>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  }

  async deleteService(id: number) {
    return this.request<any>(`/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Pages
  async getPages() {
    return this.request<any[]>('/api/pages');
  }

  async getPageBySlug(slug: string) {
    console.log('📡 ApiService.getPageBySlug called with slug:', slug);
    const result = await this.request<any>(`/api/pages/slug/${encodeURIComponent(slug)}/`);
    console.log('📥 ApiService.getPageBySlug result:', result);
    return result;
  }

  async createPage(page: any) {
    return this.request<any>('/api/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updatePage(id: number, page: any) {
    return this.request<any>(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  }

  async deletePage(id: number) {
    return this.request<any>(`/api/pages/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementPageViews(slug: string) {
    return this.request<any>(`/api/pages/slug/${encodeURIComponent(slug)}/views/`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
