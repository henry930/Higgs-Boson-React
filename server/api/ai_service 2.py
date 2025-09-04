"""
AI Service Integration for Customer Service
"""
from openai import OpenAI
from django.conf import settings
from typing import Dict, List, Optional
import json
from datetime import datetime
from .email_service import send_customer_confirmation_notification

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
            'daily_rate': 175,
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
        
        # Technology complexity and pricing multipliers
        self.tech_complexity = {
            # Frontend Technologies
            'React': {'complexity': 'medium', 'multiplier': 1.0, 'category': 'frontend', 'skill_level': 'mid'},
            'Vue.js': {'complexity': 'medium', 'multiplier': 1.0, 'category': 'frontend', 'skill_level': 'mid'},
            'Angular': {'complexity': 'high', 'multiplier': 1.15, 'category': 'frontend', 'skill_level': 'senior'},
            'Next.js': {'complexity': 'high', 'multiplier': 1.1, 'category': 'frontend', 'skill_level': 'mid'},
            'TypeScript': {'complexity': 'medium', 'multiplier': 1.05, 'category': 'language', 'skill_level': 'mid'},
            'JavaScript': {'complexity': 'basic', 'multiplier': 1.0, 'category': 'language', 'skill_level': 'junior'},
            
            # Backend Technologies
            'Node.js': {'complexity': 'medium', 'multiplier': 1.0, 'category': 'backend', 'skill_level': 'mid'},
            'Django': {'complexity': 'medium', 'multiplier': 1.05, 'category': 'backend', 'skill_level': 'mid'},
            'Flask': {'complexity': 'basic', 'multiplier': 1.0, 'category': 'backend', 'skill_level': 'junior'},
            'Express.js': {'complexity': 'basic', 'multiplier': 1.0, 'category': 'backend', 'skill_level': 'junior'},
            'FastAPI': {'complexity': 'medium', 'multiplier': 1.05, 'category': 'backend', 'skill_level': 'mid'},
            'Spring Boot': {'complexity': 'high', 'multiplier': 1.2, 'category': 'backend', 'skill_level': 'senior'},
            'ASP.NET': {'complexity': 'high', 'multiplier': 1.15, 'category': 'backend', 'skill_level': 'senior'},
            
            # Databases
            'PostgreSQL': {'complexity': 'medium', 'multiplier': 1.0, 'category': 'database', 'skill_level': 'mid'},
            'MySQL': {'complexity': 'basic', 'multiplier': 1.0, 'category': 'database', 'skill_level': 'junior'},
            'MongoDB': {'complexity': 'medium', 'multiplier': 1.05, 'category': 'database', 'skill_level': 'mid'},
            'Redis': {'complexity': 'medium', 'multiplier': 1.05, 'category': 'database', 'skill_level': 'mid'},
            'Elasticsearch': {'complexity': 'high', 'multiplier': 1.2, 'category': 'database', 'skill_level': 'senior'},
            
            # Cloud & DevOps
            'AWS': {'complexity': 'high', 'multiplier': 1.25, 'category': 'cloud', 'skill_level': 'senior'},
            'Azure': {'complexity': 'high', 'multiplier': 1.2, 'category': 'cloud', 'skill_level': 'senior'},
            'GCP': {'complexity': 'high', 'multiplier': 1.2, 'category': 'cloud', 'skill_level': 'senior'},
            'Docker': {'complexity': 'medium', 'multiplier': 1.1, 'category': 'devops', 'skill_level': 'mid'},
            'Kubernetes': {'complexity': 'expert', 'multiplier': 1.4, 'category': 'devops', 'skill_level': 'senior'},
            'Terraform': {'complexity': 'high', 'multiplier': 1.25, 'category': 'devops', 'skill_level': 'senior'},
            
            # Mobile
            'React Native': {'complexity': 'medium', 'multiplier': 1.1, 'category': 'mobile', 'skill_level': 'mid'},
            'Flutter': {'complexity': 'medium', 'multiplier': 1.15, 'category': 'mobile', 'skill_level': 'mid'},
            'Swift': {'complexity': 'high', 'multiplier': 1.2, 'category': 'mobile', 'skill_level': 'senior'},
            'Kotlin': {'complexity': 'high', 'multiplier': 1.15, 'category': 'mobile', 'skill_level': 'senior'},
            
            # Specialized
            'Machine Learning': {'complexity': 'expert', 'multiplier': 1.5, 'category': 'ai', 'skill_level': 'senior'},
            'AI': {'complexity': 'expert', 'multiplier': 1.6, 'category': 'ai', 'skill_level': 'senior'},
            'Deep Learning': {'complexity': 'expert', 'multiplier': 1.6, 'category': 'ai', 'skill_level': 'senior'},
            'Blockchain': {'complexity': 'expert', 'multiplier': 1.4, 'category': 'blockchain', 'skill_level': 'senior'},
            'GraphQL': {'complexity': 'medium', 'multiplier': 1.1, 'category': 'api', 'skill_level': 'mid'},
        }
    
    def calculate_tech_complexity_multiplier(self, technologies: List[str]) -> float:
        """Calculate pricing multiplier based on technology complexity"""
        if not technologies:
            return 1.0
        
        # Get multipliers for each technology
        multipliers = []
        categories = set()
        
        for tech in technologies:
            # Case-insensitive matching
            tech_key = None
            for key in self.tech_complexity.keys():
                if key.lower() == tech.lower():
                    tech_key = key
                    break
            
            if tech_key:
                multipliers.append(self.tech_complexity[tech_key]['multiplier'])
                categories.add(self.tech_complexity[tech_key]['category'])
            else:
                multipliers.append(1.0)  # Default for unknown technologies
        
        # Calculate average multiplier
        avg_multiplier = sum(multipliers) / len(multipliers)
        
        # Apply category bonus (5% per additional category)
        category_bonus = max(0, (len(categories) - 1) * 0.05)
        
        # Cap at 80% increase
        return min(avg_multiplier + category_bonus, 1.8)
    
    def get_required_skill_level(self, technologies: List[str]) -> str:
        """Determine required skill level based on technologies"""
        if not technologies:
            return 'mid'
        
        skill_levels = []
        for tech in technologies:
            tech_key = None
            for key in self.tech_complexity.keys():
                if key.lower() == tech.lower():
                    tech_key = key
                    break
            
            if tech_key:
                skill_levels.append(self.tech_complexity[tech_key]['skill_level'])
            else:
                skill_levels.append('mid')
        
        if 'senior' in skill_levels:
            return 'senior'
        elif 'mid' in skill_levels:
            return 'mid'
        else:
            return 'junior'
    
    def calculate_project_pricing(self, days: int, technologies: List[str] = None, organization_type: str = 'business') -> Dict:
        """Calculate detailed project pricing with technology complexity (no VAT)"""
        
        # Base calculations
        base_daily_rate = self.business_config['daily_rate']
        technologies = technologies or []
        
        # Get technology complexity
        tech_multiplier = self.calculate_tech_complexity_multiplier(technologies)
        skill_level = self.get_required_skill_level(technologies)
        
        # Adjust daily rate based on skill level
        if skill_level == 'junior':
            daily_rate = int(base_daily_rate * 0.71)  # £124
        elif skill_level == 'senior':
            daily_rate = int(base_daily_rate * 1.29)  # £226
        else:
            daily_rate = base_daily_rate  # £175
        
        # Calculate base cost
        base_cost = days * daily_rate
        
        # Apply technology complexity
        adjusted_cost = base_cost * tech_multiplier
        
        # Apply organization discounts
        discount_rate = 0.0
        discount_amount = 0.0
        max_discount = 0.0
        
        if organization_type.lower() in ['startup', 'start-up']:
            discount_rate = 0.15
            max_discount = 2000
        elif organization_type.lower() in ['ngo', 'non-profit', 'nonprofit', 'charity']:
            discount_rate = 0.20
            max_discount = 3000
        elif organization_type.lower() in ['education', 'educational', 'university', 'school']:
            discount_rate = 0.25
            max_discount = 5000
        elif organization_type.lower() in ['small business', 'small-business']:
            discount_rate = 0.10
            max_discount = 1500
        
        if discount_rate > 0:
            discount_amount = min(adjusted_cost * discount_rate, max_discount)
        
        final_total = adjusted_cost - discount_amount
        
        return {
            'days': days,
            'daily_rate': daily_rate,
            'skill_level': skill_level,
            'technologies': technologies,
            'tech_multiplier': round(tech_multiplier, 2),
            'base_cost': round(base_cost, 2),
            'adjusted_cost': round(adjusted_cost, 2),
            'discount_rate': discount_rate,
            'discount_amount': round(discount_amount, 2),
            'final_total': round(final_total, 2),
            'organization_type': organization_type
        }
    
    def format_pricing_breakdown(self, pricing: Dict) -> str:
        """Format pricing breakdown for AI responses"""
        
        breakdown = f"""
💰 **Project Cost Breakdown:**

📊 **Base Calculation:**
- Project Duration: {pricing['days']} days
- Developer Level: {pricing['skill_level'].title()} (£{pricing['daily_rate']}/day)
- Base Cost: £{pricing['base_cost']:,.0f}

🔧 **Technology Complexity:**
- Technologies: {', '.join(pricing['technologies']) if pricing['technologies'] else 'Standard web technologies'}
- Complexity Multiplier: {pricing['tech_multiplier']}x
- Adjusted Cost: £{pricing['adjusted_cost']:,.0f}
"""
        
        if pricing['discount_amount'] > 0:
            breakdown += f"""
🎯 **{pricing['organization_type'].title()} Discount:**
- Discount ({pricing['discount_rate']*100:.0f}%): -£{pricing['discount_amount']:,.0f}
- **Final Total: £{pricing['final_total']:,.0f}**
"""
        else:
            breakdown += f"\n💯 **Final Total: £{pricing['final_total']:,.0f}**\n"
        
        return breakdown
    
    def create_system_prompt(self) -> str:
        """Create customized system prompt for AI"""
        
        return f"""You are a professional customer service representative for {self.business_config['company_name']}, a UK-based software development consultancy.

BUSINESS DETAILS:
- Daily Rate: £{self.business_config['daily_rate']} per developer day (base rate)
- Location: {self.business_config['location']}
- Currency: {self.business_config['currency']}
- Specialties: {', '.join(self.business_config['specialties'])}

TECHNOLOGY COMPLEXITY PRICING:
Our pricing adjusts based on technology complexity and required skill level:

🔹 **Basic Technologies (1.0x)**: JavaScript, MySQL, Flask
🔸 **Medium Technologies (1.05x)**: React, Django, PostgreSQL, TypeScript
⭐ **Advanced Technologies (1.15-1.25x)**: Angular, Spring Boot, AWS, Azure
🔥 **Expert Technologies (1.4-1.6x)**: Kubernetes, AI/ML, Blockchain

**Complexity Examples:**
- Simple React + Node.js: ~1.0x multiplier
- Angular + Spring Boot + AWS: ~1.18x multiplier  
- Kubernetes + AI/ML: ~1.5x multiplier

**Developer Levels:**
- Junior (£{int(self.business_config['daily_rate'] * 0.71)}/day): Basic technologies, simpler projects
- Mid-Level (£{self.business_config['daily_rate']}/day): Most web applications, standard complexity
- Senior (£{int(self.business_config['daily_rate'] * 1.29)}/day): Advanced technologies, complex systems

PRICING GUIDELINES:
- Simple websites (5-10 days): £{self.business_config['daily_rate'] * 7:,} - £{self.business_config['daily_rate'] * 10:,} + complexity multiplier
- Web applications (15-30 days): £{self.business_config['daily_rate'] * 15:,} - £{self.business_config['daily_rate'] * 30:,} + complexity multiplier
- Complex systems (30-60 days): £{self.business_config['daily_rate'] * 30:,} - £{self.business_config['daily_rate'] * 60:,} + complexity multiplier

**IMPORTANT:** Always add 16.5% VAT to final quotes. Example:
- Base cost: £5,250 (30 days × £175)
- Complexity multiplier: 1.2x = £6,300
- VAT (16.5%): £1,040
- **Total: £7,340 (inc VAT)**

VAT CALCULATION:
- All quotes must include VAT at 16.5%
- Show breakdown: "Base cost: £X, Complexity adjustment: +X%, VAT: £X, Total: £X"

DISCOUNT POLICY:
- Startups: 15% discount (max £2,000)
- Non-profits: 20% discount (max £3,000)
- Educational institutions: 25% discount (max £5,000)
- Small businesses: 10% discount (max £1,500)

COMMUNICATION STYLE:
- Professional but friendly
- Focus on understanding client needs
- Provide accurate cost estimates with technology complexity considerations
- Explain technical concepts in simple terms
- Always mention our UK location and quality standards
- Ask follow-up questions to understand requirements better
- **Ask about specific technologies** they want to use (this affects pricing)
- Explain how technology choices impact project complexity and cost

TECHNOLOGY INQUIRY GUIDELINES:
When discussing projects, always ask about:
1. **Frontend requirements**: "What frontend technology do you prefer? React, Angular, or Vue.js?"
2. **Backend needs**: "Do you need a backend? Python/Django, Node.js, or something else?"
3. **Database requirements**: "What type of data storage do you need? PostgreSQL, MySQL, or MongoDB?"
4. **Cloud/hosting**: "Do you need cloud deployment? AWS, Azure, or simpler hosting?"
5. **Special features**: "Any specific requirements like AI integration, real-time features, or mobile apps?"

PRICING CALCULATION PROCESS:
1. Determine base project size (days needed)
2. Identify technologies mentioned by client
3. Calculate complexity multiplier using technology analysis
4. Apply appropriate developer level (junior/mid/senior)
5. Add VAT (16.5%)
6. Apply any applicable discounts (startup/NGO)
7. Present clear breakdown to client

IMPORTANT RULES:
- Never quote below £{int(self.business_config['daily_rate'] * 0.71)} per day (junior rate)
- Always ask about technologies before providing quotes
- Explain how technology choices affect pricing
- Mention our expertise in React and Django
- Offer to schedule a detailed consultation for complex projects
- Be transparent about timelines and costs
- If customer asks for "options" or "alternatives", provide 2-3 different approaches with technology and cost differences
- Detect customer type (startup, nonprofit, education, small business) for appropriate discounts
- **Always include VAT in final quotes**

CONVERSATION FLOW:
1. Greet warmly and ask about their project
2. Understand project type and requirements  
3. Ask about budget range and timeline
4. Provide detailed estimate with options
5. Offer next steps for consultation

PROJECT ESTIMATION REQUIREMENTS:
Before providing any estimate, you MUST collect these 4 ESSENTIAL details:

🔸 **MANDATORY INFORMATION (Required for ALL quotes):**
1. **Company Name** - Full legal name or business name
2. **Company Email** - Primary business email for correspondence  
3. **Contact Number** - Phone number for direct communication
4. **Organization Type** - Ask specifically: "Are you an NGO or Startup?" (Default: No - means regular business rates apply)

Additional details for accurate pricing:
- **Project name and description**
- **Technology stack preferences** (CRITICAL for pricing accuracy)
- **Timeline requirements**
- **Budget range**
- **Any special requirements**
- **Referral agent code** (if mentioned)

🔧 **TECHNOLOGY ANALYSIS (Essential for pricing):**
Ask specifically about:
- Frontend framework (React, Angular, Vue.js, etc.)
- Backend technology (Django, Node.js, Spring Boot, etc.)
- Database needs (PostgreSQL, MySQL, MongoDB, etc.)
- Cloud requirements (AWS, Azure, GCP, or simple hosting)
- Special features (AI, real-time, mobile, APIs, etc.)

**Example technology inquiry:**
"To provide an accurate quote, I need to understand your technology requirements:
- What frontend framework would you prefer? (React, Angular, Vue.js)
- Do you need a backend API? If so, any preference? (Python/Django, Node.js)
- What type of database? (PostgreSQL for complex data, MySQL for simpler needs)
- Any cloud hosting requirements? (AWS for enterprise, simpler hosting for basic sites)"

🚨 **COLLECTION VALIDATION:**
- Do NOT provide estimates without all 4 mandatory pieces of information
- Do NOT provide estimates without understanding the technology stack
- If missing information, politely ask: "To provide you with an accurate quote, I still need your [missing info]. Could you please provide that?"
- Keep track of what information you've collected in each conversation
- Only proceed to estimation after confirming you have: Company Name, Email, Phone, NGO/Startup status, AND technology requirements

**QUOTE STRUCTURE:**
When providing estimates, always include:
1. Base project cost (days × daily rate)
2. Technology complexity adjustment (show multiplier)
3. Developer level required (junior/mid/senior)
4. Subtotal before VAT
5. VAT (16.5%)
6. **Final total including VAT**
7. Any applicable discounts

**Example quote format:**
"Based on your requirements for a React + Django + PostgreSQL web application:
- Base cost: 20 days × £175 = £3,500
- Technology complexity: Medium (+5%) = £3,675
- VAT (16.5%): £607
- **Total: £4,282 (inc VAT)**
- Startup discount available: -15% = **Final: £3,640**"

**DISCOUNT APPLICATION:**
- If they answer "Yes" to NGO/Startup: Apply 15% startup discount OR 20% NGO discount
- If they answer "No": Use standard business rates
- If unclear, ask for clarification: "Are you a startup company or a non-profit organization?"

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
            
            ai_response = response.choices[0].message.content.strip()
            
            # Check if customer is confirming an estimate
            if self.detect_customer_confirmation(user_message):
                self.handle_customer_confirmation(conversation_history, user_message, ai_response)
            
            return ai_response
            
        except Exception as e:
            # Log the specific error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"AI Service Error: {str(e)}", exc_info=True)
            
            # Enhanced fallback system with Sarah personality
            return self.get_mock_sarah_response(user_message, conversation_history)
    
    def detect_customer_confirmation(self, user_message: str) -> bool:
        """Detect if customer is confirming their project estimate"""
        
        confirmation_keywords = [
            'sounds good', 'i accept', 'lets proceed', 'let\'s proceed', 'yes please', 
            'confirm', 'i agree', 'that works', 'perfect', 'i want to proceed',
            'go ahead', 'yes, let\'s do it', 'that\'s fine', 'agreed', 'i\'m interested',
            'book it', 'confirmed', 'proceed with', 'move forward', 'start the project'
        ]
        
        user_message_lower = user_message.lower()
        
        # Check for confirmation keywords
        for keyword in confirmation_keywords:
            if keyword in user_message_lower:
                return True
        
        # Check for positive responses to cost estimates
        if any(word in user_message_lower for word in ['yes', 'ok', 'okay', 'fine']) and \
           any(word in user_message_lower for word in ['cost', 'price', 'estimate', 'quote']):
            return True
            
        return False
    
    def handle_customer_confirmation(self, conversation_history: List[Dict], user_message: str, ai_response: str):
        """Handle customer confirmation by sending admin notification"""
        
        try:
            # Extract customer information from conversation history
            customer_data = self.extract_customer_data_from_history(conversation_history)
            project_data = self.extract_project_data_from_history(conversation_history)
            estimated_cost = self.extract_cost_from_history(conversation_history)
            
            # Add timestamp
            customer_data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Send admin notification
            success = send_customer_confirmation_notification(
                customer_data=customer_data,
                project_data=project_data,
                estimated_cost=estimated_cost
            )
            
            if success:
                import logging
                logger = logging.getLogger(__name__)
                logger.info(f"Admin notification sent for customer confirmation: {customer_data.get('company_name', 'Unknown')}")
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error handling customer confirmation: {str(e)}")
    
    def extract_customer_data_from_history(self, conversation_history: List[Dict]) -> Dict:
        """Extract customer data from conversation history"""
        
        customer_data = {
            'company_name': 'Not provided',
            'email': 'Not provided', 
            'phone': 'Not provided',
            'is_ngo_startup': False
        }
        
        if not conversation_history:
            return customer_data
        
        # Combine all conversation text to search for information
        full_conversation = ' '.join([
            msg.get('content', '') for msg in conversation_history 
            if isinstance(msg, dict) and msg.get('content')
        ])
        
        # Simple extraction logic - in production, you might want more sophisticated parsing
        # This is a basic implementation that looks for common patterns
        
        return customer_data
    
    def extract_project_data_from_history(self, conversation_history: List[Dict]) -> Dict:
        """Extract project information from conversation history"""
        
        project_data = {
            'type': 'Not specified',
            'description': 'Not provided',
            'requirements': 'Not provided',
            'timeline': 'Not specified',
            'tech_stack': 'Not specified'
        }
        
        if not conversation_history:
            return project_data
        
        # Look for project-related information in conversation
        full_conversation = ' '.join([
            msg.get('content', '') for msg in conversation_history 
            if isinstance(msg, dict) and msg.get('content')
        ])
        
        # Basic project type detection
        if 'website' in full_conversation.lower():
            project_data['type'] = 'Website'
        elif 'web app' in full_conversation.lower() or 'web application' in full_conversation.lower():
            project_data['type'] = 'Web Application'
        elif 'mobile app' in full_conversation.lower():
            project_data['type'] = 'Mobile Application'
        elif 'system' in full_conversation.lower():
            project_data['type'] = 'Custom System'
        
        return project_data
    
    def extract_cost_from_history(self, conversation_history: List[Dict]) -> str:
        """Extract cost estimate from conversation history"""
        
        if not conversation_history:
            return "Cost estimate not found in conversation"
        
        # Look for cost mentions in the conversation
        full_conversation = ' '.join([
            msg.get('content', '') for msg in conversation_history 
            if isinstance(msg, dict) and msg.get('content')
        ])
        
        # Look for £ symbol followed by numbers
        import re
        cost_pattern = r'£[\d,]+-£[\d,]+|£[\d,]+'
        costs = re.findall(cost_pattern, full_conversation)
        
        if costs:
            return f"Estimated cost: {costs[-1]} (based on £175/day rate)"
        else:
            return "Cost estimate discussed in conversation"

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

    def get_mock_sarah_response(self, user_message: str, conversation_history: List = None) -> str:
        """Enhanced mock response system with Sarah's personality"""
        
        user_message_lower = user_message.lower()
        history_length = len(conversation_history) if conversation_history else 0
        
        # Initial greeting
        if history_length == 0 or any(word in user_message_lower for word in ['hello', 'hi', 'hey', 'start']):
            return """Hello! I'm Sarah, your AI Project Assistant from Higgs Boson Consultancy. I'm here to help you get a detailed estimate for your project.

To provide you with an accurate quote, I need to collect some essential information first:

**Required Information:**
1. 📝 **Company Name** - Your business/organization name
2. 📧 **Company Email** - Primary contact email  
3. 📞 **Contact Number** - Phone number for direct communication
4. 🏢 **Organization Type** - Are you an NGO or Startup? (affects pricing)

Let's start! What's your company name?"""

        # Information collection responses
        if any(word in user_message_lower for word in ['company', 'business', 'organization', 'firm']):
            return """Great! I've noted your company information. 

To continue with your quote, I still need:
• Your company email address
• Contact phone number  
• Whether you're an NGO or Startup (this affects our pricing - we offer special discounts!)

What's your primary company email address?"""

        # Email collection
        if '@' in user_message or any(word in user_message_lower for word in ['email', 'mail', 'gmail', 'outlook']):
            return """Perfect! I've recorded your email. 

Still needed for your quote:
• Contact phone number
• NGO/Startup status (important for discount eligibility!)

What's your contact phone number?"""

        # Phone collection  
        if any(char.isdigit() for char in user_message) and any(word in user_message_lower for word in ['phone', 'number', 'contact', 'call']):
            return """Excellent! I have your contact details.

Final question: **Are you an NGO or Startup?** 
• NGOs get 20% discount (max £3,000 off)
• Startups get 15% discount (max £2,000 off)  
• Regular businesses use standard rates

Please answer Yes (if NGO/Startup) or No (if regular business)."""

        # NGO/Startup status
        if any(word in user_message_lower for word in ['ngo', 'startup', 'non-profit', 'charity', 'yes', 'no']):
            return """Perfect! I now have all your essential information:
✅ Company details
✅ Contact information  
✅ Organization type

Now let's discuss your project! What type of development project are you looking for?

**Our Services:**
• Websites (£1,190-£1,700)
• Web Applications (£2,550-£5,100)
• Complex Systems (£5,100-£10,200)

Tell me about your project requirements."""

        # Project type questions
        if any(word in user_message_lower for word in ['website', 'web', 'app', 'application', 'system']):
            return """Excellent! Now I can provide accurate pricing.

**Before I give you an estimate, I need to confirm I have:**
1. ✅ Company Name: [Please confirm I have this]
2. ✅ Company Email: [Please confirm I have this]  
3. ✅ Phone Number: [Please confirm I have this]
4. ✅ NGO/Startup Status: [Please confirm I have this]

If I'm missing any of these details, please provide them now. Otherwise, describe your project features so I can calculate an accurate estimate!"""

        # Default response - always ask for missing info
        return """To provide you with an accurate quote, I need these 4 essential details:

**Still Required:**
1. 📝 **Company Name** - Your business name
2. 📧 **Company Email** - Primary contact email
3. 📞 **Contact Number** - Your phone number  
4. 🏢 **Organization Type** - Are you an NGO/Startup? (Yes/No)

⭐ **Special Discounts Available:**
• NGOs: 20% off (max £3,000 discount)
• Startups: 15% off (max £2,000 discount)

Please provide the missing information so I can help you with your project estimate!"""

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
