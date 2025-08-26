#!/usr/bin/env python3
"""
Data Model Creation Script for User Project Management
Creates Django models, runs migrations, and sets up initial data
"""

import os
import sys
import django
from pathlib import Path

# Setup Django environment
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root / 'server'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth.models import User
from api.models import *
import json

def create_migrations():
    """Create Django migrations for all models"""
    print("🔄 Creating Django migrations...")
    try:
        execute_from_command_line(['manage.py', 'makemigrations'])
        print("✅ Migrations created successfully")
    except Exception as e:
        print(f"❌ Error creating migrations: {e}")
        return False
    return True

def run_migrations():
    """Run Django migrations to create database tables"""
    print("🔄 Running Django migrations...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations applied successfully")
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False
    return True

def create_superuser():
    """Create Django admin superuser if not exists"""
    print("🔄 Creating superuser account...")
    try:
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='henry930@gmail.com',
                password='admin123'  # Change this in production!
            )
            print("✅ Superuser 'admin' created (password: admin123)")
        else:
            print("ℹ️  Superuser 'admin' already exists")
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        return False
    return True

def create_sample_data():
    """Create sample data for testing and development"""
    print("🔄 Creating sample data...")
    
    try:
        # Create sample admin settings
        settings, created = AdminSettings.objects.get_or_create(
            id=1,
            defaults={
                'admin_email': 'henry930@gmail.com',
                'company_name': 'Higgs Boson Consultancy',
                'email_notifications': True
            }
        )
        if created:
            print("✅ Admin settings created")
        
        # Create sample customer
        customer, created = Customer.objects.get_or_create(
            session_id='demo_session_001',
            defaults={
                'name': 'John Doe',
                'email': 'john.doe@example.com',
                'phone': '+44 123 456 7890',
                'company': 'TechStart Ltd'
            }
        )
        if created:
            print("✅ Sample customer created")
        
        # Create sample project requirement
        requirement, created = ProjectRequirement.objects.get_or_create(
            customer=customer,
            project_title='E-commerce Website',
            defaults={
                'project_type': 'web_app',
                'description': 'A modern e-commerce website with product catalog, shopping cart, and payment integration.',
                'budget_range': '£5,000 - £15,000',
                'timeline': '2-3 months',
                'priority': 'high',
                'status': 'quote_ready',
                'feasibility_score': 8,
                'estimated_days': 45,
                'estimated_cost': 7500.00,
                'ai_evaluation': 'This is a well-scoped e-commerce project with standard requirements.',
                'detected_features': [
                    'Product Catalog',
                    'Shopping Cart',
                    'Payment Gateway',
                    'User Authentication',
                    'Admin Dashboard'
                ],
                'complexity_level': 'medium',
                'hourly_rate': 170.00
            }
        )
        if created:
            print("✅ Sample project requirement created")
        
        # Create sample conversation
        conversation, created = Conversation.objects.get_or_create(
            customer=customer,
            requirement=requirement,
            speaker='customer',
            message='I need an e-commerce website for selling handmade crafts.',
            defaults={
                'metadata': {'confidence': 0.95}
            }
        )
        if created:
            print("✅ Sample conversation created")
        
        # Create sample benefits
        benefits_data = [
            {
                'title': 'Expert Development Team',
                'description': 'Our skilled developers deliver high-quality solutions using modern technologies.',
                'icon': 'fas fa-code',
                'order': 1
            },
            {
                'title': 'Agile Project Management',
                'description': 'We use agile methodologies to ensure timely delivery and continuous improvement.',
                'icon': 'fas fa-tasks',
                'order': 2
            },
            {
                'title': '24/7 Support',
                'description': 'Round-the-clock support to keep your project running smoothly.',
                'icon': 'fas fa-headset',
                'order': 3
            }
        ]
        
        for benefit_data in benefits_data:
            benefit, created = Benefit.objects.get_or_create(
                title=benefit_data['title'],
                defaults=benefit_data
            )
            if created:
                print(f"✅ Created benefit: {benefit.title}")
        
        # Create sample services
        services_data = [
            {
                'title': 'Web Application Development',
                'description': 'Custom web applications built with React, Django, and modern technologies.',
                'short_description': 'Custom web applications for your business needs.',
                'icon': 'fas fa-globe',
                'features': ['React Frontend', 'Django Backend', 'Database Design', 'API Development'],
                'price_range': '£5,000 - £50,000',
                'duration': '4-12 weeks',
                'category': 'web_development',
                'order': 1,
                'featured': True
            },
            {
                'title': 'E-commerce Solutions',
                'description': 'Complete e-commerce platforms with payment integration and inventory management.',
                'short_description': 'Full-featured online stores and marketplaces.',
                'icon': 'fas fa-shopping-cart',
                'features': ['Product Catalog', 'Payment Gateway', 'Inventory Management', 'Order Processing'],
                'price_range': '£8,000 - £30,000',
                'duration': '6-10 weeks',
                'category': 'ecommerce',
                'order': 2,
                'featured': True
            }
        ]
        
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                title=service_data['title'],
                defaults=service_data
            )
            if created:
                print(f"✅ Created service: {service.title}")
        
        print("✅ Sample data creation completed")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False
    
    return True

