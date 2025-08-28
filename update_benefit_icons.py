#!/usr/bin/env python3
"""
Script to update benefit icons with new SVG icons
"""
import os
import sys
import django

# Add the server directory to Python path
sys.path.append('/Users/henryyeung/Documents/Higgs-Boson-React/server')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api.models import Benefit

def update_benefit_icons():
    """Update benefit icons with new SVG icons"""
    
    # New SVG icons
    icons = {
        "70% Cost Reduction": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>''',
        
        "75% Faster Delivery": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>''',
      
        "Lean Expert Teams": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>''',
      
        "Enterprise Quality": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1L15.5 7H22L17 11.5L19 18L12 14L5 18L7 11.5L2 7H8.5L12 1Z"/>
      </svg>'''
    }
    
    # Update each benefit
    for title, icon in icons.items():
        try:
            benefit = Benefit.objects.get(title=title)
            benefit.icon = icon
            benefit.save()
            print(f"✅ Updated icon for: {title}")
        except Benefit.DoesNotExist:
            print(f"❌ Benefit not found: {title}")
        except Exception as e:
            print(f"❌ Error updating {title}: {e}")
    
    print("\n🎉 Benefit icons update completed!")

if __name__ == "__main__":
    update_benefit_icons()
