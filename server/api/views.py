from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
import uuid
import json
import logging

from .models import (
    Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page,
    Customer, ProjectRequirement, Conversation, Quote, Contract, AdminSettings,
    ProjectEstimation, Company, Project, Developer, ProjectCommunication, 
    PaymentTransaction, ProjectMilestone
)
from .serializers import (
    BenefitSerializer, ProcessStepSerializer, TestimonialSerializer,
    HeroSlideSerializer, TeamMemberSerializer, ServiceSerializer,
    PageSerializer, PageListSerializer, CustomerSerializer,
    ConversationSerializer, ProjectRequirementSerializer,
    ProjectRequirementCreateSerializer, QuoteSerializer, ContractSerializer,
    ChatMessageSerializer, ChatResponseSerializer, AdminSettingsSerializer,
    ProjectEstimationSerializer, EstimationConfirmationSerializer
)
from .utils import api_response
from .email_service import send_customer_estimate_email, send_admin_notification_email
from .ai_usage_control import AIUsageController, CustomerTypeDetector
from .estimation_service import ProjectEstimationService

# Import AI services (will gracefully handle if packages not installed)
try:
    from .ai_service import AIServiceManager
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    AIServiceManager = None

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
    """Main AI customer service chat interface with AI integration and usage control"""
    
    def __init__(self):
        super().__init__()
        self.usage_controller = AIUsageController()
        self.customer_detector = CustomerTypeDetector()
        self.ai_service = AIServiceManager() if AI_AVAILABLE else None
        self.estimation_service = ProjectEstimationService()
    
    def post(self, request):
        """Handle incoming chat messages with usage control and AI integration"""
        
        # Get IP address for rate limiting
        ip_address = self.get_client_ip(request)
        
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
        use_ai = data.get('use_ai', True)  # Default to AI (ChatGPT) now
        
        # Check usage limits if AI is requested
        if use_ai and self.ai_service and self.ai_service.client:
            allowed, limit_message = self.usage_controller.check_usage_limits(session_id, ip_address)
            if not allowed:
                return api_response(
                    message=limit_message,
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS
                )
        elif use_ai and not (self.ai_service and self.ai_service.client):
            # AI requested but not available, use rule-based instead
            use_ai = False
        
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
            
            # Generate AI response (with choice between AI and rule-based)
            if use_ai and self.ai_service:
                # Record AI usage
                self.usage_controller.record_usage(session_id, ip_address)
                
                # Get conversation history for AI context
                conversation_history = []
                recent_conversations = Conversation.objects.filter(customer=customer).order_by('-created_at')[:10]
                for conv in reversed(recent_conversations):
                    conversation_history.append({
                        'content': conv.message,
                        'is_user': conv.speaker == 'customer'
                    })
                
                # Get AI response with business context
                ai_response_text = self.ai_service.get_ai_response(conversation_history, message)
                
                # Apply customer type detection and discounts
                customer_type, discount_rate, max_discount = self.customer_detector.detect_customer_type(
                    customer_info, message
                )
                
                ai_response = {
                    'response': ai_response_text,
                    'ai_powered': True,
                    'usage_stats': self.usage_controller.get_usage_stats()
                }
                
                if customer_type:
                    ai_response['customer_type'] = customer_type
                    ai_response['discount_available'] = f"{int(discount_rate * 100)}% discount available for {customer_type.replace('_', ' ').title()}"
                
                # Check for estimation confirmation and handle project estimation
                estimation_result = self.handle_estimation_logic(customer, conversation_history, message, ai_response_text)
                if estimation_result:
                    ai_response.update(estimation_result)
                
            else:
                # Use rule-based system (existing logic)
                ai_response = self.generate_ai_response(customer, message, customer_info)
                ai_response['ai_powered'] = False
                if not self.ai_service or not self.ai_service.client:
                    ai_response['ai_status'] = 'Configuration needed - using enhanced rule-based system'
            
            # Handle estimation addendum if present
            final_response = ai_response['response']
            if 'response_addendum' in ai_response:
                final_response += ai_response['response_addendum']
                ai_response['response'] = final_response
            
            # Save AI response
            Conversation.objects.create(
                customer=customer,
                speaker='ai',
                message=final_response,
                metadata=ai_response.get('metadata', {})
            )
            
            return api_response(data=ai_response)
            
        except Exception as e:
            import traceback
            logger.error(f"Error in AI customer service: {str(e)}")
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return api_response(
                message="Internal server error", 
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_client_ip(self, request):
        """Get client IP address for rate limiting"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def handle_estimation_logic(self, customer, conversation_history, current_message, ai_response_text):
        """Handle project estimation logic and confirmation detection"""
        
        # Check if disclaimers have been shown (look for disclaimers in recent AI messages)
        recent_ai_messages = []
        start_index = max(0, len(conversation_history) - 5)
        for conv in conversation_history[start_index:]:  # Last 5 messages
            if not conv.get('is_user', True):  # AI message
                recent_ai_messages.append(conv['content'].lower())
        
        recent_ai_text = ' '.join(recent_ai_messages)
        disclaimers_shown = 'estimation terms & conditions' in recent_ai_text or 'quote binding' in recent_ai_text
        
        # Check for estimation confirmation keywords in recent customer messages (not just current)
        confirmation_keywords = [
            'sounds good', 'i accept', "let's proceed", 'yes please', 'confirm', 
            'i agree', 'that works', 'perfect', 'go ahead', 'yes', 'okay', 'ok',
            'looks good', 'proceed', 'move forward', 'i understand', 'agree to these terms'
        ]
        
        # Check current message and last 5 customer messages for confirmation
        recent_customer_messages = []
        start_index = max(0, len(conversation_history) - 6)
        for conv in conversation_history[start_index:]:  # Last 6 messages
            if conv.get('is_user', True):  # Customer message
                recent_customer_messages.append(conv['content'].lower())
        recent_customer_messages.append(current_message.lower())
        
        recent_customer_text = ' '.join(recent_customer_messages)
        is_confirmation = any(keyword in recent_customer_text for keyword in confirmation_keywords)
        
        # Check if we recently provided an estimation (look for cost mentions in recent AI responses)
        has_recent_estimate = any(word in recent_ai_text for word in ['£', 'cost', 'estimate', 'price', 'total'])
        
        # If customer wants to proceed but disclaimers haven't been shown, show them first
        if is_confirmation and has_recent_estimate and not disclaimers_shown:
            return {
                'show_disclaimers': True,
                'response_addendum': '''\n\n📋 **Before we proceed, please review these important terms:**

**Estimation Terms & Conditions:**

1. **Quote Binding**: This detailed quote will be binding for our future contract. Once a contract is signed, any appendices, alterations, or clarifications may induce extra costs.

2. **Final Estimation Process**: This estimation is preliminary. Our specialist will contact you for further assessment and send you the final contract to kickstart the project.

3. **Payment Structure**: We require 30% of the total project amount as a deposit. Our project manager will provide weekly progress reports, and customers pay for 5 man-days as installments to keep the project continuing until all bills are settled. Late or non-payment will delay or potentially terminate project progress.

4. **No Extra Charges**: If we need additional man-days for the project beyond our estimate, we will not charge you any extra costs.

✅ **Do you understand and agree to these terms?** If yes, I can proceed with creating your formal estimation.'''
            }
        
        # If customer is confirming and we have a recent estimate, create formal estimation
        if is_confirmation and has_recent_estimate and disclaimers_shown:
            try:
                # Extract project information from conversation
                project_info = self.estimation_service.extract_project_info(conversation_history)
                
                # Check what information is missing
                missing_fields = self.estimation_service.get_missing_fields(project_info)
                
                if missing_fields:
                    # Ask for missing information
                    missing_readable = []
                    field_map = {
                        'project_name': 'project name',
                        'company_name': 'company name',
                        'company_type': 'company type (NGO, Startup, Social Enterprise, Corporate, etc.)',
                        'contact_email': 'contact email',
                        'tech_stack': 'preferred technology stack',
                        'description': 'project description'
                    }
                    
                    for field in missing_fields:
                        missing_readable.append(field_map.get(field, field))
                    
                    return {
                        'estimation_status': 'missing_info',
                        'missing_fields': missing_fields,
                        'response_addendum': f"\n\nTo prepare your formal estimation, I need a few more details:\n• {chr(10).join('• ' + field for field in missing_readable)}\n\nCould you please provide these details?"
                    }
                
                else:
                    # Calculate estimation
                    estimation_data = self.estimation_service.calculate_estimation(project_info)
                    
                    # Create ProjectEstimation record
                    estimation = ProjectEstimation.objects.create(
                        customer=customer,
                        session_id=customer.session_id,
                        project_name=project_info['project_name'],
                        company_name=project_info['company_name'],
                        company_type=project_info.get('company_type', 'other'),
                        description=project_info['description'],
                        tech_stack=project_info['tech_stack'],
                        contact_email=project_info['contact_email'],
                        contact_phone=project_info.get('contact_phone', ''),
                        refer_agent_code=project_info.get('refer_agent_code', ''),
                        breakdown_details=estimation_data['breakdown_details'],
                        total_estimate=estimation_data['total_estimate'],
                        estimated_days=estimation_data['estimated_days'],
                        hourly_rate=estimation_data['hourly_rate'],
                        discount_applied=estimation_data['discount_applied'],
                        special_requirements=project_info.get('special_requirements', ''),
                        timeline_requirements=project_info.get('timeline_requirements', ''),
                        terms_acknowledged=True,
                        terms_acknowledged_at=timezone.now(),
                        conversation_history=[{
                            'content': conv['content'],
                            'is_user': conv.get('is_user', True),
                            'timestamp': timezone.now().isoformat()
                        } for conv in conversation_history]
                    )
                    
                    # Apply company discount if applicable
                    estimation.apply_company_discount()
                    estimation.save()
                    
                    # Generate summary
                    summary = self.estimation_service.generate_estimation_summary(
                        {
                            'estimated_days': estimation.estimated_days,
                            'hourly_rate': estimation.hourly_rate,
                            'total_estimate': estimation.total_estimate,
                            'discount_applied': estimation.discount_applied,
                            'breakdown_details': estimation.breakdown_details,
                            'original_cost': estimation.total_estimate / (1 - estimation.discount_applied / 100) if estimation.discount_applied > 0 else estimation.total_estimate
                        },
                        project_info
                    )
                    
                    # Send notification emails
                    try:
                        send_customer_estimate_email(estimation)
                        send_admin_notification_email(
                            f"New Project Estimation: {estimation.project_name}",
                            f"A new project estimation has been created:\n\n{summary}"
                        )
                    except Exception as e:
                        logger.error(f"Failed to send estimation emails: {str(e)}")
                    
                    return {
                        'estimation_created': True,
                        'estimation_id': estimation.id,
                        'estimation_summary': summary,
                        'response_addendum': f"\n\n✅ **Formal Estimation Created!**\n\nI've prepared your detailed project estimation and saved it to our system. You should receive a copy via email shortly.\n\n**Estimation ID:** {estimation.id}\n**Status:** Pending your confirmation\n\nWould you like to proceed with this estimation?"
                    }
                    
            except Exception as e:
                logger.error(f"Error creating estimation: {str(e)}")
                return {
                    'estimation_error': str(e),
                    'response_addendum': "\n\nI encountered an issue creating your formal estimation. Let me connect you with our team for personalized assistance."
                }
        
        # If mentioning estimation but not confirming, check if we can extract project info
        estimation_keywords = ['estimate', 'quote', 'cost', 'price', 'budget', 'how much']
        if any(keyword in current_message.lower() for keyword in estimation_keywords):
            project_info = self.estimation_service.extract_project_info(conversation_history + [{'content': current_message, 'is_user': True}])
            missing_fields = self.estimation_service.get_missing_fields(project_info)
            
            if len(missing_fields) <= 2:  # If we have most info, suggest creating formal estimation
                return {
                    'estimation_ready': True,
                    'response_addendum': "\n\nBased on our conversation, I have enough information to prepare a detailed project estimation for you. Would you like me to create a formal estimate that we can save to our system?"
                }
        
        return None
    
    def generate_ai_response(self, customer, message, customer_info=None):
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
        
        # Check for customer intent patterns (natural language)
        customer_intents = {
            # Options/Alternatives inquiry
            'options': ['options', 'alternatives', 'choices', 'different ways', 'other approaches', 'what can we do'],
            'recommendations': ['recommend', 'suggest', 'advice', 'what would you', 'best approach', 'your opinion'],
            'cost_comparison': ['cheaper', 'less expensive', 'save money', 'budget options', 'cost difference', 'more affordable'],
            'speed_inquiry': ['faster', 'quicker', 'speed up', 'timeline', 'how long', 'time difference'],
            'quality_inquiry': ['better', 'higher quality', 'more reliable', 'best option', 'premium'],
        }
        
        # Detect customer intent
        detected_intent = None
        message_lower = message.lower()
        for intent, patterns in customer_intents.items():
            if any(pattern in message_lower for pattern in patterns):
                detected_intent = intent
                break
        
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
        
        # Check if customer is asking for options/recommendations
        if detected_intent in ['options', 'recommendations', 'cost_comparison'] and current_requirement:
            if current_requirement.project_type and current_requirement.budget_range:
                # Generate tech stack recommendations
                detected_features = []
                if current_requirement.description:
                    # Extract features from description for better recommendations
                    feature_patterns = ['e-commerce', 'payment', 'login', 'dashboard', 'database', 'api']
                    detected_features = [f for f in feature_patterns if f in current_requirement.description.lower()]
                
                recommendations = self.generate_tech_stack_recommendations(
                    current_requirement.project_type, 
                    current_requirement.budget_range, 
                    detected_features
                )
                
                if recommendations:
                    response_data['response'] = self.format_tech_recommendations_response(recommendations, detected_intent)
                    response_data['next_step'] = 'tech_choice'
                    return response_data
        
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
            
            # Apply customer type discounts
            customer_type, discount_rate, max_discount = self.customer_detector.detect_customer_type(
                customer_info, current_requirement.description or ''
            )
            
            if customer_type and discount_rate > 0:
                discount_info = self.customer_detector.apply_discount(
                    evaluation['estimated_cost'], customer_type, discount_rate, max_discount
                )
                final_cost = discount_info['final_cost']
                savings_message = discount_info['savings_message']
            else:
                final_cost = evaluation['estimated_cost']
                savings_message = ""
            
            current_requirement.feasibility_score = evaluation['feasibility_score']
            current_requirement.estimated_days = evaluation['estimated_days']
            current_requirement.estimated_cost = final_cost  # Save discounted cost
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
• **Base Cost:** £{evaluation['estimated_cost']:,.2f}
{f"• **{savings_message}**" if savings_message else ""}
• **Final Cost:** £{final_cost:,.2f}
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
    
    def generate_tech_stack_recommendations(self, project_type, budget_range, detected_features):
        """Generate tech stack recommendations based on project requirements"""
        
        recommendations = []
        
        if project_type == 'web_app':
            # Budget-based recommendations for web applications
            if budget_range in ['Under £3,000', '£3,000 - £10,000']:
                recommendations = [
                    {
                        'name': 'WordPress + Custom Theme',
                        'description': 'Cost-effective solution using WordPress with custom design',
                        'timeline_days': 15,
                        'cost_estimate': 2550,  # 15 * £170
                        'pros': ['Quick development', 'Easy to maintain', 'Many plugins available'],
                        'cons': ['Limited scalability', 'Performance constraints'],
                        'best_for': 'Small businesses, content-heavy sites'
                    },
                    {
                        'name': 'React + Firebase',
                        'description': 'Modern single-page application with cloud backend',
                        'timeline_days': 25,
                        'cost_estimate': 4250,  # 25 * £170
                        'pros': ['Fast performance', 'Real-time features', 'Automatic scaling'],
                        'cons': ['Vendor lock-in', 'Learning curve for updates'],
                        'best_for': 'Startups, interactive applications'
                    }
                ]
            
            elif budget_range in ['£10,000 - £35,000', '£35,000+']:
                recommendations = [
                    {
                        'name': 'React + Node.js + PostgreSQL',
                        'description': 'Full-stack JavaScript solution with robust database',
                        'timeline_days': 45,
                        'cost_estimate': 7650,  # 45 * £170
                        'pros': ['Highly scalable', 'Great performance', 'Large talent pool'],
                        'cons': ['More complex setup', 'Requires DevOps knowledge'],
                        'best_for': 'Growing businesses, complex applications'
                    },
                    {
                        'name': 'Vue.js + Django + PostgreSQL',
                        'description': 'Python-powered backend with modern frontend',
                        'timeline_days': 40,
                        'cost_estimate': 6800,  # 40 * £170
                        'pros': ['Rapid development', 'Strong security', 'Admin panel included'],
                        'cons': ['Fewer JavaScript developers', 'Two different languages'],
                        'best_for': 'Data-heavy applications, admin-intensive systems'
                    },
                    {
                        'name': 'Next.js + Supabase',
                        'description': 'Modern full-stack with integrated backend services',
                        'timeline_days': 35,
                        'cost_estimate': 5950,  # 35 * £170
                        'pros': ['Very fast development', 'Built-in authentication', 'Excellent SEO'],
                        'cons': ['Newer ecosystem', 'Less customization'],
                        'best_for': 'Modern web apps, content + database needs'
                    }
                ]
        
        elif project_type == 'mobile_app':
            if budget_range in ['Under £3,000', '£3,000 - £10,000']:
                recommendations = [
                    {
                        'name': 'React Native',
                        'description': 'Cross-platform mobile app (iOS + Android)',
                        'timeline_days': 35,
                        'cost_estimate': 5950,
                        'pros': ['One codebase for both platforms', 'Faster development', 'Web developer friendly'],
                        'cons': ['Performance limitations', 'Platform-specific features harder'],
                        'best_for': 'Budget-conscious projects, simple to medium complexity'
                    }
                ]
            else:
                recommendations = [
                    {
                        'name': 'React Native + Backend API',
                        'description': 'Cross-platform mobile with custom backend',
                        'timeline_days': 55,
                        'cost_estimate': 9350,
                        'pros': ['Full control', 'Scalable', 'Rich features'],
                        'cons': ['More complex', 'Longer development time'],
                        'best_for': 'Complex apps, user accounts, real-time features'
                    },
                    {
                        'name': 'Flutter + Firebase',
                        'description': 'Google\'s cross-platform solution with cloud backend',
                        'timeline_days': 50,
                        'cost_estimate': 8500,
                        'pros': ['Excellent performance', 'Beautiful UI', 'Growing ecosystem'],
                        'cons': ['Dart language learning curve', 'Newer technology'],
                        'best_for': 'High-performance apps, custom animations'
                    }
                ]
        
        return recommendations
    
    def format_tech_recommendations_response(self, recommendations, detected_intent):
        """Format tech stack recommendations into customer-friendly response"""
        
        if detected_intent == 'cost_comparison':
            intro = "Here are different approaches to build your project, organized by cost:\n\n"
        elif detected_intent == 'speed_inquiry':
            intro = "Here are your options organized by development speed:\n\n"
        else:
            intro = "Based on your requirements, here are the recommended approaches:\n\n"
        
        response = intro
        
        for i, rec in enumerate(recommendations, 1):
            response += f"**Option {i}: {rec['name']}**\n"
            response += f"💰 **Cost:** £{rec['cost_estimate']:,} ({rec['timeline_days']} days)\n"
            response += f"📝 **What it is:** {rec['description']}\n\n"
            
            response += f"✅ **Advantages:**\n"
            for pro in rec['pros']:
                response += f"• {pro}\n"
            
            response += f"\n⚠️ **Considerations:**\n"
            for con in rec['cons']:
                response += f"• {con}\n"
            
            response += f"\n🎯 **Best for:** {rec['best_for']}\n\n"
            response += "─" * 50 + "\n\n"
        
        response += "**💡 My Recommendation:**\n"
        if len(recommendations) > 0:
            best_option = recommendations[0]  # First option is usually best value
            response += f"For your budget and requirements, I'd recommend **{best_option['name']}**. "
            response += f"It offers the best balance of cost (£{best_option['cost_estimate']:,}), "
            response += f"timeline ({best_option['timeline_days']} days), and features.\n\n"
        
        response += "Would you like me to explain any of these options in more detail, or shall we proceed with a full quote for your preferred approach?"
        
        return response

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


class AdminSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing admin settings"""
    queryset = AdminSettings.objects.all()
    serializer_class = AdminSettingsSerializer
    
    def list(self, request):
        """Get current admin settings"""
        settings = AdminSettings.get_settings()
        serializer = self.get_serializer(settings)
        return api_response(data=serializer.data)
    
    def update(self, request, pk=None):
        """Update admin settings"""
        settings = AdminSettings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return api_response(
                data=serializer.data,
                message="Admin settings updated successfully"
            )
        return api_response(
            data=serializer.errors,
            message="Validation failed",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ProjectEstimationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing project estimations"""
    queryset = ProjectEstimation.objects.all()
    serializer_class = ProjectEstimationSerializer
    
    def get_queryset(self):
        """Filter estimations by session_id if provided"""
        queryset = super().get_queryset()
        session_id = self.request.query_params.get('session_id')
        if session_id:
            queryset = queryset.filter(session_id=session_id)
        return queryset.order_by('-created_at')
    
    def list(self, request):
        """List estimations with optional filtering"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get specific estimation"""
        estimation = get_object_or_404(ProjectEstimation, pk=pk)
        serializer = self.get_serializer(estimation)
        return api_response(data=serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an estimation"""
        estimation = get_object_or_404(ProjectEstimation, pk=pk)
        serializer = EstimationConfirmationSerializer(data=request.data)
        
        if serializer.is_valid():
            confirmed = serializer.validated_data['confirmed']
            customer_notes = serializer.validated_data.get('customer_notes', '')
            
            if confirmed:
                estimation.status = 'confirmed'
                estimation.confirmed_at = timezone.now()
                estimation.save()
                
                # Send confirmation email
                try:
                    send_customer_estimate_email(estimation, confirmed=True)
                    send_admin_notification_email(
                        f"Project Estimation Confirmed: {estimation.project_name}",
                        f"Customer {estimation.contact_email} has confirmed the estimation for {estimation.project_name}.\n"
                        f"Total: £{estimation.total_estimate}\n"
                        f"Customer notes: {customer_notes}"
                    )
                except Exception as e:
                    logger.error(f"Failed to send confirmation emails: {str(e)}")
                
                return api_response(
                    data=self.get_serializer(estimation).data,
                    message="Estimation confirmed successfully"
                )
            else:
                estimation.status = 'revised'
                estimation.save()
                return api_response(
                    data=self.get_serializer(estimation).data,
                    message="Estimation marked for revision"
                )
        
        return api_response(
            data=serializer.errors,
            message="Invalid confirmation data",
            status_code=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def test_email(request):
    """Test email functionality"""
    from .email_service import send_test_email
    
    recipient = request.data.get('email')
    if not recipient:
        return api_response(
            message="Email address is required",
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        success = send_test_email(recipient)
        if success:
            return api_response(message=f"Test email sent successfully to {recipient}")
        else:
            return api_response(
                message="Failed to send test email",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except Exception as e:
        return api_response(
            message=f"Error sending test email: {str(e)}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class AIUsageStatsView(APIView):
    """Monitor AI usage and costs"""
    
    def get(self, request):
        """Get AI usage statistics"""
        usage_controller = AIUsageController()
        stats = usage_controller.get_usage_stats()
        
        # Add additional monitoring data
        stats.update({
            'ai_service_available': AI_AVAILABLE,
            'daily_rate': 170,
            'current_month': timezone.now().strftime('%B %Y')
        })
        
        return api_response(data=stats)


class AIConfigurationView(APIView):
    """Configure AI service settings"""
    
    def get(self, request):
        """Get current AI configuration"""
        if not AI_AVAILABLE:
            return api_response(
                message="AI service not available",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        ai_service = AIServiceManager()
        config = ai_service.business_config
        
        return api_response(data=config)
    
    def post(self, request):
        """Update AI configuration"""
        if not AI_AVAILABLE:
            return api_response(
                message="AI service not available",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        ai_service = AIServiceManager()
        updated_config = ai_service.update_business_config(request.data)
        
        return api_response(data=updated_config, message="AI configuration updated successfully")


# Company Authentication Views
class CompanyRegistrationView(APIView):
    """Company registration endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Register a new company"""
        try:
            data = request.data
            
            # Check if company already exists
            if Company.objects.filter(email=data.get('email')).exists():
                return api_response(
                    message="Company with this email already exists",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            if Company.objects.filter(company_name=data.get('company_name')).exists():
                return api_response(
                    message="Company with this name already exists", 
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Create new company
            company = Company.objects.create_user(
                username=data.get('email'),  # Use email as username
                email=data.get('email'),
                password=data.get('password'),
                company_name=data.get('company_name'),
                contact_email=data.get('email'),
                phone=data.get('phone', ''),
                company_type=data.get('company_type', 'other'),
                billing_address=data.get('billing_address', ''),
                website=data.get('website', ''),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
            )
            
            # Generate verification token
            verification_token = company.generate_verification_token()
            
            # Send verification email (implement as needed)
            try:
                send_mail(
                    subject='Verify Your Company Account',
                    message=f'Please verify your account using this token: {verification_token}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[company.email],
                    fail_silently=False,
                )
            except Exception as e:
                logging.warning(f"Could not send verification email: {e}")
            
            # Generate auth token
            token, created = Token.objects.get_or_create(user=company)
            
            return api_response(data={
                'company_id': company.id,
                'company_name': company.company_name,
                'email': company.email,
                'token': token.key,
                'verification_required': True,
                'message': 'Company registered successfully. Please check your email for verification.'
            })
            
        except Exception as e:
            logging.error(f"Company registration error: {e}")
            return api_response(
                message="Registration failed. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompanyLoginView(APIView):
    """Company login endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Authenticate company user"""
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            # Authenticate user
            user = authenticate(username=email, password=password)
            
            if user and isinstance(user, Company):
                if user.is_active:
                    # Get or create token
                    token, created = Token.objects.get_or_create(user=user)
                    
                    # Update last login
                    user.last_login_date = timezone.now()
                    user.save()
                    
                    return api_response(data={
                        'company_id': user.id,
                        'company_name': user.company_name,
                        'email': user.email,
                        'token': token.key,
                        'is_verified': user.is_verified,
                        'subscription_plan': user.subscription_plan,
                        'message': 'Login successful'
                    })
                else:
                    return api_response(
                        message="Account is disabled",
                        status_code=status.HTTP_401_UNAUTHORIZED
                    )
            else:
                return api_response(
                    message="Invalid email or password",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logging.error(f"Company login error: {e}")
            return api_response(
                message="Login failed. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompanyVerificationView(APIView):
    """Company account verification endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Verify company account with token"""
        try:
            token = request.data.get('token')
            
            if not token:
                return api_response(
                    message="Verification token is required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Find company with this token
            try:
                company = Company.objects.get(verification_token=token)
                
                if company.is_verified:
                    return api_response(
                        message="Account is already verified",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                
                # Verify the account
                company.is_verified = True
                company.verification_date = timezone.now()
                company.verification_token = ''  # Clear the token
                company.save()
                
                return api_response(data={
                    'company_id': company.id,
                    'company_name': company.company_name,
                    'message': 'Account verified successfully'
                })
                
            except Company.DoesNotExist:
                return api_response(
                    message="Invalid verification token",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logging.error(f"Company verification error: {e}")
            return api_response(
                message="Verification failed. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompanyDashboardView(APIView):
    """Company dashboard data endpoint"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get company dashboard data"""
        try:
            company = request.user
            
            if not isinstance(company, Company):
                return api_response(
                    message="Access denied. Company account required.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            # Get company projects
            projects = Project.objects.filter(company=company).order_by('-created_at')
            
            # Calculate statistics
            total_projects = projects.count()
            active_projects = projects.filter(status__in=['planning', 'development', 'testing']).count()
            completed_projects = projects.filter(status='completed').count()
            total_spent = sum(project.paid_amount for project in projects)
            pending_payments = sum(project.total_budget - project.paid_amount for project in projects)
            
            # Recent activity (last 5 projects)
            recent_projects = projects[:5]
            
            # Get pending estimations
            pending_estimations = ProjectEstimation.objects.filter(
                company=company,
                status='pending_approval'
            ).order_by('-created_at')
            
            return api_response(data={
                'company_info': {
                    'name': company.company_name,
                    'email': company.email,
                    'company_type': company.company_type,
                    'subscription_plan': company.subscription_plan,
                    'is_verified': company.is_verified,
                },
                'statistics': {
                    'total_projects': total_projects,
                    'active_projects': active_projects,
                    'completed_projects': completed_projects,
                    'total_spent': float(total_spent),
                    'pending_payments': float(pending_payments),
                },
                'recent_projects': [
                    {
                        'id': project.id,
                        'name': project.project_name,
                        'status': project.status,
                        'progress': project.progress_percentage,
                        'budget': float(project.total_budget),
                        'created_at': project.created_at.isoformat(),
                    } for project in recent_projects
                ],
                'pending_estimations': [
                    {
                        'id': estimation.id,
                        'project_type': estimation.project_type,
                        'estimated_cost': float(estimation.total_estimate),
                        'created_at': estimation.created_at.isoformat(),
                    } for estimation in pending_estimations
                ]
            })
            
        except Exception as e:
            logging.error(f"Company dashboard error: {e}")
            return api_response(
                message="Failed to load dashboard data",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