def create_project_estimation_sample():
    """Create sample project estimation data"""
    print("🔄 Creating sample project estimation...")
    
    try:
        customer = Customer.objects.get(session_id='demo_session_001')
        
        estimation, created = ProjectEstimation.objects.get_or_create(
            project_name='Mobile App for Local Business',
            company_name='LocalBiz Solutions',
            defaults={
                'company_type': 'startup',
                'description': 'A mobile app to help local businesses connect with customers, featuring booking system, loyalty program, and push notifications.',
                'tech_stack': ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
                'breakdown_details': {
                    'UI/UX Design': {'hours': 40, 'cost': 6800},
                    'Frontend Development': {'hours': 80, 'cost': 13600},
                    'Backend Development': {'hours': 60, 'cost': 10200},
                    'Testing & Deployment': {'hours': 20, 'cost': 3400}
                },
                'total_estimate': 34000.00,
                'estimated_days': 50,
                'hourly_rate': 170.00,
                'contact_email': 'contact@localbiz.com',
                'contact_phone': '+44 987 654 3210',
                'customer': customer,
                'conversation_history': [
                    {'speaker': 'customer', 'message': 'We need a mobile app for our local business'},
                    {'speaker': 'ai', 'message': 'I can help you with that. What features do you need?'},
                    {'speaker': 'customer', 'message': 'Booking system, loyalty program, and notifications'}
                ],
                'session_id': 'estimation_session_001',
                'status': 'pending',
                'terms_acknowledged': False,
                'discount_applied': 15.00,  # 15% startup discount
                'special_requirements': 'Must integrate with existing POS system',
                'timeline_requirements': 'Need to launch before holiday season'
            }
        )
        
        if created:
            # Apply startup discount
            estimation.apply_company_discount()
            estimation.save()
            print("✅ Sample project estimation created with startup discount")
        else:
            print("ℹ️  Sample project estimation already exists")
            
    except Exception as e:
        print(f"❌ Error creating project estimation: {e}")
        return False
    
    return True

def generate_model_summary():
    """Generate a summary of all models and their relationships"""
    print("\n📊 DATABASE MODEL SUMMARY")
    print("=" * 50)
    
    models_info = [
        ('User Management', [
            ('Customer', Customer.objects.count()),
            ('AdminSettings', AdminSettings.objects.count())
        ]),
        ('Project Management', [
            ('ProjectRequirement', ProjectRequirement.objects.count()),
            ('ProjectEstimation', ProjectEstimation.objects.count()),
            ('Quote', Quote.objects.count()),
            ('Contract', Contract.objects.count())
        ]),
        ('Communication', [
            ('Conversation', Conversation.objects.count())
        ]),
        ('Website Content', [
            ('Service', Service.objects.count()),
            ('Benefit', Benefit.objects.count()),
            ('ProcessStep', ProcessStep.objects.count()),
            ('Testimonial', Testimonial.objects.count()),
            ('HeroSlide', HeroSlide.objects.count()),
            ('TeamMember', TeamMember.objects.count()),
            ('Page', Page.objects.count())
        ])
    ]
    
    for category, models in models_info:
        print(f"\n{category}:")
        for model_name, count in models:
            print(f"  • {model_name}: {count} records")
    
    print(f"\n🔗 Key Relationships:")
    print("  • Customer → ProjectRequirement (1:N)")
    print("  • Customer → Conversation (1:N)")
    print("  • Customer → ProjectEstimation (1:N)")
    print("  • ProjectRequirement → Quote (1:N)")
    print("  • Quote → Contract (1:1)")
    print("  • ProjectRequirement → Conversation (1:N)")

def main():
    """Main function to run all setup tasks"""
    print("🚀 HIGGS BOSON PROJECT - DATABASE SETUP")
    print("=" * 50)
    
    # Change to server directory for Django commands
    os.chdir(project_root / 'server')
    
    success = True
    
    # Step 1: Create migrations
    if not create_migrations():
        success = False
    
    # Step 2: Run migrations
    if success and not run_migrations():
        success = False
    
    # Step 3: Create superuser
    if success and not create_superuser():
        success = False
    
    # Step 4: Create sample data
    if success and not create_sample_data():
        success = False
    
    # Step 5: Create project estimation sample
    if success and not create_project_estimation_sample():
        success = False
    
    # Step 6: Generate summary
    if success:
        generate_model_summary()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
        print("\n📋 Next Steps:")
        print("  1. Start Django server: python manage.py runserver")
        print("  2. Access admin panel: http://localhost:8000/admin/")
        print("  3. Login with: admin / admin123")
        print("  4. Start developing your user dashboard!")
    else:
        print("❌ DATABASE SETUP FAILED")
        print("Please check the errors above and try again.")
    
    return success

if __name__ == "__main__":
    main()
