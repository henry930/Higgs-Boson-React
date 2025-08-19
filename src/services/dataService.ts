import type { Benefit, ProcessStep, Testimonial, HeroSlide, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    
    // Return empty data instead of completely failing
    return {
      status: 'error',
      data: [] as unknown as T,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

class DataService {
  // Benefits
  async getBenefits(): Promise<ApiResponse<Benefit[]>> {
    return apiRequest<Benefit[]>('/benefits');
  }

  async createBenefit(benefit: Omit<Benefit, 'id'>): Promise<ApiResponse<Benefit>> {
    return apiRequest<Benefit>('/benefits', {
      method: 'POST',
      body: JSON.stringify(benefit),
    });
  }

  async updateBenefit(id: number, benefit: Partial<Benefit>): Promise<ApiResponse<Benefit>> {
    return apiRequest<Benefit>(`/benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(benefit),
    });
  }

  async deleteBenefit(id: number): Promise<ApiResponse<boolean>> {
    const result = await apiRequest<void>(`/benefits/${id}`, {
      method: 'DELETE',
    });
    return {
      ...result,
      data: result.status === 'success'
    };
  }

  // Process Steps
  async getProcessSteps(): Promise<ApiResponse<ProcessStep[]>> {
    return apiRequest<ProcessStep[]>('/process-steps');
  }

  async createProcessStep(processStep: Omit<ProcessStep, 'id'>): Promise<ApiResponse<ProcessStep>> {
    return apiRequest<ProcessStep>('/process-steps', {
      method: 'POST',
      body: JSON.stringify(processStep),
    });
  }

  // Testimonials
  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return apiRequest<Testimonial[]>('/testimonials');
  }

  async getFeaturedTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return apiRequest<Testimonial[]>('/testimonials/featured');
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<ApiResponse<Testimonial>> {
    return apiRequest<Testimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  // Hero Slides
  async getHeroSlides(): Promise<ApiResponse<HeroSlide[]>> {
    return apiRequest<HeroSlide[]>('/hero-slides');
  }

  async createHeroSlide(heroSlide: Omit<HeroSlide, 'id'>): Promise<ApiResponse<HeroSlide>> {
    return apiRequest<HeroSlide>('/hero-slides', {
      method: 'POST',
      body: JSON.stringify(heroSlide),
    });
  }

  // No longer needed for API-based service
  async disconnect(): Promise<void> {
    // No-op for API-based service
  }
}

export const dataService = new DataService();
export default dataService;
