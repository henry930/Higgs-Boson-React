# supabase_urls.py
# URL patterns for Supabase-based API endpoints

from django.urls import path
from .supabase_views import (
    HomeDataView, ContactSubmissionView, AIChatView, 
    ChatSessionsView, ChatMessagesView, PageManagementView,
    AllHomeDataView, BenefitsView, ProcessStepsView, TestimonialsView, HeroSlidesView,
    get_home_data, submit_contact_form, ai_chat
)

# New Supabase-based URL patterns
urlpatterns = [
    # Home data
    path('api/home-data/', HomeDataView.as_view(), name='supabase-home-data'),
    path('api/all-home-data/', AllHomeDataView.as_view(), name='supabase-all-home-data'),
    
    # Homepage components
    path('api/benefits/', BenefitsView.as_view(), name='supabase-benefits'),
    path('api/process-steps/', ProcessStepsView.as_view(), name='supabase-process-steps'),
    path('api/testimonials/', TestimonialsView.as_view(), name='supabase-testimonials'),
    path('api/hero-slides/', HeroSlidesView.as_view(), name='supabase-hero-slides'),
    
    # Contact form
    path('api/contact/', ContactSubmissionView.as_view(), name='supabase-contact'),
    path('api/contact-submissions/', ContactSubmissionView.as_view(), name='supabase-contact-list'),
    
    # AI Chat
    path('api/ai-chat/', AIChatView.as_view(), name='supabase-ai-chat'),
    path('api/chat-sessions/', ChatSessionsView.as_view(), name='supabase-chat-sessions'),
    path('api/chat-messages/<str:session_id>/', ChatMessagesView.as_view(), name='supabase-chat-messages'),
    
    # Page management
    path('api/pages/', PageManagementView.as_view(), name='supabase-pages'),
    path('api/pages/<str:slug>/', PageManagementView.as_view(), name='supabase-page-detail'),
    path('api/pages/edit/<int:page_id>/', PageManagementView.as_view(), name='supabase-page-edit'),
    
    # Legacy compatibility endpoints
    path('api/legacy/home-data/', get_home_data, name='legacy-home-data'),
    path('api/legacy/contact/', submit_contact_form, name='legacy-contact'),
    path('api/legacy/ai-chat/', ai_chat, name='legacy-ai-chat'),
]
