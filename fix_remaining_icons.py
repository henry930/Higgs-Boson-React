#!/usr/bin/env python3
"""
Script to fix the remaining FontAwesome icons with proper SVG icons
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

def fix_remaining_icons():
    """Fix Expert Development Team and Agile Project Management icons"""
    
    # New SVG icons for the problematic benefits
    icons = {
        "Expert Development Team": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>''',
        
        "Agile Project Management": '''<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>'''
    }
    
    # Update each benefit
    for title, icon in icons.items():
        try:
            benefit = Benefit.objects.get(title=title)
            old_icon = benefit.icon[:50] + "..." if len(benefit.icon) > 50 else benefit.icon
            benefit.icon = icon
            benefit.save()
            print(f"✅ Updated icon for: {title}")
            print(f"   Old: {old_icon}")
            print(f"   New: SVG icon")
            print()
        except Benefit.DoesNotExist:
            print(f"❌ Benefit not found: {title}")
        except Exception as e:
            print(f"❌ Error updating {title}: {e}")
    
    print("🎉 Remaining FontAwesome icons have been fixed with SVG icons!")

if __name__ == "__main__":
    fix_remaining_icons()
