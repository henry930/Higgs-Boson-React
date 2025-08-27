from django.core.management.base import BaseCommand
from api.models import Benefit, ProcessStep, Testimonial, HeroSlide, Appointment
from django.utils import timezone
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Django database...')

        # Seed Benefits
        benefits_data = [
            {
                'icon': '💰',
                'title': '70% Cost Reduction',
                'description': 'Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.',
                'order': 1,
                'active': True
            },
            {
                'icon': '⚡',
                'title': '75% Faster Delivery',
                'description': 'Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.',
                'order': 2,
                'active': True
            },
            {
                'icon': '👥',
                'title': 'Lean Expert Teams',
                'description': 'Achieve superior results with smaller teams focused on strategy, management, and quality oversight.',
                'order': 3,
                'active': True
            },
            {
                'icon': '⭐',
                'title': 'Enterprise Quality',
                'description': 'AI-assisted development with human expertise ensures exceptional quality and reliability.',
                'order': 4,
                'active': True
            }
        ]

        for benefit_data in benefits_data:
            benefit, created = Benefit.objects.get_or_create(
                title=benefit_data['title'],
                defaults=benefit_data
            )
            if created:
                self.stdout.write(f'Created benefit: {benefit.title}')

        # Seed Process Steps
        process_steps_data = [
            {
                'number': 1,
                'title': 'Discovery & Strategy',
                'description': 'We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning and risk assessment.',
                'order': 1,
                'active': True
            },
            {
                'number': 2,
                'title': 'AI-Accelerated Development',
                'description': 'Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment while ensuring quality standards.',
                'order': 2,
                'active': True
            },
            {
                'number': 3,
                'title': 'Delivery & Evolution',
                'description': 'Expert project managers ensure seamless delivery and provide ongoing maintenance, updates, and feature enhancements.',
                'order': 3,
                'active': True
            }
        ]

        for step_data in process_steps_data:
            step, created = ProcessStep.objects.get_or_create(
                number=step_data['number'],
                defaults=step_data
            )
            if created:
                self.stdout.write(f'Created process step: {step.title}')

        # Seed Testimonials
        testimonials_data = [
            {
                'quote': 'Higgs Boson Consultancy transformed our development process completely. We delivered our major product launch 3 months ahead of schedule with 60% cost savings.',
                'author_name': 'Sarah Johnson',
                'author_title': 'CTO, TechFlow Solutions',
                'company': 'TechFlow Solutions',
                'order': 1,
                'active': True,
                'featured': True
            },
            {
                'quote': 'The AI-powered development approach is revolutionary. Our team productivity increased by 75% while maintaining the highest quality standards.',
                'author_name': 'Michael Chen',
                'author_title': 'VP Engineering, DataVision Corp',
                'company': 'DataVision Corp',
                'order': 2,
                'active': True,
                'featured': True
            },
            {
                'quote': 'Working with Higgs Boson was a game-changer. They delivered enterprise-grade solutions that would have taken our team 12 months in just 3 months.',
                'author_name': 'Emily Rodriguez',
                'author_title': 'Product Director, InnovateLab',
                'company': 'InnovateLab',
                'order': 3,
                'active': True,
                'featured': True
            }
        ]

        for testimonial_data in testimonials_data:
            testimonial, created = Testimonial.objects.get_or_create(
                author_name=testimonial_data['author_name'],
                defaults=testimonial_data
            )
            if created:
                self.stdout.write(f'Created testimonial: {testimonial.author_name}')

        # Seed Hero Slides
        hero_slides_data = [
            {
                'title': 'Revolutionize Your Software Development with AI',
                'subtitle': 'Accelerate delivery by 75% and reduce costs by 70% with our AI-powered development platform. Experience the future of software engineering today.',
                'primary_button_text': 'Start Your Project',
                'primary_button_link': '/contact',
                'secondary_button_text': 'View Services',
                'secondary_button_link': '/services',
                'background_class': 'aiDevelopment',
                'order': 1,
                'active': True
            },
            {
                'title': 'Enterprise-Grade AI Solutions',
                'subtitle': 'Transform your business with cutting-edge AI technologies. From machine learning to automation, we deliver solutions that scale with your growth.',
                'primary_button_text': 'Get Started',
                'primary_button_link': '/contact',
                'secondary_button_text': 'Learn More',
                'secondary_button_link': '/about',
                'background_class': 'enterpriseSolutions',
                'order': 2,
                'active': True
            },
            {
                'title': 'Expert Teams, Proven Results',
                'subtitle': 'Work with seasoned AI researchers and developers who have delivered 100+ successful projects for companies ranging from startups to Fortune 500 enterprises.',
                'primary_button_text': 'Schedule Consultation',
                'primary_button_link': '/contact',
                'secondary_button_text': 'See Case Studies',
                'secondary_button_link': '/services',
                'background_class': 'expertTeams',
                'order': 3,
                'active': True
            }
        ]

        for slide_data in hero_slides_data:
            slide, created = HeroSlide.objects.get_or_create(
                title=slide_data['title'],
                defaults=slide_data
            )
            if created:
                self.stdout.write(f'Created hero slide: {slide.title}')

        # Seed some sample appointments
        appointments_data = [
            {
                'name': 'John Smith',
                'email': 'john.smith@example.com',
                'phone': '+1-555-0123',
                'company': 'Tech Startup Inc',
                'service': 'Web Development',
                'preferred_date': timezone.now().date() + timedelta(days=7),
                'preferred_time': '10:00-11:00',
                'message': 'Interested in building a new web application for our startup',
                'status': 'pending'
            },
            {
                'name': 'Jane Doe',
                'email': 'jane.doe@acmecorp.com',
                'phone': '+1-555-0456',
                'company': 'ACME Corporation',
                'service': 'AI/ML Implementation',
                'preferred_date': timezone.now().date() + timedelta(days=5),
                'preferred_time': '14:00-15:00',
                'message': 'Looking to implement AI solutions for our business process automation',
                'status': 'confirmed'
            }
        ]

        for appointment_data in appointments_data:
            appointment, created = Appointment.objects.get_or_create(
                email=appointment_data['email'],
                defaults=appointment_data
            )
            if created:
                self.stdout.write(f'Created appointment: {appointment.name}')

        self.stdout.write(
            self.style.SUCCESS('Successfully seeded Django database!')
        )
