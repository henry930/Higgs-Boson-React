"""
AI Service Integration for Customer Service
"""
from openai import OpenAI
from django.conf import settings
from typing import Dict, List, Optional
import json

class AIServiceManager:
    """Manage AI service integration with custom training"""
    
    def __init__(self):
        # Set your OpenAI API key from Django settings
        self.api_key = getattr(settings, 'OPENAI_API_KEY', None)
        self.client = None
        
        if self.api_key and self.api_key != 'your-openai-api-key-here':
            self.client = OpenAI(api_key=self.api_key)
        
        # Get business configuration from settings
        self.business_config = getattr(settings, 'BUSINESS_CONFIG', {
            'company_name': 'Higgs Boson Consultancy',
            'daily_rate': 170,
            'currency': 'GBP',
            'location': 'UK',
            'specialties': [
                'React Development',
                'Django/Python Backend',
                'Full-Stack Applications',
                'Database Design',
                'API Development'
            ]
        })
        
        self.business_config.update({
            'typical_project_durations': {
                'simple_website': '5-10 days',
                'web_application': '15-30 days',
                'complex_system': '30-60 days',
                'enterprise_solution': '60+ days'
            }
        })
    
    def create_system_prompt(self) -> str:
        """Create customized system prompt for AI"""
        
        return f"""You are a professional customer service representative for {self.business_config['company_name']}, a UK-based software development consultancy.

BUSINESS DETAILS:
- Daily Rate: £{self.business_config['daily_rate']} per developer day
- Location: {self.business_config['location']}
- Currency: {self.business_config['currency']}
- Specialties: {', '.join(self.business_config['specialties'])}

PRICING GUIDELINES:
- Simple websites (5-10 days): £{self.business_config['daily_rate'] * 7:,} - £{self.business_config['daily_rate'] * 10:,}
- Web applications (15-30 days): £{self.business_config['daily_rate'] * 15:,} - £{self.business_config['daily_rate'] * 30:,}
- Complex systems (30-60 days): £{self.business_config['daily_rate'] * 30:,} - £{self.business_config['daily_rate'] * 60:,}

DISCOUNT POLICY:
- Startups: 15% discount (max £2,000)
- Non-profits: 20% discount (max £3,000)
- Educational institutions: 25% discount (max £5,000)
- Small businesses: 10% discount (max £1,500)

COMMUNICATION STYLE:
- Professional but friendly
- Focus on understanding client needs
- Provide accurate cost estimates
- Explain technical concepts in simple terms
- Always mention our UK location and quality standards
- Ask follow-up questions to understand requirements better

IMPORTANT RULES:
- Never quote below £{self.business_config['daily_rate']} per day
- Always ask about project requirements before pricing
- Mention our expertise in React and Django
- Offer to schedule a detailed consultation for complex projects
- Be transparent about timelines and costs
- If customer asks for "options" or "alternatives", provide 2-3 different approaches with cost differences
- Detect customer type (startup, nonprofit, education, small business) for appropriate discounts

CONVERSATION FLOW:
1. Greet warmly and ask about their project
2. Understand project type and requirements  
3. Ask about budget range and timeline
4. Provide detailed estimate with options
5. Offer next steps for consultation

PROJECT ESTIMATION REQUIREMENTS:
When providing project estimates, always try to gather these essential details:
- Project name
- Company name and type (NGO, Startup, Social Enterprise, Corporate, Government)
- Project description and requirements
- Technology stack preferences
- Contact email and phone number
- Any special requirements or timeline constraints
- Referral agent code (if mentioned)

If a customer confirms an estimation, ask if they'd like to proceed with a formal quote. This will save their project details for our team to follow up.

IMPORTANT DISCLAIMERS (ALWAYS PROVIDE BEFORE ASKING FOR CONFIRMATION):
Before asking customer to confirm any estimation, you MUST present these disclaimers clearly:

"Before we proceed with your formal estimation, please note these important terms:

📋 **Estimation Terms & Conditions:**

1. **Quote Binding**: This detailed quote will be binding for our future contract. Once a contract is signed, any appendices, alterations, or clarifications may induce extra costs.

2. **Final Estimation Process**: This estimation is preliminary. Our specialist will contact you for further assessment and send you the final contract to kickstart the project.

3. **Payment Structure**: We require 30% of the total project amount as a deposit. Our project manager will provide weekly progress reports, and customers pay for 5 man-days as installments to keep the project continuing until all bills are settled. Late or non-payment will delay or potentially terminate project progress.

4. **No Extra Charges**: If we need additional man-days for the project beyond our estimate, we will not charge you any extra costs.

Do you understand and agree to these terms? If yes, I can proceed with creating your formal estimation."

ONLY after customer acknowledges these terms should you proceed with estimation confirmation.

ESTIMATION CONFIRMATION KEYWORDS:
Watch for phrases like: "sounds good", "I accept", "let's proceed", "yes please", "confirm", "I agree", "that works", "perfect"

When customer confirms an estimation, respond with something like:
"Excellent! I'd be happy to prepare a formal project estimation for you. To proceed, I'll need to confirm a few details and save this to our system. Would you like me to prepare the formal documentation now?"
"""

    def get_ai_response(self, conversation_history: List[Dict], user_message: str) -> str:
        """Get AI response with custom business context"""
        
        if not self.client:
            return "I'm here to help you with your project! However, our AI service is currently being configured. Let me assist you using our comprehensive consultation process. Could you tell me more about your project requirements?"
        
        try:
            # Prepare messages for AI
            messages = [
                {"role": "system", "content": self.create_system_prompt()}
            ]
            
            # Add conversation history (last 10 messages for context) - handle empty history
            if conversation_history and isinstance(conversation_history, (list, tuple)) and len(conversation_history) > 0:
                # Safely get last 10 messages
                last_messages = conversation_history[-10:] if len(conversation_history) >= 10 else conversation_history
                for msg in last_messages:
                    if isinstance(msg, dict) and msg.get('content'):
                        messages.append({
                            "role": "user" if msg.get('is_user') else "assistant",
                            "content": str(msg.get('content', ''))
                        })
            
            # Add current message
            messages.append({"role": "user", "content": user_message})
            
            # Call OpenAI API with new format
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Cost-effective option
                messages=messages,
                max_tokens=500,  # Limit response length to control costs
                temperature=0.7,  # Balanced creativity
                presence_penalty=0.1,  # Reduce repetition
                frequency_penalty=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Log the specific error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"AI Service Error: {str(e)}", exc_info=True)
            
            # Fallback to rule-based system
            return f"I'm here to help you with your project! Let me assist you using our standard consultation process. Could you tell me more about your project requirements? (AI service temporarily unavailable: {str(e)[:50]}...)"
    
    def update_business_config(self, new_config: Dict):
        """Update business configuration for AI responses"""
        
        if 'daily_rate' in new_config:
            self.business_config['daily_rate'] = new_config['daily_rate']
        
        if 'specialties' in new_config:
            self.business_config['specialties'] = new_config['specialties']
        
        if 'company_name' in new_config:
            self.business_config['company_name'] = new_config['company_name']
        
        # Save to database or cache for persistence
        # This allows you to adjust AI behavior without code changes
        
        return self.business_config

# Cost Comparison
AI_SERVICE_COSTS = {
    'openai_gpt35': {
        'cost_per_1k_tokens': 0.002,  # $0.002 per 1k tokens
        'typical_cost_per_conversation': 0.01,  # ~£0.01 per exchange
        'monthly_budget_recommendation': 50  # £50/month for moderate usage
    },
    'openai_gpt4': {
        'cost_per_1k_tokens': 0.03,   # More expensive but higher quality
        'typical_cost_per_conversation': 0.05,
        'monthly_budget_recommendation': 150
    },
    'anthropic_claude': {
        'cost_per_1k_tokens': 0.008,  # Middle ground
        'typical_cost_per_conversation': 0.02,
        'monthly_budget_recommendation': 75
    }
}
