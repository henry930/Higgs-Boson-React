import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Benefits
  const benefits = [
    {
      icon: '💰',
      title: '70% Cost Reduction',
      description: 'Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.',
      order: 1,
      active: true
    },
    {
      icon: '⚡',
      title: '75% Faster Delivery',
      description: 'Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.',
      order: 2,
      active: true
    },
    {
      icon: '👥',
      title: 'Lean Expert Teams',
      description: 'Achieve superior results with smaller teams focused on strategy, management, and quality oversight.',
      order: 3,
      active: true
    },
    {
      icon: '⭐',
      title: 'Enterprise Quality',
      description: 'AI-assisted development with human expertise ensures exceptional quality and reliability.',
      order: 4,
      active: true
    }
  ];

  for (const benefit of benefits) {
    await prisma.benefit.upsert({
      where: { id: benefit.order },
      update: benefit,
      create: benefit
    });
  }

  // Seed Process Steps
  const processSteps = [
    {
      number: '1',
      title: 'Discovery & Strategy',
      description: 'We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning and risk assessment.',
      order: 1,
      active: true
    },
    {
      number: '2',
      title: 'AI-Accelerated Development',
      description: 'Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment while ensuring quality standards.',
      order: 2,
      active: true
    },
    {
      number: '3',
      title: 'Delivery & Evolution',
      description: 'Expert project managers ensure seamless delivery and provide ongoing maintenance, updates, and feature enhancements.',
      order: 3,
      active: true
    }
  ];

  for (const step of processSteps) {
    await prisma.processStep.upsert({
      where: { id: step.order },
      update: step,
      create: step
    });
  }

  // Seed Testimonials
  const testimonials = [
    {
      quote: 'Higgs Boson Consultancy transformed our development process completely. We delivered our major product launch 3 months ahead of schedule with 60% cost savings.',
      authorName: 'Sarah Johnson',
      authorTitle: 'CTO, TechFlow Solutions',
      authorImage: '',
      order: 1,
      active: true,
      featured: true
    },
    {
      quote: 'The AI-powered development approach is revolutionary. Our team productivity increased by 75% while maintaining the highest quality standards.',
      authorName: 'Michael Chen',
      authorTitle: 'VP Engineering, DataVision Corp',
      authorImage: '',
      order: 2,
      active: true,
      featured: true
    },
    {
      quote: 'Working with Higgs Boson was a game-changer. They delivered enterprise-grade solutions that would have taken our team 12 months in just 3 months.',
      authorName: 'Emily Rodriguez',
      authorTitle: 'Product Director, InnovateLab',
      authorImage: '',
      order: 3,
      active: true,
      featured: true
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.order },
      update: testimonial,
      create: testimonial
    });
  }

  // Seed Hero Slides
  const heroSlides = [
    {
      title: 'Revolutionize Your Software Development with AI',
      subtitle: 'Accelerate delivery by 75% and reduce costs by 70% with our AI-powered development platform. Experience the future of software engineering today.',
      primaryButtonText: 'Start Your Project',
      primaryButtonLink: '/contact',
      secondaryButtonText: 'View Services',
      secondaryButtonLink: '/services',
      backgroundClass: 'aiDevelopment',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      order: 1,
      active: true
    },
    {
      title: 'Enterprise-Grade AI Solutions',
      subtitle: 'Transform your business with cutting-edge AI technologies. From machine learning to automation, we deliver solutions that scale with your growth.',
      primaryButtonText: 'Get Started',
      primaryButtonLink: '/contact',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '/about',
      backgroundClass: 'enterpriseSolutions',
      backgroundImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      order: 2,
      active: true
    },
    {
      title: 'Expert Teams, Proven Results',
      subtitle: 'Work with seasoned AI researchers and developers who have delivered 100+ successful projects for companies ranging from startups to Fortune 500 enterprises.',
      primaryButtonText: 'Schedule Consultation',
      primaryButtonLink: '/contact',
      secondaryButtonText: 'See Case Studies',
      secondaryButtonLink: '/services',
      backgroundClass: 'expertTeams',
      backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      order: 3,
      active: true
    }
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: slide.order },
      update: slide,
      create: slide
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
