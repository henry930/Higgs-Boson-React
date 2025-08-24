from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
import uuid
import json
import logging

from .models import (
    Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page,
    Customer, ProjectRequirement, Conversation, Quote, Contract, AdminSettings
)
from .serializers import (
    BenefitSerializer, ProcessStepSerializer, TestimonialSerializer,
    HeroSlideSerializer, TeamMemberSerializer, ServiceSerializer,
    PageSerializer, PageListSerializer, CustomerSerializer,
    ConversationSerializer, ProjectRequirementSerializer,
    ProjectRequirementCreateSerializer, QuoteSerializer, ContractSerializer,
    ChatMessageSerializer, ChatResponseSerializer, AdminSettingsSerializer
)
from .utils import api_response
from .email_service import send_customer_estimate_email, send_admin_notification_email

class StandardResultsSetPagination:
    """Standard pagination for all viewsets"""
    pass

def api_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Standardized API response format to match the current frontend expectations"""
    if status_code >= 400:
        return Response({
            'status': 'error',
            'message': message,
            'data': data
        }, status=status_code)
    else:
        return Response({
            'status': 'success',
            'message': message,
            'data': data
        }, status=status_code)

class BenefitViewSet(viewsets.ModelViewSet):
    queryset = Benefit.objects.filter(active=True)
    serializer_class = BenefitSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        return api_response(message="Validation error", data=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = get_object_or_404(Benefit, pk=pk)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(data=serializer.data)
        return api_response(message="Validation error", data=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        instance = get_object_or_404(Benefit, pk=pk)
        instance.delete()
        return api_response(message="Benefit deleted successfully")

class ProcessStepViewSet(viewsets.ModelViewSet):
    queryset = ProcessStep.objects.filter(active=True)
    serializer_class = ProcessStepSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(active=True)
    serializer_class = TestimonialSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.filter(active=True)
    serializer_class = HeroSlideSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.filter(active=True)
    serializer_class = TeamMemberSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(active=True)
    serializer_class = ServiceSerializer

    def list(self, request):
        queryset = self.get_queryset().order_by('order')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return PageListSerializer
        return PageSerializer

    def list(self, request):
        """List all pages (for admin)"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, pk=None):
        """Get single page by ID"""
        instance = get_object_or_404(Page, pk=pk)
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

    def create(self, request):
        """Create new page"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
        return api_response(message="Validation error", data=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """Update existing page"""
        instance = get_object_or_404(Page, pk=pk)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(data=serializer.data)
        return api_response(message="Validation error", data=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """Delete page"""
        instance = get_object_or_404(Page, pk=pk)
        instance.delete()
        return api_response(message="Page deleted successfully")

    @action(detail=False, methods=['get'], url_path='slug/(?P<slug>[^/.]+)')
    def get_by_slug(self, request, slug=None):
        """Get page by slug for public viewing"""
        try:
            page = Page.objects.get(slug=slug, published=True)
            serializer = self.get_serializer(page)
            return api_response(data=serializer.data)
        except Page.DoesNotExist:
            return api_response(message="Page not found", status_code=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='slug/(?P<slug>[^/.]+)/views')
    def increment_views(self, request, slug=None):
        """Increment page view count"""
        try:
            page = Page.objects.get(slug=slug, published=True)
            page.increment_views()
            serializer = self.get_serializer(page)
            return api_response(data=serializer.data)
        except Page.DoesNotExist:
            return api_response(message="Page not found", status_code=status.HTTP_404_NOT_FOUND)


# AI Customer Service Views
logger = logging.getLogger(__name__)


class AICustomerServiceView(APIView):
    """Main AI customer service chat interface"""
    
    def post(self, request):
        """Handle incoming chat messages"""
        serializer = ChatMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(
                message="Invalid message format", 
                data=serializer.errors, 
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        session_id = data['session_id']
        message = data['message']
        customer_info = data.get('customer_info', {})
        
        try:
            # Get or create customer
            customer, created = Customer.objects.get_or_create(
                session_id=session_id,
                defaults={
                    'name': customer_info.get('name', ''),
                    'email': customer_info.get('email', ''),
                    'phone': customer_info.get('phone', ''),
                    'company': customer_info.get('company', '')
                }
            )
            
            # Update customer info if provided
            if customer_info and not created:
                for field in ['name', 'email', 'phone', 'company']:
                    if field in customer_info and customer_info[field]:
                        setattr(customer, field, customer_info[field])
                customer.save()
            
            # Save customer message
            Conversation.objects.create(
                customer=customer,
                speaker='customer',
                message=message
            )
            
            # Generate AI response
            ai_response = self.generate_ai_response(customer, message)
            
            # Save AI response
            Conversation.objects.create(
                customer=customer,
                speaker='ai',
                message=ai_response['response'],
                metadata=ai_response.get('metadata', {})
            )
            
            return api_response(data=ai_response)
            
        except Exception as e:
            logger.error(f"Error in AI customer service: {str(e)}")
            return api_response(
                message="Internal server error", 
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def generate_ai_response(self, customer, message):
        """Generate AI response based on customer message and conversation history"""
        # Get conversation history
        conversations = Conversation.objects.filter(customer=customer).order_by('created_at')
        
        # Simple rule-based AI for demo (in production, this would use OpenAI/Claude)
        response_data = {
            'response': '',
            'next_step': '',
            'requirement_complete': False,
            'quote_ready': False,
            'metadata': {}
        }
        
        # Analyze current requirements
        requirements = ProjectRequirement.objects.filter(customer=customer)
        current_requirement = requirements.first() if requirements.exists() else None
        
        # Check if this is a greeting or new conversation
        greeting_keywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
        is_greeting = any(keyword in message.lower() for keyword in greeting_keywords)
        conversation_count = conversations.count()
        
        if is_greeting and conversation_count <= 2:  # Account for customer message + this response
            response_data['response'] = f"""Hello! Welcome to Higgs Boson Consultancy. I'm here to help you with your development needs.

