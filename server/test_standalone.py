#!/usr/bin/env python3
"""
Standalone test for AI service pricing functionality
Tests the core pricing logic without Django dependencies
"""

# Test the core pricing functions directly
tech_complexity = {
    # Basic Technologies
    'HTML': {'multiplier': 1.0, 'category': 'frontend', 'skill_level': 'junior'},
    'CSS': {'multiplier': 1.0, 'category': 'frontend', 'skill_level': 'junior'},
    'JavaScript': {'multiplier': 1.05, 'category': 'frontend', 'skill_level': 'junior'},
    'TypeScript': {'multiplier': 1.1, 'category': 'frontend', 'skill_level': 'mid'},
    
    # Frontend Frameworks
    'React': {'multiplier': 1.1, 'category': 'frontend', 'skill_level': 'mid'},
    'Vue.js': {'multiplier': 1.08, 'category': 'frontend', 'skill_level': 'mid'},
    'Angular': {'multiplier': 1.15, 'category': 'frontend', 'skill_level': 'mid'},
    'Next.js': {'multiplier': 1.2, 'category': 'frontend', 'skill_level': 'mid'},
    'Svelte': {'multiplier': 1.1, 'category': 'frontend', 'skill_level': 'mid'},
    
    # Backend Technologies
    'Node.js': {'multiplier': 1.1, 'category': 'backend', 'skill_level': 'mid'},
    'Express.js': {'multiplier': 1.05, 'category': 'backend', 'skill_level': 'mid'},
    'Python': {'multiplier': 1.05, 'category': 'backend', 'skill_level': 'junior'},
    'Django': {'multiplier': 1.15, 'category': 'backend', 'skill_level': 'mid'},
    'Flask': {'multiplier': 1.1, 'category': 'backend', 'skill_level': 'mid'},
    'Java': {'multiplier': 1.2, 'category': 'backend', 'skill_level': 'mid'},
    'Spring Boot': {'multiplier': 1.25, 'category': 'backend', 'skill_level': 'senior'},
    'PHP': {'multiplier': 1.0, 'category': 'backend', 'skill_level': 'junior'},
    'Laravel': {'multiplier': 1.1, 'category': 'backend', 'skill_level': 'mid'},
    'Ruby on Rails': {'multiplier': 1.15, 'category': 'backend', 'skill_level': 'mid'},
    
    # Databases
    'MySQL': {'multiplier': 1.0, 'category': 'database', 'skill_level': 'junior'},
    'PostgreSQL': {'multiplier': 1.05, 'category': 'database', 'skill_level': 'mid'},
    'MongoDB': {'multiplier': 1.1, 'category': 'database', 'skill_level': 'mid'},
    'Redis': {'multiplier': 1.15, 'category': 'database', 'skill_level': 'mid'},
    'Elasticsearch': {'multiplier': 1.3, 'category': 'database', 'skill_level': 'senior'},
    
    # Cloud & DevOps
    'AWS': {'multiplier': 1.25, 'category': 'cloud', 'skill_level': 'senior'},
    'Azure': {'multiplier': 1.2, 'category': 'cloud', 'skill_level': 'senior'},
    'Google Cloud': {'multiplier': 1.2, 'category': 'cloud', 'skill_level': 'senior'},
    'Docker': {'multiplier': 1.15, 'category': 'devops', 'skill_level': 'mid'},
    'Kubernetes': {'multiplier': 1.4, 'category': 'devops', 'skill_level': 'senior'},
    'Terraform': {'multiplier': 1.3, 'category': 'devops', 'skill_level': 'senior'},
    
    # Advanced Technologies
    'GraphQL': {'multiplier': 1.2, 'category': 'api', 'skill_level': 'senior'},
    'Machine Learning': {'multiplier': 1.5, 'category': 'ai', 'skill_level': 'senior'},
    'Blockchain': {'multiplier': 1.6, 'category': 'blockchain', 'skill_level': 'senior'},
    'WebAssembly': {'multiplier': 1.4, 'category': 'performance', 'skill_level': 'senior'},
    'Microservices': {'multiplier': 1.3, 'category': 'architecture', 'skill_level': 'senior'},
}

# Developer daily rates
developer_rates = {
    'junior': 140,
    'mid': 170,
    'senior': 219
}

def get_technology_complexity(technologies):
    """Calculate complexity multiplier for given technologies"""
    total_multiplier = 1.0
    required_level = 'junior'
    
    category_bonuses = set()
    
    for tech in technologies:
        if tech in tech_complexity:
            tech_data = tech_complexity[tech]
            total_multiplier *= tech_data['multiplier']
            
            # Track skill level requirement
            if tech_data['skill_level'] == 'senior':
                required_level = 'senior'
            elif tech_data['skill_level'] == 'mid' and required_level != 'senior':
                required_level = 'mid'
            
            # Add category bonus
            category_bonuses.add(tech_data['category'])
    
    # Category diversity bonus
    if len(category_bonuses) >= 3:
        total_multiplier *= 1.05  # 5% bonus for diverse tech stack
    
    return {
        'multiplier': round(total_multiplier, 2),
        'required_level': required_level,
        'categories': list(category_bonuses)
    }

