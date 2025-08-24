from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BenefitViewSet, ProcessStepViewSet, TestimonialViewSet,
    HeroSlideViewSet, TeamMemberViewSet, ServiceViewSet, PageViewSet,
    AICustomerServiceView, CustomerViewSet, ProjectRequirementViewSet,
    ConversationViewSet, dashboard_stats
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

urlpatterns = [
    path('', include(router.urls)),
    
    # AI Customer Service endpoints
    path('ai-chat/', AICustomerServiceView.as_view(), name='ai-chat'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
]