I can assist you with:
• Web Applications & Mobile Apps
• AI Solutions & Machine Learning
• Cloud Infrastructure & DevOps
• Custom Software Development

To get started, could you tell me about your project? What kind of application or solution are you looking to build?"""
            response_data['next_step'] = 'project_type'
            return response_data
        
        # Check for project type information
        project_types = {
            'web': 'web_app',
            'website': 'web_app',
            'mobile': 'mobile_app',
            'app': 'mobile_app',
            'ai': 'ai_solution',
            'machine learning': 'ai_solution',
            'cloud': 'cloud_infrastructure',
            'infrastructure': 'cloud_infrastructure'
        }
        
        detected_type = None
        for keyword, proj_type in project_types.items():
            if keyword in message.lower():
                detected_type = proj_type
                break
        
        # Check for budget information (UK market - Pounds)
        budget_patterns = {
            'under £3': 'Under £3,000',
            'under 3': 'Under £3,000',
            '£3,000': '£3,000 - £10,000',
            '3000': '£3,000 - £10,000',
            '3k': '£3,000 - £10,000',
            '£10,000': '£10,000 - £35,000',
            '10000': '£10,000 - £35,000',
            '10k': '£10,000 - £35,000',
            '£35,000': '£35,000+',
            '35000': '£35,000+',
            '35k': '£35,000+',
            'not sure': 'Not sure / Need guidance',
            'need guidance': 'Not sure / Need guidance'
        }
        
        detected_budget = None
        message_lower = message.lower()
        
        # Check for pound amounts in the message
        import re
        # Look for £ symbol or pound amounts
        pound_match = re.search(r'[£]?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', message)
        if pound_match:
            amount = int(pound_match.group(1).replace(',', '').split('.')[0])
            if amount < 3000:
                detected_budget = 'Under £3,000'
            elif amount <= 10000:
                detected_budget = '£3,000 - £10,000'
            elif amount <= 35000:
                detected_budget = '£10,000 - £35,000'
            else:
                detected_budget = '£35,000+'
        else:
            # Fallback to keyword matching
            for pattern, budget in budget_patterns.items():
                if pattern in message_lower:
                    detected_budget = budget
                    break
        
        # Check for timeline information
        timeline_patterns = [
            'week', 'month', 'days', 'asap', 'urgent', 'flexible',
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december',
            '2024', '2025', 'next year'
        ]
        
        detected_timeline = None
        if any(pattern in message.lower() for pattern in timeline_patterns):
            detected_timeline = message
        
        # Check for email
        import re
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        detected_email = re.search(email_pattern, message)
        if detected_email:
            customer.email = detected_email.group()
            customer.save()
        
        # Create or update project requirement
        if not current_requirement:
            current_requirement = ProjectRequirement.objects.create(
                customer=customer,
                project_type=detected_type or '',
                description=message,
                status='gathering'
            )
            if detected_type:
                current_requirement.project_type = detected_type
                current_requirement.save()
        else:
            # Update description with new information
            current_requirement.description += f"\n\nAdditional info: {message}"
            
            # Update fields based on detected information
            if detected_type and not current_requirement.project_type:
                current_requirement.project_type = detected_type
            
            if detected_budget and not current_requirement.budget_range:
                current_requirement.budget_range = detected_budget
            
            if detected_timeline and not current_requirement.timeline:
                current_requirement.timeline = detected_timeline
            
            # Check if this message contains a project title
            if not current_requirement.project_title and len(message.split()) <= 6 and not detected_budget and not detected_timeline:
                # Likely a project title if it's short and not budget/timeline info
                current_requirement.project_title = message
            
            current_requirement.save()
        
        # Determine what information we still need
        missing_info = []
        if not current_requirement.project_title:
            missing_info.append('project_title')
        if not current_requirement.project_type:
            missing_info.append('project_type')
        if not current_requirement.budget_range:
            missing_info.append('budget_range')
        if not current_requirement.timeline:
            missing_info.append('timeline')
        if not customer.email:
            missing_info.append('email_address')
        
        # Generate appropriate response based on missing information
        if missing_info:
            if 'project_title' in missing_info:
                response_data['response'] = "Great! Could you give me a brief title or name for your project?"
                response_data['next_step'] = 'project_title'
            elif 'project_type' in missing_info:
                response_data['response'] = """I'd like to understand your project better. What type of solution are you looking for?