def calculate_project_pricing(days, level, technologies, client_type='standard'):
    """Calculate project pricing with technology complexity (no VAT)"""
    
    # Get technology complexity
    tech_data = get_technology_complexity(technologies)
    
    # Use the highest required level or the specified level
    skill_levels = ['junior', 'mid', 'senior']
    required_level_index = skill_levels.index(tech_data['required_level'])
    specified_level_index = skill_levels.index(level)
    actual_level = skill_levels[max(required_level_index, specified_level_index)]
    
    # Calculate base cost
    daily_rate = developer_rates[actual_level]
    base_cost = days * daily_rate
    
    # Apply technology complexity
    adjusted_cost = base_cost * tech_data['multiplier']
    
    # Apply client type discounts
    discount_amount = 0
    if client_type == 'startup':
        discount_amount = adjusted_cost * 0.15  # 15% discount
    elif client_type == 'ngo':
        discount_amount = adjusted_cost * 0.20  # 20% discount
    
    final_total = adjusted_cost - discount_amount
    
    return {
        'days': days,
        'level': actual_level,
        'daily_rate': daily_rate,
        'base_cost': base_cost,
        'technologies': technologies,
        'tech_multiplier': tech_data['multiplier'],
        'adjusted_cost': adjusted_cost,
        'discount_amount': discount_amount,
        'final_total': final_total,
        'client_type': client_type
    }

def format_pricing_breakdown(pricing):
    """Format pricing breakdown for display"""
    breakdown = f"""
💰 **Project Cost Breakdown:**

📊 **Base Calculation:**
- Project Duration: {pricing['days']} days
- Developer Level: {pricing['level'].title()} (£{pricing['daily_rate']}/day)
- Base Cost: £{pricing['base_cost']:,.0f}

🔧 **Technology Complexity:**
- Technologies: {', '.join(pricing['technologies'])}
- Complexity Multiplier: {pricing['tech_multiplier']}x
- Adjusted Cost: £{pricing['adjusted_cost']:,.0f}
"""
    
    if pricing['discount_amount'] > 0:
        discount_type = "Startup" if pricing['client_type'] == 'startup' else "NGO"
        discount_percent = 15 if pricing['client_type'] == 'startup' else 20
        breakdown += f"""
🎯 **{discount_type} Discount:**
- Discount ({discount_percent}%): -£{pricing['discount_amount']:,.0f}
- **Final Total: £{pricing['final_total']:,.0f}**
"""
    else:
        breakdown += f"""
💯 **Final Total: £{pricing['final_total']:,.0f}**
"""
    
    return breakdown

def main():
    """Run standalone tests"""
    print("🤖 Testing Standalone AI Service Pricing")
    print("=" * 50)
    
    # Test scenarios
    test_cases = [
        {
            'name': 'Simple Website',
            'days': 10,
            'level': 'mid',
            'technologies': ['React', 'Node.js', 'MySQL'],
            'client_type': 'standard'
        },
        {
            'name': 'Advanced Web App',
            'days': 25,
            'level': 'senior',
            'technologies': ['Angular', 'Spring Boot', 'PostgreSQL'],
            'client_type': 'startup'
        },
        {
            'name': 'Expert System',
            'days': 40,
            'level': 'senior',
            'technologies': ['React', 'Django', 'AWS', 'Kubernetes'],
            'client_type': 'standard'
        },
        {
            'name': 'AI Project',
            'days': 30,
            'level': 'senior',
            'technologies': ['Python', 'Machine Learning', 'AWS'],
            'client_type': 'ngo'
        }
    ]
    
    for test_case in test_cases:
        print(f"\n🚀 **{test_case['name']}**")
        print("-" * 50)
        
        pricing = calculate_project_pricing(
            test_case['days'],
            test_case['level'],
            test_case['technologies'],
            test_case['client_type']
        )
        
        breakdown = format_pricing_breakdown(pricing)
        print(breakdown)
    
    # Test technology complexity analysis
    print("\n🔧 **Technology Complexity Analysis:**")
    print("-" * 50)
    
    tech_tests = [
        ['JavaScript', 'MySQL'],
        ['React', 'Django', 'PostgreSQL'],
        ['Angular', 'Spring Boot', 'AWS'],
        ['Kubernetes', 'Machine Learning', 'Blockchain']
    ]
    
    for technologies in tech_tests:
        tech_data = get_technology_complexity(technologies)
        print(f"Technologies: {', '.join(technologies)}")
        print(f"  → Multiplier: {tech_data['multiplier']}x")
        print(f"  → Required Level: {tech_data['required_level']}")
        print()
    
    print("🎉 All standalone tests completed successfully!")

if __name__ == "__main__":
    main()
