export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  step_number: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  background_image: string;
  primary_button_text: string;
  primary_button_action: string;
  secondary_button_text: string;
  secondary_button_link: string;
  stats: string;
  slide_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string | null;
  meta_description?: string | null;
  published: boolean;
  featured: boolean;
  author_name?: string | null;
  cover_image?: string | null;
  excerpt?: string | null;
  tags?: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}
