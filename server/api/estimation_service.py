"""
Project Estimation Service
Handles intelligent project estimation and information extraction from conversations
"""
import re
import json
import logging
from decimal import Decimal
from typing import Dict, List, Optional, Tuple
from datetime import timezone
from django.utils import timezone as django_timezone

logger = logging.getLogger(__name__)


class ProjectEstimationService:
    """Service to extract project details and create estimations from conversations"""
    
    # Base hourly rate
    BASE_HOURLY_RATE = Decimal('170')
    
    # Technology stacks and their complexity multipliers
    TECH_STACK_COMPLEXITY = {
        'react': 1.0,
        'vue': 1.0,
        'angular': 1.1,
        'next.js': 1.1,
        'node.js': 1.0,
        'express': 1.0,
        'django': 1.0,
        'flask': 0.9,
        'fastapi': 1.0,
        'python': 1.0,
        'javascript': 1.0,
        'typescript': 1.1,
        'react native': 1.2,
        'flutter': 1.2,
        'ios': 1.3,
        'android': 1.3,
        'aws': 1.1,
        'azure': 1.1,
        'gcp': 1.1,
        'docker': 1.0,
        'kubernetes': 1.3,
        'postgresql': 1.0,
        'mysql': 1.0,
        'mongodb': 1.0,
        'redis': 1.0,
        'ai': 1.5,
        'machine learning': 1.5,
        'ml': 1.5,
        'blockchain': 1.8,
        'microservices': 1.4,
    }
    
    # Project type base estimates (in days)
    PROJECT_TYPE_ESTIMATES = {
        'web_app': {'min': 15, 'max': 30},
        'mobile_app': {'min': 20, 'max': 40},
        'e_commerce': {'min': 25, 'max': 45},
        'ai_solution': {'min': 30, 'max': 60},
        'dashboard': {'min': 10, 'max': 25},
        'api': {'min': 8, 'max': 20},
        'cms': {'min': 12, 'max': 28},
        'marketplace': {'min': 35, 'max': 70},
        'saas': {'min': 40, 'max': 80},
        'enterprise': {'min': 60, 'max': 120},
    }
    
    # Company type discounts
    COMPANY_DISCOUNTS = {
        'ngo': 20,
        'startup': 15,
        'social_enterprise': 18,
        'corporate': 0,
        'government': 5,
        'other': 0,
    }

    def __init__(self):
        self.required_fields = [
            'project_name',
            'company_name', 
            'company_type',
            'description',
            'contact_email',
            'tech_stack'
        ]

    def extract_project_info(self, conversation_history: List[Dict]) -> Dict:
        """Extract project information from conversation history"""
        extracted_info = {
            'project_name': None,
            'company_name': None,
            'company_type': None,
            'description': '',
            'tech_stack': [],
            'contact_email': None,
            'contact_phone': None,
            'refer_agent_code': None,
            'special_requirements': '',
            'timeline_requirements': '',
            'project_type': None,
            'estimated_complexity': 'medium'
        }
        
        # Combine all customer messages
        customer_messages = []
        for conv in conversation_history:
            if conv.get('is_user', True):  # is customer message
                customer_messages.append(conv['content'].lower())
        
        full_conversation = ' '.join(customer_messages)
        
        # Extract project name
        project_patterns = [
            r"project\s+(?:is\s+)?(?:called\s+)?['\"]([^'\"]+)['\"]",
            r"(?:building|creating|developing)\s+(?:a\s+)?(?:project\s+)?['\"]([^'\"]+)['\"]",
            r"my\s+project\s+['\"]([^'\"]+)['\"]",
            r"working\s+on\s+['\"]([^'\"]+)['\"]",
            r"project\s+name\s+is\s+['\"]([^'\"]+)['\"]",
            r"the\s+project\s+name\s+is\s+['\"]([^'\"]+)['\"]",
            # Patterns without quotes
            r"project\s+name\s+is\s+([^.!?]+?)(?:\.|!|\?|$)",
            r"the\s+project\s+name\s+is\s+([^.!?]+?)(?:\.|!|\?|$)",
            r"project\s+is\s+called\s+([^.!?]+?)(?:\.|!|\?|$)",
            r"building\s+(?:an?\s+)?([^.!?]+?)\s+(?:app|platform|website|system)",
            r"creating\s+(?:an?\s+)?([^.!?]+?)\s+(?:app|platform|website|system)",
        ]
        
        for pattern in project_patterns:
            match = re.search(pattern, full_conversation, re.IGNORECASE)
            if match:
                extracted_info['project_name'] = match.group(1).title()
                break
        
        # Extract company name
        company_patterns = [
            r"company\s+(?:is\s+)?['\"]([^'\"]+)['\"]",
            r"(?:from|at)\s+['\"]([^'\"]+)['\"]",
            r"my\s+company\s+['\"]([^'\"]+)['\"]",
            r"we\s+are\s+['\"]([^'\"]+)['\"]",
            r"company\s+name\s+is\s+['\"]([^'\"]+)['\"]",
            # Patterns without quotes
            r"company\s+(?:is\s+)?([^.!?]+?)(?:\.|!|\?|$)",
            r"my\s+company\s+(?:is\s+)?([^.!?]+?)(?:\.|!|\?|$)",
            r"(?:from|at)\s+([A-Z][a-zA-Z\s]+?)(?:\.|!|\?|$)",
            r"for\s+my\s+(?:startup\s+)?([A-Z][a-zA-Z\s]+?)(?:\.|!|\?|$)",
            r"company\s+name\s+is\s+([^.!?]+?)(?:\.|!|\?|$)",
        ]
        
        for pattern in company_patterns:
            match = re.search(pattern, full_conversation, re.IGNORECASE)
            if match:
                extracted_info['company_name'] = match.group(1).title()
                break
        
        # Extract company type
        if any(word in full_conversation for word in ['ngo', 'non-profit', 'nonprofit', 'charity']):
            extracted_info['company_type'] = 'ngo'
        elif any(word in full_conversation for word in ['startup', 'start-up', 'new company']):
            extracted_info['company_type'] = 'startup'
        elif any(word in full_conversation for word in ['social enterprise', 'b corp', 'social impact']):
            extracted_info['company_type'] = 'social_enterprise'
        elif any(word in full_conversation for word in ['government', 'public sector', 'council']):
            extracted_info['company_type'] = 'government'
        elif any(word in full_conversation for word in ['corporation', 'corporate', 'enterprise']):
            extracted_info['company_type'] = 'corporate'
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, full_conversation)
        if email_match:
            extracted_info['contact_email'] = email_match.group()
        
        # Extract phone
        phone_patterns = [
            r'\b(?:\+?44\s?)?(?:0\s?)?[1-9]\d{8,10}\b',  # UK format
            r'\b(?:\+?1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b'  # US format
        ]
        
        for pattern in phone_patterns:
            phone_match = re.search(pattern, full_conversation)
            if phone_match:
                extracted_info['contact_phone'] = phone_match.group()
                break
        
        # Extract technology stack
        tech_keywords = list(self.TECH_STACK_COMPLEXITY.keys())
        found_tech = []
        
        for tech in tech_keywords:
            if tech.lower() in full_conversation:
                found_tech.append(tech)
        
        extracted_info['tech_stack'] = found_tech
        
        # Determine project type
        if any(word in full_conversation for word in ['e-commerce', 'ecommerce', 'online store', 'shop']):
            extracted_info['project_type'] = 'e_commerce'
        elif any(word in full_conversation for word in ['mobile app', 'ios', 'android', 'react native', 'flutter']):
            extracted_info['project_type'] = 'mobile_app'
        elif any(word in full_conversation for word in ['ai', 'machine learning', 'artificial intelligence']):
            extracted_info['project_type'] = 'ai_solution'
        elif any(word in full_conversation for word in ['dashboard', 'analytics', 'reporting']):
            extracted_info['project_type'] = 'dashboard'
        elif any(word in full_conversation for word in ['api', 'backend', 'service']):
            extracted_info['project_type'] = 'api'
        elif any(word in full_conversation for word in ['cms', 'content management']):
            extracted_info['project_type'] = 'cms'
        elif any(word in full_conversation for word in ['marketplace', 'platform']):
            extracted_info['project_type'] = 'marketplace'
        elif any(word in full_conversation for word in ['saas', 'software as a service']):
            extracted_info['project_type'] = 'saas'
        else:
            extracted_info['project_type'] = 'web_app'
        
        # Extract description from project-related sentences
        description_parts = []
        sentences = re.split(r'[.!?]+', full_conversation)
        for sentence in sentences:
            if any(word in sentence for word in ['build', 'create', 'develop', 'need', 'want', 'project']):
                description_parts.append(sentence.strip())
        
        extracted_info['description'] = '. '.join(description_parts[:3])  # Limit to first 3 relevant sentences
        
        return extracted_info

    def calculate_estimation(self, project_info: Dict) -> Dict:
        """Calculate detailed project estimation"""
        project_type = project_info.get('project_type', 'web_app')
        tech_stack = project_info.get('tech_stack', [])
        company_type = project_info.get('company_type', 'other')
        
        # Get base estimate
        base_estimate = self.PROJECT_TYPE_ESTIMATES.get(project_type, {'min': 15, 'max': 30})
        base_days = (base_estimate['min'] + base_estimate['max']) / 2
        
        # Calculate technology complexity multiplier
        tech_multiplier = 1.0
        if tech_stack:
            tech_multipliers = [self.TECH_STACK_COMPLEXITY.get(tech.lower(), 1.0) for tech in tech_stack]
            tech_multiplier = sum(tech_multipliers) / len(tech_multipliers)
        
        # Apply complexity
        estimated_days = int(base_days * tech_multiplier)
        
        # Calculate breakdown
        breakdown = self._create_detailed_breakdown(project_type, estimated_days, tech_stack)
        
        # Calculate totals
        total_cost = Decimal(estimated_days) * self.BASE_HOURLY_RATE * 8  # 8 hours per day
        
        # Apply company discount
        discount_rate = self.COMPANY_DISCOUNTS.get(company_type, 0)
        original_cost = total_cost
        if discount_rate > 0:
            total_cost = total_cost * (1 - Decimal(discount_rate) / 100)
        
        return {
            'estimated_days': estimated_days,
            'hourly_rate': self.BASE_HOURLY_RATE,
            'original_cost': original_cost,
            'total_estimate': total_cost,
            'discount_applied': discount_rate,
            'breakdown_details': breakdown,
            'tech_multiplier': tech_multiplier,
        }

    def _create_detailed_breakdown(self, project_type: str, total_days: int, tech_stack: List[str]) -> Dict:
        """Create detailed cost breakdown"""
        breakdown = {}
        
        # Standard phases for any project
        phases = {
            'Planning & Analysis': 0.15,
            'UI/UX Design': 0.20,
            'Frontend Development': 0.25,
            'Backend Development': 0.20,
            'Testing & QA': 0.10,
            'Deployment & Launch': 0.10,
        }
        
        # Adjust phases based on project type
        if project_type == 'mobile_app':
            phases['Mobile App Development'] = phases.pop('Frontend Development')
            phases['App Store Optimization'] = 0.05
            # Redistribute percentages
            for phase in list(phases.keys())[:-1]:
                if phase != 'Mobile App Development':
                    phases[phase] *= 0.95
        
        elif project_type == 'ai_solution':
            phases['Data Analysis & ML Model'] = 0.25
            phases['AI Integration'] = 0.15
            # Reduce other phases slightly
            for phase in ['Frontend Development', 'Backend Development']:
                if phase in phases:
                    phases[phase] *= 0.8
        
        # Calculate costs for each phase
        daily_cost = self.BASE_HOURLY_RATE * 8
        
        for phase, percentage in phases.items():
            phase_days = int(total_days * percentage)
            phase_cost = phase_days * daily_cost
            breakdown[phase] = {
                'days': phase_days,
                'cost': float(phase_cost),
                'percentage': int(percentage * 100)
            }
        
        return breakdown

    def get_missing_fields(self, project_info: Dict) -> List[str]:
        """Get list of missing required fields"""
        missing = []
        
        for field in self.required_fields:
            value = project_info.get(field)
            if not value or (isinstance(value, list) and len(value) == 0):
                missing.append(field)
        
        return missing

    def generate_estimation_summary(self, estimation: Dict, project_info: Dict) -> str:
        """Generate a human-readable estimation summary"""
        summary_parts = []
        
        # Project overview
        summary_parts.append(f"## Project Estimation Summary")
        summary_parts.append(f"**Project:** {project_info.get('project_name', 'Your Project')}")
        summary_parts.append(f"**Company:** {project_info.get('company_name', 'Your Company')}")
        summary_parts.append("")
        
        # Cost breakdown
        summary_parts.append("### Cost Breakdown:")
        for phase, details in estimation['breakdown_details'].items():
            summary_parts.append(f"- **{phase}**: {details['days']} days - £{details['cost']:,.0f}")
        
        summary_parts.append("")
        summary_parts.append(f"**Total Estimated Days:** {estimation['estimated_days']}")
        summary_parts.append(f"**Hourly Rate:** £{estimation['hourly_rate']}")
        
        if estimation['discount_applied'] > 0:
            summary_parts.append(f"**Original Cost:** £{estimation['original_cost']:,.0f}")
            summary_parts.append(f"**{project_info.get('company_type', '').title()} Discount ({estimation['discount_applied']}%):** -£{estimation['original_cost'] - estimation['total_estimate']:,.0f}")
        
        summary_parts.append(f"**Final Total:** £{estimation['total_estimate']:,.0f}")
        
        # Technology stack
        if project_info.get('tech_stack'):
            summary_parts.append("")
            summary_parts.append("### Recommended Technology Stack:")
            for tech in project_info['tech_stack']:
                summary_parts.append(f"- {tech.title()}")
        
        return "\n".join(summary_parts)
