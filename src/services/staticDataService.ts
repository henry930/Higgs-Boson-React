// Static data service for front page content
// This replaces API calls with static JSON file fetching to reduce Lambda costs

export interface StaticDataResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

class StaticDataService {
  private baseUrl = '';  // Relative to public directory

  /**
   * Fetch data from static JSON files
   */
  private async fetchJson<T>(filename: string): Promise<StaticDataResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/data/${filename}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        status: 'success',
        data,
        message: 'Data loaded from static file'
      };
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      
      return {
        status: 'error',
        data: [] as unknown as T,
        message: `Failed to load ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get benefits data from static JSON
   */
  async getBenefits() {
    console.log('📄 StaticDataService: Loading benefits from static JSON');
    return this.fetchJson('benefits.json');
  }

  /**
   * Get process steps data from static JSON
   */
  async getProcessSteps() {
    console.log('📄 StaticDataService: Loading process steps from static JSON');
    return this.fetchJson('process-steps.json');
  }

  /**
   * Get testimonials data from static JSON
   */
  async getTestimonials() {
    console.log('📄 StaticDataService: Loading testimonials from static JSON');
    return this.fetchJson('testimonials.json');
  }

  /**
   * Get hero slides data from static JSON
   */
  async getHeroSlides() {
    console.log('📄 StaticDataService: Loading hero slides from static JSON');
    return this.fetchJson('hero-slides.json');
  }

  /**
   * Check if static mode should be used for front page data
   */
  isStaticMode(): boolean {
    // Always use static mode for front page content to save Lambda costs
    return true;
  }
}

// Create and export singleton instance
export const staticDataService = new StaticDataService();
