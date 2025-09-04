#!/usr/bin/env python
"""
Test script for AI service technology complexity pricing
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api.ai_service import AIServiceManager

def test_ai_pricing():
    """Test the enhanced AI service pricing calculations"""
    
    print("🤖 Testing Enhanced AI Service with Technology Complexity Pricing")
    print("=" * 70)
    
    # Initialize AI service
    ai = AIServiceManager()
    print("✅ AI Service loaded successfully!")
    
    # Test scenarios
    test_scenarios = [
        {
            'name': 'Simple Website',
            'days': 10,
            'technologies': ['React', 'Node.js', 'MySQL'],
            'org_type': 'business'
        },
        {
            'name': 'Advanced Web App',
            'days': 25,
            'technologies': ['Angular', 'Spring Boot', 'PostgreSQL'],
            'org_type': 'startup'
        },
        {
            'name': 'Expert System',
            'days': 40,
            'technologies': ['React', 'Django', 'AWS', 'Kubernetes'],
            'org_type': 'business'
        },
        {
            'name': 'AI Project (NGO)',
            'days': 30,
            'technologies': ['Python', 'Machine Learning', 'AWS'],
            'org_type': 'ngo'
        }
    ]
    
    for scenario in test_scenarios:
        print(f"\n🚀 **{scenario['name']}**")
        print("-" * 50)
        
        pricing = ai.calculate_project_pricing(
            scenario['days'],
            scenario['technologies'],
            scenario['org_type']
        )
        
        print(ai.format_pricing_breakdown(pricing))
    
    # Test technology complexity calculation
    print("\n🔧 **Technology Complexity Analysis:**")
    print("-" * 50)
    
    tech_tests = [
        ['JavaScript', 'MySQL'],  # Basic
        ['React', 'Django', 'PostgreSQL'],  # Medium
        ['Angular', 'Spring Boot', 'AWS'],  # Advanced
        ['Kubernetes', 'Machine Learning', 'Blockchain']  # Expert
    ]
    
    for techs in tech_tests:
        multiplier = ai.calculate_tech_complexity_multiplier(techs)
        skill_level = ai.get_required_skill_level(techs)
        print(f"Technologies: {', '.join(techs)}")
        print(f"  → Multiplier: {multiplier:.2f}x")
        print(f"  → Required Level: {skill_level}")
        print()
    
    print("🎉 All tests completed successfully!")

if __name__ == "__main__":
    test_ai_pricing()
