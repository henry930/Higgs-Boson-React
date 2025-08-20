import type { Benefit, ProcessStep, Testimonial, HeroSlide } from '../types';

// Fallback data when API is not available
export const fallbackData = {
  benefits: [
    {
      id: 1,
      icon: "💰",
      title: "70% Cost Reduction", 
      description: "Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.",
      order: 1,
      active: true
    },
    {
      id: 2,
      icon: "⚡",
      title: "75% Faster Delivery",
      description: "Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.",
      order: 2, 
      active: true
    },
    {
      id: 3,
      icon: "👥", 
      title: "Lean Expert Teams",
      description: "Achieve superior results with smaller teams focused on strategy, management, and quality oversight.",
      order: 3,
      active: true
    },
    {
      id: 4,
      icon: "⭐",
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
