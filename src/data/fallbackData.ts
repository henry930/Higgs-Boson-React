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
      number: "1",
      title: "Discovery & Strategy",
      description: "We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning and risk assessment.",
      order: 1,
      active: true
    },
    {
      id: 2, 
      number: "2",
      title: "AI-Accelerated Development",
      description: "Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment while ensuring quality standards.",
      order: 2,
      active: true
    },
    {
      id: 3,
      number: "3", 
      title: "Delivery & Evolution",
      description: "Expert project managers ensure seamless delivery and provide ongoing maintenance, updates, and feature enhancements.",
      order: 3,
      active: true
    }
  ] as ProcessStep[],

  testimonials: [
    {
      id: 1,
      quote: "Higgs Boson Consultancy transformed our development process completely. We delivered our major product launch 3 months ahead of schedule with 60% cost savings.",
      authorName: "Sarah Johnson",
      authorTitle: "CTO, TechFlow Solutions", 
      authorImage: "",
      order: 1,
      active: true,
      featured: true
    },
    {
      id: 2,
      quote: "The AI-powered development approach is revolutionary. Our team productivity increased by 75% while maintaining the highest quality standards.",
      authorName: "Michael Chen",
      authorTitle: "VP Engineering, DataVision Corp",
      authorImage: "",
      order: 2,
      active: true,
      featured: true
    },
    {
      id: 3,
      quote: "Working with Higgs Boson was a game-changer. They delivered enterprise-grade solutions that would have taken our team 12 months in just 3 months.",
      authorName: "Emily Rodriguez", 
      authorTitle: "Product Director, InnovateLab",
      authorImage: "",
      order: 3,
      active: true,
      featured: true
    }
  ] as Testimonial[],

  heroSlides: [
    {
      id: 1,
      title: "Revolutionize Your Software Development with AI",
      subtitle: "Accelerate delivery by 75% and reduce costs by 70% with our AI-powered development platform. Experience the future of software engineering today.",
      primaryButtonText: "Start Your Project",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Services", 
      secondaryButtonLink: "/services",
      backgroundClass: "aiDevelopment",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      order: 1,
      active: true
    },
    {
      id: 2,
      title: "Enterprise-Grade AI Solutions",
      subtitle: "Transform your business with cutting-edge AI technologies. From machine learning to automation, we deliver solutions that scale with your growth.", 
      primaryButtonText: "Get Started",
      primaryButtonLink: "/contact",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "/about",
      backgroundClass: "enterpriseSolutions",
      backgroundImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      order: 2,
      active: true
    },
    {
      id: 3,
      title: "Expert Teams, Proven Results",
      subtitle: "Work with seasoned AI researchers and developers who have delivered 100+ successful projects for companies ranging from startups to Fortune 500 enterprises.",
      primaryButtonText: "Schedule Consultation", 
      primaryButtonLink: "/contact",
      secondaryButtonText: "See Case Studies",
      secondaryButtonLink: "/services",
      backgroundClass: "expertTeams",
      backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      order: 3,
      active: true
    }
  ] as HeroSlide[]
};
