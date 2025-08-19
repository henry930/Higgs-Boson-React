export interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProcessStep {
  id: number;
  number: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage?: string | null;
  order: number;
  active: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundClass: string;
  backgroundImage: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