• Web Application (websites, web apps, dashboards)
• Mobile Application (iOS/Android apps)
• AI Solution (machine learning, automation)
• Cloud Infrastructure (servers, databases, DevOps)
• Other (please specify)"""
                response_data['next_step'] = 'project_type'
            elif 'budget_range' in missing_info:
                response_data['response'] = """To provide you with the most accurate estimate, what's your budget range for this project?

• Under £3,000
• £3,000 - £10,000
• £10,000 - £35,000
• £35,000+
• Not sure / Need guidance"""
                response_data['next_step'] = 'budget'
            elif 'timeline' in missing_info:
                response_data['response'] = "When would you like to have this project completed? What's your ideal timeline?"
                response_data['next_step'] = 'timeline'
            elif 'email_address' in missing_info:
                response_data['response'] = "Perfect! To send you a detailed proposal, could you please provide your email address?"
                response_data['next_step'] = 'email'
        else:
            # All basic info collected, generate evaluation
            evaluation = self.evaluate_project(current_requirement)
            current_requirement.feasibility_score = evaluation['feasibility_score']
            current_requirement.estimated_days = evaluation['estimated_days']
            current_requirement.estimated_cost = evaluation['estimated_cost']
            current_requirement.ai_evaluation = evaluation['analysis']
            current_requirement.detected_features = evaluation['detected_features']
            current_requirement.complexity_level = evaluation['complexity_level']
            current_requirement.status = 'quote_ready'
            current_requirement.save()
            
            response_data['response'] = f"""Thank you for providing all the details! Based on your requirements, here's my detailed assessment:

