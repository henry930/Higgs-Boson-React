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

def fix_features_format():
    """Convert string features to proper array format"""
    
    services = Service.objects.all()
    
    for service in services:
        if isinstance(service.features, str) and service.features:
            # Convert string to list
            features_list = [f.strip() for f in service.features.split(',')]
            service.features = features_list
            service.save()
            print(f"Updated features for service: {service.title}")
        elif not service.features:
            # Set empty list for services with no features
            service.features = []
            service.save()
            print(f"Set empty features for service: {service.title}")
    
    print("Features format update completed!")

if __name__ == '__main__':
    fix_features_format()
