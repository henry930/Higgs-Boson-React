#!/usr/bin/env python3
"""
Simple script to insert homepage data directly into Supabase
"""

import os
import sys
sys.path.append('/Users/navcolon/Documents/higgsbosonconsultancy2/React/server')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

from api.supabase_service import supabase_service

def insert_sample_data():
    """Insert sample data directly using Supabase client"""
    
    print("🚀 Inserting sample homepage data...")
    
    # Benefits data
    benefits_data = [
        {
            'title': 'AI-Powered Development',
            'description': 'Leverage cutting-edge AI technology to accelerate development and improve code quality.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>'
        },
        {
            'title': 'Cost Effective',
            'description': 'Reduce development costs by up to 70% while maintaining enterprise-grade quality.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>'
        },
        {
            'title': 'Faster Time to Market',
            'description': 'Launch your products 75% faster with our streamlined development process.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
        },
        {
            'title': '24/7 Support',
            'description': 'Round-the-clock support and monitoring to ensure your applications run smoothly.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path></svg>'
        }
    ]
    
    # Try to insert benefits
    for benefit in benefits_data:
        try:
            result = supabase_service.supabase.table('benefits').insert(benefit).execute()
            print(f"✅ Inserted benefit: {benefit['title']}")
        except Exception as e:
            print(f"❌ Error inserting benefit: {e}")
    
    # Process steps data
    process_steps_data = [
        {
            'title': 'Discovery & Planning',
            'description': 'We analyze your requirements and create a comprehensive project roadmap.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>',
            'step_number': 1
        },
        {
            'title': 'AI-Driven Development',
            'description': 'Our AI systems generate optimized code while our experts ensure quality and performance.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
            'step_number': 2
        },
        {
            'title': 'Testing & Quality Assurance',
            'description': 'Comprehensive testing ensures your application meets the highest standards.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            'step_number': 3
        },
        {
            'title': 'Deployment & Support',
            'description': 'We deploy your application and provide ongoing support and maintenance.',
            'icon': '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>',
            'step_number': 4
        }
    ]
    
    # Try to insert process steps
    for step in process_steps_data:
        try:
            result = supabase_service.supabase.table('process_steps').insert(step).execute()
            print(f"✅ Inserted process step: {step['title']}")
        except Exception as e:
            print(f"❌ Error inserting process step: {e}")
    
    # Testimonials data
    testimonials_data = [
        {
            'name': 'Sarah Johnson',
            'position': 'CTO',
            'company': 'TechStart Inc.',
            'content': 'Higgs Boson Consultancy transformed our development process. Their AI-driven approach delivered results faster than we ever imagined possible.',
            'rating': 5,
            'featured': True
        },
        {
            'name': 'Michael Chen',
            'position': 'Lead Developer',
            'company': 'Innovation Labs',
            'content': 'The quality of code and the speed of delivery exceeded all our expectations. Truly revolutionary approach to software development.',
            'rating': 5,
            'featured': True
        },
        {
            'name': 'Emily Rodriguez',
            'position': 'Product Manager',
            'company': 'Digital Solutions Co.',
            'content': 'Working with Higgs Boson was a game-changer. They understood our vision and delivered beyond our expectations.',
            'rating': 5,
            'featured': True
        }
    ]
    
    # Try to insert testimonials
    for testimonial in testimonials_data:
        try:
            result = supabase_service.supabase.table('testimonials').insert(testimonial).execute()
            print(f"✅ Inserted testimonial: {testimonial['name']}")
        except Exception as e:
            print(f"❌ Error inserting testimonial: {e}")
    
    # Hero slides data
    hero_slides_data = [
        {
            'title': 'AI-powered development that feels in-house',
            'subtitle': 'Experience the future of software development. Our AI-driven approach delivers enterprise-grade solutions with the precision and quality of your best in-house team.',
            'background_image': '/images/how-it-works-hero-bg.jpg',
            'primary_button_text': 'Start Your Project',
            'primary_button_action': 'schedule',
            'secondary_button_text': 'Learn More',
            'secondary_button_link': '/how-it-works',
            'stats': '<strong>Trusted by 100+ innovative companies</strong> • <span class="stat-highlight">70% cost reduction</span> • <span class="stat-highlight">75% faster delivery</span>',
            'slide_order': 1,
            'active': True
        },
        {
            'title': 'Transform Your Business with Innovative AI Solutions',
            'subtitle': 'Leverage cutting-edge artificial intelligence to automate processes, enhance decision-making, and unlock new opportunities for growth and efficiency.',
            'background_image': '/images/step3-strategy.jpg',
            'primary_button_text': 'Get AI Consultation',
            'primary_button_action': 'schedule',
            'secondary_button_text': 'View Services',
            'secondary_button_link': '/services',
            'stats': '<strong>AI-First Approach</strong> • <span class="stat-highlight">500+ AI models deployed</span> • <span class="stat-highlight">95% accuracy rate</span>',
            'slide_order': 2,
            'active': True
        },
        {
            'title': 'Build the Future with Transformative Technology',
            'subtitle': 'From web applications to mobile apps, cloud infrastructure to data analytics - we provide comprehensive technology solutions that scale with your business.',
            'background_image': '/images/step4-development.jpg',
            'primary_button_text': 'Start Building',
            'primary_button_action': 'schedule',
            'secondary_button_text': 'Price Calculator',
            'secondary_button_link': '/price-comparison',
            'stats': '<strong>Full-Stack Excellence</strong> • <span class="stat-highlight">200+ technologies mastered</span> • <span class="stat-highlight">99.9% uptime</span>',
            'slide_order': 3,
            'active': True
        }
    ]
    
    # Try to insert hero slides
    for slide in hero_slides_data:
        try:
            result = supabase_service.supabase.table('hero_slides').insert(slide).execute()
            print(f"✅ Inserted hero slide: {slide['title']}")
        except Exception as e:
            print(f"❌ Error inserting hero slide: {e}")
    
    print("\n🎉 Data insertion complete!")
    
    # Test the data retrieval
    print("\n🧪 Testing data retrieval...")
    try:
        benefits = supabase_service.get_benefits()
        print(f"✅ Retrieved {len(benefits)} benefits")
        
        hero_slides = supabase_service.get_hero_slides()
        print(f"✅ Retrieved {len(hero_slides)} hero slides")
        
        testimonials = supabase_service.get_testimonials()
        print(f"✅ Retrieved {len(testimonials)} testimonials")
        
        process_steps = supabase_service.get_process_steps()
        print(f"✅ Retrieved {len(process_steps)} process steps")
        
    except Exception as e:
        print(f"❌ Error retrieving data: {e}")

if __name__ == '__main__':
    insert_sample_data()
