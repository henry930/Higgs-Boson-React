from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page
from .serializers import (
    BenefitSerializer, ProcessStepSerializer, TestimonialSerializer,
    HeroSlideSerializer, TeamMemberSerializer, ServiceSerializer,
    PageSerializer, PageListSerializer
)

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
