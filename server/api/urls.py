from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BenefitViewSet, ProcessStepViewSet, TestimonialViewSet,
    HeroSlideViewSet, TeamMemberViewSet, ServiceViewSet, PageViewSet,
    AICustomerServiceView, CustomerViewSet, ProjectRequirementViewSet,
    ConversationViewSet, AdminSettingsViewSet, ProjectEstimationViewSet,
    dashboard_stats, test_email, AIUsageStatsView, AIConfigurationView,
    CompanyRegistrationView, CompanyLoginView, CompanyVerificationView,
    CompanyDashboardView
)
from .dashboard_views import DashboardViewSet
from .auth_views import login_view, register_view, logout_view, user_profile

router = DefaultRouter()
router.register(r'benefits', BenefitViewSet)
router.register(r'process-steps', ProcessStepViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'hero-slides', HeroSlideViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'pages', PageViewSet)

# AI Customer Service endpoints
router.register(r'customers', CustomerViewSet)
router.register(r'requirements', ProjectRequirementViewSet)
router.register(r'conversations', ConversationViewSet)
router.register(r'admin-settings', AdminSettingsViewSet)
router.register(r'estimations', ProjectEstimationViewSet)

# Dashboard endpoints
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/login/', login_view, name='auth-login'),
    path('auth/register/', register_view, name='auth-register'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('auth/profile/', user_profile, name='auth-profile'),
    
    # AI Customer Service endpoints
    path('ai-chat/', AICustomerServiceView.as_view(), name='ai-chat'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('test-email/', test_email, name='test-email'),
    
    # AI Management endpoints
    path('ai/usage-stats/', AIUsageStatsView.as_view(), name='ai-usage-stats'),
    path('ai/configuration/', AIConfigurationView.as_view(), name='ai-configuration'),
    
    # Company Authentication endpoints
    path('company/register/', CompanyRegistrationView.as_view(), name='company-register'),
    path('company/login/', CompanyLoginView.as_view(), name='company-login'),
    path('company/verify/', CompanyVerificationView.as_view(), name='company-verify'),
    path('company/dashboard/', CompanyDashboardView.as_view(), name='company-dashboard'),
]