**Project:** {current_requirement.project_title or 'Your Project'}
**Type:** {dict(ProjectRequirement.PROJECT_TYPES).get(current_requirement.project_type, 'Custom Solution')}
**Complexity:** {evaluation['complexity_level'].title()}
**Feasibility:** {evaluation['feasibility_score']}/10

**📊 Detailed Estimate:**
• **Development Time:** {evaluation['estimated_days']} working days
• **Estimated Cost:** £{evaluation['estimated_cost']:,.2f}
• **Daily Rate:** £170 per day
• **Key Features:** {', '.join(evaluation['detected_features'][:3])}{'...' if len(evaluation['detected_features']) > 3 else ''}

**💡 What This Includes:**
• Project planning and architecture design
• Full development and implementation  
• Quality testing and bug fixes
• Deployment and launch support
• Documentation and training

{evaluation['analysis']}

A member of our team will contact you within 24 hours at {customer.email} with a comprehensive proposal including:
• Detailed project breakdown
• Timeline with milestones
• Technical specifications
• Support and maintenance options

Is there anything specific about the development process you'd like to know more about?"""
            
            response_data['requirement_complete'] = True
            response_data['quote_ready'] = True
            
            # Send emails when estimate is complete
            try:
                # Send detailed estimate to customer
                if customer.email:
                    customer_email_sent = send_customer_estimate_email(customer, current_requirement, evaluation)
                    if customer_email_sent:
                        logger.info(f"Customer estimate email sent to {customer.email}")
                    else:
                        logger.warning(f"Failed to send customer email to {customer.email}")
                
                # Send notification to admin
                admin_email_sent = send_admin_notification_email(customer, current_requirement, evaluation)
                if admin_email_sent:
                    logger.info("Admin notification email sent successfully")
                else:
                    logger.warning("Failed to send admin notification email")
                    
            except Exception as e:
                logger.error(f"Error sending emails: {str(e)}")
                # Don't fail the response if email sending fails
        
        return response_data
    
    def evaluate_project(self, requirement):
        """Enhanced project evaluation logic with detailed man-day estimation"""
        
        # Base estimates for different project types (in days)
        base_estimates = {
            'web_app': {
                'simple': 15,      # Basic landing page, simple forms
                'medium': 30,      # Full website with CMS, user auth
                'complex': 60,     # E-commerce, advanced features
                'enterprise': 120  # Large-scale applications
            },
            'mobile_app': {
                'simple': 20,      # Basic mobile app, few screens
                'medium': 45,      # Full mobile app with backend
                'complex': 90,     # Complex mobile app with integrations
                'enterprise': 180  # Enterprise mobile solution
            },
            'ai_solution': {
                'simple': 25,      # Basic ML model, simple AI
                'medium': 50,      # Custom AI solution
                'complex': 100,    # Advanced AI with training
                'enterprise': 200  # Enterprise AI platform
            },
            'cloud_infrastructure': {
                'simple': 10,      # Basic cloud setup
                'medium': 25,      # Full cloud architecture
                'complex': 50,     # Advanced cloud with CI/CD
                'enterprise': 100  # Enterprise cloud solution
            },
            'other': {
                'simple': 20,
                'medium': 40,
                'complex': 80,
                'enterprise': 160
            }
        }
        
        project_type = requirement.project_type or 'other'
        description = requirement.description.lower()
        
        # Feature detection with specific day estimates
        feature_estimates = {
            # Authentication & User Management
            'user authentication': 3,
            'login': 2,
            'registration': 2,
            'user profile': 3,
            'user management': 5,
            'role-based access': 4,
            'social login': 3,
            
            # E-commerce Features
            'e-commerce': 25,
            'shopping cart': 5,
            'payment': 7,
            'checkout': 5,
            'inventory': 6,
            'product catalog': 4,
            'order management': 6,
            'stripe': 4,
            'paypal': 3,
            
            # Database & Backend
            'database': 4,
            'api': 6,
            'rest api': 5,
            'graphql': 7,
            'backend': 8,
            'admin panel': 8,
            'cms': 10,
            'content management': 8,
            
            # Frontend Features
            'dashboard': 8,
            'reporting': 6,
            'analytics': 7,
            'charts': 4,
            'data visualization': 6,
            'search': 4,
            'filtering': 3,
            'pagination': 2,
            
            # Real-time Features
            'real-time': 8,
            'chat': 10,
            'messaging': 8,
            'notifications': 5,
            'websocket': 6,
            'live updates': 5,
            
            # Integration Features
            'third-party integration': 6,
            'api integration': 5,
            'social media integration': 4,
            'email integration': 3,
            'calendar integration': 4,
            'crm integration': 7,
            
            # Mobile Specific
            'push notifications': 4,
            'offline mode': 6,
            'camera': 3,
            'gps': 3,
            'maps': 4,
            'geolocation': 3,
            
            # AI/ML Features
            'machine learning': 15,
            'ai': 12,
            'recommendation system': 10,
            'image recognition': 8,
            'natural language processing': 12,
            'chatbot': 8,
            'data analysis': 8,
            
            # Security Features
            'security': 5,
            'encryption': 4,
            'two-factor authentication': 4,
            'oauth': 3,
            'jwt': 2,
            
            # Performance Features
            'optimization': 4,
            'caching': 3,
            'cdn': 2,
            'load balancing': 4,
            'scaling': 5,
            
            # Testing & Deployment
            'testing': 5,
            'deployment': 3,
            'ci/cd': 4,
            'docker': 3,
            'kubernetes': 6,
        }
        
        # Calculate complexity based on detected features
        total_feature_days = 0
        detected_features = []
        
        for feature, days in feature_estimates.items():
            if feature in description:
                total_feature_days += days
                detected_features.append(feature)
        
        # Determine complexity level
        if total_feature_days <= 10:
            complexity = 'simple'
        elif total_feature_days <= 30:
            complexity = 'medium'
        elif total_feature_days <= 60:
            complexity = 'complex'
        else:
            complexity = 'enterprise'
        
        # Get base estimate for project type and complexity
        base_days = base_estimates.get(project_type, base_estimates['other'])[complexity]
        
        # Add feature-specific days
        estimated_days = base_days + total_feature_days
        
        # Additional complexity factors
        complexity_factors = {
            'responsive design': 3,
            'mobile responsive': 3,
            'cross-platform': 5,
            'multi-language': 4,
            'internationalization': 4,
            'scalable': 6,
            'high performance': 5,
            'enterprise': 10,
            'microservices': 8,
            'cloud native': 5,
        }
        
        additional_days = 0
        for factor, days in complexity_factors.items():
            if factor in description:
                additional_days += days
        
        estimated_days += additional_days
        
        # Budget-based adjustments (UK market)
        budget_multipliers = {
            'Under £3,000': 0.7,        # Simplified version
            '£3,000 - £10,000': 0.9,    # Standard version
            '£10,000 - £35,000': 1.1,   # Enhanced version
            '£35,000+': 1.3,            # Premium version
            'Not sure / Need guidance': 1.0
        }
        
        budget_multiplier = budget_multipliers.get(requirement.budget_range, 1.0)
        estimated_days = int(estimated_days * budget_multiplier)
        
        # Calculate cost (£170 per day for UK market)
        daily_rate = 170  # £170 per day
        estimated_cost = estimated_days * daily_rate
        
        # Adjust feasibility based on complexity and timeline
        if estimated_days <= 30:
            feasibility_score = 10
        elif estimated_days <= 60:
            feasibility_score = 9
        elif estimated_days <= 90:
            feasibility_score = 8
        elif estimated_days <= 120:
            feasibility_score = 7
        else:
            feasibility_score = 6
        
        # Generate detailed analysis
        analysis = f"""**Project Analysis:**

**Complexity Level:** {complexity.title()}
**Detected Features:** {', '.join(detected_features[:5])}{'...' if len(detected_features) > 5 else ''}
**Project Type:** {dict(ProjectRequirement.PROJECT_TYPES).get(project_type, 'Custom Solution')}

**Breakdown:**
• Base Development: {base_days} days
• Feature Implementation: {total_feature_days} days
• Additional Complexity: {additional_days} days
• Budget Adjustment: {'+' if budget_multiplier > 1 else ''}{int((budget_multiplier - 1) * 100)}%

**UK Market Pricing:**
• Daily Rate: £170 per day
• Competitive rates using AI-assisted development
• Includes all development phases and support

**Key Considerations:**
• Timeline includes planning, development, testing, and deployment
• Estimates based on UK industry standards and feature complexity
• Final timeline may vary based on specific requirements and team size
• Additional features discovered during planning may affect timeline

**Our Approach:**
We break down development into phases to ensure quality delivery and allow for feedback at each stage."""
        
        return {
            'feasibility_score': feasibility_score,
            'estimated_days': estimated_days,
            'estimated_cost': estimated_cost,
            'analysis': analysis,
            'detected_features': detected_features,
            'complexity_level': complexity
        }


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def list(self, request):
        # Only return customers with requirements (for admin dashboard)
        queryset = self.get_queryset().filter(requirements__isnull=False).distinct()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)


