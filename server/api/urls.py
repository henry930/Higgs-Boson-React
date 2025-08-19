from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BenefitViewSet, ProcessStepViewSet, TestimonialViewSet,
    HeroSlideViewSet, TeamMemberViewSet, ServiceViewSet, PageViewSet
)

router = DefaultRouter()
router.register(r'benefits', BenefitViewSet)
router.register(r'process-steps', ProcessStepViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'hero-slides', HeroSlideViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'pages', PageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
