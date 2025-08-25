from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BenefitViewSet, ProcessStepViewSet, TestimonialViewSet,
    HeroSlideViewSet, TeamMemberViewSet, ServiceViewSet, PageViewSet,
    AICustomerServiceView, CustomerViewSet, ProjectRequirementViewSet,
    ConversationViewSet, AdminSettingsViewSet, ProjectEstimationViewSet,
    dashboard_stats, test_email, AIUsageStatsView, AIConfigurationView
)

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

urlpatterns = [
    path('', include(router.urls)),
    
    # AI Customer Service endpoints
    path('ai-chat/', AICustomerServiceView.as_view(), name='ai-chat'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('test-email/', test_email, name='test-email'),
    
    # AI Management endpoints
    path('ai/usage-stats/', AIUsageStatsView.as_view(), name='ai-usage-stats'),
    path('ai/configuration/', AIConfigurationView.as_view(), name='ai-configuration'),
]
