export interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author_name: string;
  author_title: string;
  company: string;
  rating: number;
  order: number;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  background_class: string;
  order: number;
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
