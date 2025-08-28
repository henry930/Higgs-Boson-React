# supabase_views.py
# API views using Supabase instead of Django ORM

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
import json
import logging
from datetime import datetime
from typing import Dict, Any

from .supabase_service import supabase_service
from .utils import api_response
from .ai_service import AIServiceManager
from .email_service import send_customer_estimate_email, send_admin_notification_email

logger = logging.getLogger(__name__)

class SupabaseAPIView(APIView):
    """Base class for Supabase-based API views"""
    
    def handle_exception(self, exc):
        logger.error(f"API Error: {exc}")
        return api_response(
            message=str(exc),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class HomeDataView(SupabaseAPIView):
    """Provide home page data from Supabase"""
    
    def get(self, request):
        try:
            # Get home page content from Supabase
            home_page = supabase_service.get_page_by_slug('home')
            
            if home_page and home_page.get('content'):
                try:
                    content = json.loads(home_page['content'])
                    return api_response(data=content)
                except json.JSONDecodeError:
                    pass
            
            # Fallback data if no content in database
            fallback_data = {
                "hero": {
                    "title": "Higgs Boson Consultancy",
                    "subtitle": "Expert AI consulting services for modern businesses",
                    "description": "We provide cutting-edge AI solutions and strategic insights to help your business thrive in today's competitive landscape."
                },
                "benefits": [
                    {
                        "title": "Expert AI Consultation",
                        "description": "Get professional advice from AI industry experts",
                        "icon": "brain"
                    },
                    {
                        "title": "Custom AI Solutions",
                        "description": "Tailored AI strategies for your specific business needs",
                        "icon": "cog"
                    },
                    {
                        "title": "Proven AI Results",
                        "description": "Track record of successful AI implementations",
                        "icon": "chart"
                    }
                ],
                "testimonials": [
                    {
                        "name": "Sarah Johnson",
                        "company": "TechStart Inc.",
                        "content": "Their AI solutions transformed our business operations completely.",
                        "rating": 5
                    }
                ]
            }
            
            return api_response(data=fallback_data)
            
        except Exception as e:
            return self.handle_exception(e)

class ContactSubmissionView(SupabaseAPIView):
    """Handle contact form submissions via Supabase"""
    
    def post(self, request):
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if not data.get(field):
                    return api_response(
                        message=f"Field '{field}' is required",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
            
            # Prepare submission data
            submission_data = {
                'name': data['name'],
                'email': data['email'],
                'subject': data.get('subject', 'Contact Form Submission'),
                'message': data['message']
            }
            
            # Save to Supabase
            result = supabase_service.create_contact_submission(submission_data)
            
            # Send notification emails
            try:
                send_customer_estimate_email(
                    customer_email=data['email'],
                    customer_name=data['name'],
                    message=data['message']
                )
                send_admin_notification_email(
                    subject=f"New Contact Form Submission from {data['name']}",
                    message=f"Name: {data['name']}\nEmail: {data['email']}\nMessage: {data['message']}"
                )
            except Exception as email_error:
                logger.warning(f"Email sending failed: {email_error}")
            
            return api_response(
                data=result,
                message="Contact form submitted successfully",
                status_code=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return self.handle_exception(e)
    
    def get(self, request):
        """Get contact submissions for admin"""
        try:
            submissions = supabase_service.get_contact_submissions(limit=100)
            return api_response(data=submissions)
        except Exception as e:
            return self.handle_exception(e)

class AIChatView(SupabaseAPIView):
    """Handle AI chat conversations via Supabase"""
    
    def post(self, request):
        try:
            data = request.data
            session_id = data.get('session_id')
            message = data.get('message')
            customer_info = data.get('customer_info', {})
            
            if not session_id or not message:
                return api_response(
                    message="session_id and message are required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create chat session
            session = supabase_service.get_chat_session(session_id)
            if not session:
                session_data = {
                    'session_id': session_id,
                    'status': 'active'
                }
                session = supabase_service.create_chat_session(session_data)
            
            # Save customer message
            message_data = {
                'session_id': session_id,
                'speaker': 'customer',
                'message': message
            }
            supabase_service.save_chat_message(message_data)
            
            # Generate AI response
            try:
                if hasattr(AIServiceManager, 'generate_chat_response'):
                    ai_response = AIServiceManager.generate_chat_response(
                        message=message,
                        session_id=session_id,
                        customer_info=customer_info
                    )
                else:
                    # Fallback AI response
                    ai_response = {
                        'response': "Thank you for your message. Our team will get back to you soon. Could you please provide more details about your project requirements?",
                        'next_step': 'collect_requirements'
                    }
                
                # Save AI response
                ai_message_data = {
                    'session_id': session_id,
                    'speaker': 'ai',
                    'message': ai_response.get('response', '')
                }
                supabase_service.save_chat_message(ai_message_data)
                
                # Update session with customer info if provided
                if customer_info:
                    update_data = {}
                    if customer_info.get('name'):
                        update_data['customer_name'] = customer_info['name']
                    if customer_info.get('email'):
                        update_data['customer_email'] = customer_info['email']
                    if customer_info.get('company'):
                        update_data['customer_company'] = customer_info['company']
                    if customer_info.get('phone'):
                        update_data['customer_phone'] = customer_info['phone']
                    
                    if update_data:
                        supabase_service.update_chat_session(session_id, update_data)
                
                return api_response(data=ai_response)
                
            except Exception as ai_error:
                logger.error(f"AI service error: {ai_error}")
                fallback_response = {
                    'response': "I'm experiencing some technical difficulties. Please try again or contact our support team directly.",
                    'next_step': 'fallback'
                }
                return api_response(data=fallback_response)
            
        except Exception as e:
            return self.handle_exception(e)

class ChatSessionsView(SupabaseAPIView):
    """Get chat sessions for admin dashboard"""
    
    def get(self, request):
        try:
            sessions = supabase_service.get_all_chat_sessions(limit=100)
            return api_response(data=sessions)
        except Exception as e:
            return self.handle_exception(e)

class ChatMessagesView(SupabaseAPIView):
    """Get messages for a specific chat session"""
    
    def get(self, request, session_id):
        try:
            messages = supabase_service.get_chat_messages(session_id)
            return api_response(data=messages)
        except Exception as e:
            return self.handle_exception(e)

class PageManagementView(SupabaseAPIView):
    """Manage pages via Supabase"""
    
    def get(self, request, slug=None):
        try:
            if slug:
                page = supabase_service.get_page_by_slug(slug)
                if not page:
                    return api_response(
                        message="Page not found",
                        status_code=status.HTTP_404_NOT_FOUND
                    )
                return api_response(data=page)
            else:
                pages = supabase_service.get_pages()
                return api_response(data=pages)
        except Exception as e:
            return self.handle_exception(e)
    
    def post(self, request):
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['title', 'slug']
            for field in required_fields:
                if not data.get(field):
                    return api_response(
                        message=f"Field '{field}' is required",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
            
            page = supabase_service.create_page(data)
            return api_response(
                data=page,
                message="Page created successfully",
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return self.handle_exception(e)
    
    def put(self, request, page_id):
        try:
            data = request.data
            page = supabase_service.update_page(page_id, data)
            return api_response(
                data=page,
                message="Page updated successfully"
            )
        except Exception as e:
            return self.handle_exception(e)

# Legacy API compatibility functions
class AllHomeDataView(SupabaseAPIView):
    """Get all homepage data (benefits, process_steps, testimonials, hero_slides)"""
    
    def get(self, request):
        try:
            home_data = supabase_service.get_home_data()
            return api_response(data=home_data)
        except Exception as e:
            logger.error(f"Error fetching all home data: {e}")
            return api_response(
                message=f"Error fetching home data: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class BenefitsView(SupabaseAPIView):
    """Get benefits data"""
    
    def get(self, request):
        try:
            benefits = supabase_service.get_benefits()
            return api_response(data=benefits)
        except Exception as e:
            logger.error(f"Error fetching benefits: {e}")
            return api_response(
                message=f"Error fetching benefits: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProcessStepsView(SupabaseAPIView):
    """Get process steps data"""
    
    def get(self, request):
        try:
            process_steps = supabase_service.get_process_steps()
            return api_response(data=process_steps)
        except Exception as e:
            logger.error(f"Error fetching process steps: {e}")
            return api_response(
                message=f"Error fetching process steps: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TestimonialsView(SupabaseAPIView):
    """Get testimonials data"""
    
    def get(self, request):
        try:
            featured_only = request.GET.get('featured', 'false').lower() == 'true'
            testimonials = supabase_service.get_testimonials(featured_only=featured_only)
            return api_response(data=testimonials)
        except Exception as e:
            logger.error(f"Error fetching testimonials: {e}")
            return api_response(
                message=f"Error fetching testimonials: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class HeroSlidesView(SupabaseAPIView):
    """Get hero slides data"""
    
    def get(self, request):
        try:
            active_only = request.GET.get('active', 'true').lower() == 'true'
            hero_slides = supabase_service.get_hero_slides(active_only=active_only)
            return api_response(data=hero_slides)
        except Exception as e:
            logger.error(f"Error fetching hero slides: {e}")
            return api_response(
                message=f"Error fetching hero slides: {str(e)}",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Legacy API endpoints for backward compatibility
@api_view(['GET'])
def get_home_data(request):
    """Legacy home data endpoint"""
    view = HomeDataView()
    return view.get(request)

@api_view(['POST'])
def submit_contact_form(request):
    """Legacy contact form endpoint"""
    view = ContactSubmissionView()
    return view.post(request)

@api_view(['POST'])
def ai_chat(request):
    """Legacy AI chat endpoint"""
    view = AIChatView()
    return view.post(request)
