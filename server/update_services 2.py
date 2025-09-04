#!/usr/bin/env python
import os
import sys
import django

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api.models import Service

def update_services():
    """Update existing services with missing field data"""
    
    services_data = [
        {
            'id': 1,
            'short_description': 'AI-accelerated web development with 75% faster delivery',
            'duration': '2-12 weeks',
            'category': 'Web Development'
        },
        {
            'id': 2,
            'short_description': 'AI-accelerated web development with 75% faster delivery',
            'duration': '2-12 weeks',
            'category': 'Web Development'
        },
        {
            'id': 3,
            'short_description': 'Enterprise AI systems with proven ROI',
            'duration': '4-24 weeks',
            'category': 'AI & Machine Learning'
        },
        {
            'id': 4,
            'short_description': 'AI-powered mobile app development for iOS and Android',
            'duration': '3-16 weeks',
            'category': 'Mobile Development'
        }
    ]
    
    for data in services_data:
        try:
            service = Service.objects.get(id=data['id'])
            service.short_description = data['short_description']
            service.duration = data['duration']
            service.category = data['category']
            service.featured = True
            service.save()
            print(f"Updated service: {service.title}")
        except Service.DoesNotExist:
            print(f"Service with id {data['id']} not found")
    
    print("Services update completed!")

if __name__ == '__main__':
    update_services()
