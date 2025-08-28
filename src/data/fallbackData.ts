import type { Benefit, ProcessStep, Testimonial, HeroSlide } from '../types';

// Fallback data when API is not available
export const fallbackData = {
  benefits: [
    {
      id: 1,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
      </svg>`,
      title: "70% Cost Reduction", 
      description: "Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.",
      order: 1,
      active: true
    },
    {
      id: 2,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>`,
      title: "75% Faster Delivery",
      description: "Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.",
      order: 2, 
      active: true
    },
    {
      id: 3,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.31-1.74-2.46-1.74s-2.12.72-2.46 1.74L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.28-.22-.5-.5-.5S8 9.22 8 9.5V15H6.5v7h3zM12 13.5c-.28 0-.5.22-.5.5v8h3v-8c0-.28-.22-.5-.5-.5z"/>
      </svg>`, 
      title: "Lean Expert Teams",
      description: "Achieve superior results with smaller teams focused on strategy, management, and quality oversight.",
      order: 3,
      active: true
    },
    {
      id: 4,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>`,
      title: "Enterprise Quality", 
      description: "AI-assisted development with human expertise ensures exceptional quality and reliability.",
      order: 4,
      active: true
    }
  ] as Benefit[],

  processSteps: [
    {
      id: 1,
      number: 1,
      title: "Discovery & Strategy",
      description: "We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning and risk assessment.",
      order: 1,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2, 
      number: 2,
      title: "AI-Accelerated Development",
      description: "Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment while ensuring quality standards.",
      order: 2,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      number: 3, 
      title: "Delivery & Evolution",
      description: "Expert project managers ensure seamless delivery and provide ongoing maintenance, updates, and feature enhancements.",
      order: 3,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as ProcessStep[],

  testimonials: [
    {
      id: 1,
      quote: "Higgs Boson Consultancy transformed our development process completely. We delivered our major product launch 3 months ahead of schedule with 60% cost savings.",
      author_name: "Sarah Johnson",
      author_title: "CTO", 
      company: "TechFlow Solutions",
      rating: 5,
      order: 1,
      active: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      quote: "The AI-powered development approach is revolutionary. Our team productivity increased by 75% while maintaining the highest quality standards.",
      author_name: "Michael Chen",
      author_title: "VP Engineering",
      company: "DataVision Corp",
      rating: 5,
      order: 2,
      active: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      quote: "Working with Higgs Boson was a game-changer. They delivered enterprise-grade solutions that would have taken our team 12 months in just 3 months.",
      author_name: "Emily Rodriguez", 
      author_title: "Product Director",
      company: "InnovateLab",
      rating: 5,
      order: 3,
      active: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as Testimonial[],

  heroSlides: [
    {
      id: 1,
      title: "Revolutionize Your Software Development with AI",
      subtitle: "Accelerate delivery by 75% and reduce costs by 70% with our AI-powered development platform. Experience the future of software engineering today.",
      primary_button_text: "Start Your Project",
      primary_button_link: "/contact",
      secondary_button_text: "View Services", 
      secondary_button_link: "/services",
      background_class: "aiDevelopment",
      order: 1,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Enterprise-Grade AI Solutions",
      subtitle: "Transform your business with cutting-edge AI technologies. From machine learning to automation, we deliver solutions that scale with your growth.", 
      primary_button_text: "Get Started",
      primary_button_link: "/contact",
      secondary_button_text: "Learn More",
      secondary_button_link: "/about",
      background_class: "enterpriseSolutions",
      order: 2,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Expert Teams, Proven Results",
      subtitle: "Work with seasoned AI researchers and developers who have delivered 100+ successful projects for companies ranging from startups to Fortune 500 enterprises.",
      primary_button_text: "Schedule Consultation", 
      primary_button_link: "/contact",
      secondary_button_text: "See Case Studies",
      secondary_button_link: "/services",
      background_class: "expertTeams",
      order: 3,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as HeroSlide[]
};