class ProjectRequirementViewSet(viewsets.ModelViewSet):
    queryset = ProjectRequirement.objects.all()
    serializer_class = ProjectRequirementSerializer
    
    def list(self, request):
        queryset = self.get_queryset().order_by('-created_at')
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_agent(self, request, pk=None):
        """Assign a human agent to handle this requirement"""
        requirement = self.get_object()
        agent_name = request.data.get('agent_name')
        agent_notes = request.data.get('agent_notes', '')
        
        requirement.assigned_agent = agent_name
        requirement.agent_notes = agent_notes
        requirement.status = 'quote_ready'
        requirement.save()
        
        serializer = self.get_serializer(requirement)
        return api_response(data=serializer.data, message="Agent assigned successfully")
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update the status of a requirement"""
        requirement = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(ProjectRequirement.STATUS_CHOICES):
            requirement.status = new_status
            requirement.save()
            serializer = self.get_serializer(requirement)
            return api_response(data=serializer.data, message="Status updated successfully")
        
        return api_response(
            message="Invalid status", 
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    
    @action(detail=False, methods=['get'])
    def by_customer(self, request):
        """Get conversation history for a specific customer"""
        session_id = request.query_params.get('session_id')
        if not session_id:
            return api_response(
                message="session_id parameter required", 
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(session_id=session_id)
            conversations = self.get_queryset().filter(customer=customer).order_by('created_at')
            serializer = self.get_serializer(conversations, many=True)
            return api_response(data=serializer.data)
        except Customer.DoesNotExist:
            return api_response(data=[])


@api_view(['GET'])
def dashboard_stats(request):
    """Get dashboard statistics for admin panel"""
    from django.db.models import Count, Q
    from datetime import datetime, timedelta
    
    today = timezone.now()
    last_week = today - timedelta(days=7)
    last_month = today - timedelta(days=30)
    
    stats = {
        'total_customers': Customer.objects.count(),
        'total_requirements': ProjectRequirement.objects.count(),
        'active_conversations': Customer.objects.filter(
            conversations__created_at__gte=last_week
        ).distinct().count(),
        'quotes_pending': ProjectRequirement.objects.filter(
            status='quote_ready'
        ).count(),
        'this_week': {
            'new_customers': Customer.objects.filter(
                created_at__gte=last_week
            ).count(),
            'new_requirements': ProjectRequirement.objects.filter(
                created_at__gte=last_week
            ).count(),
        },
        'this_month': {
            'new_customers': Customer.objects.filter(
                created_at__gte=last_month
            ).count(),
            'new_requirements': ProjectRequirement.objects.filter(
                created_at__gte=last_month
            ).count(),
        },
        'status_breakdown': list(
            ProjectRequirement.objects.values('status').annotate(
                count=Count('id')
            )
        )
    }
    
    return api_response(data=stats)
