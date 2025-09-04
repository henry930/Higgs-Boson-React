from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta
from .models import (
    Customer, ProjectRequirement, Conversation, Quote, 
    ProjectEstimation, AdminSettings
)
from .serializers import (
    CustomerSerializer, ProjectRequirementSerializer, 
    ConversationSerializer, QuoteSerializer,
    ProjectEstimationSerializer, AdminSettingsSerializer
)

class DashboardViewSet(viewsets.ViewSet):
    """
    User Dashboard API for managing projects and customers
    """
    permission_classes = [IsAuthenticated]  # Require authentication
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get dashboard overview statistics"""
        try:
            stats = {
                'total_customers': Customer.objects.count(),
                'total_projects': ProjectRequirement.objects.count(),
                'active_projects': ProjectRequirement.objects.filter(
                    status__in=['gathering', 'evaluating', 'in_progress']
                ).count(),
                'completed_projects': ProjectRequirement.objects.filter(
                    status='completed'
                ).count(),
                'total_estimations': ProjectEstimation.objects.count(),
                'pending_estimations': ProjectEstimation.objects.filter(
                    status='pending'
                ).count(),
                'total_revenue': ProjectEstimation.objects.filter(
                    status='confirmed'
                ).aggregate(
                    total=models.Sum('total_estimate')
                )['total'] or 0,
                'recent_conversations': Conversation.objects.count()
            }
            
            # Recent activity
            recent_projects = ProjectRequirement.objects.order_by('-created_at')[:5]
            recent_customers = Customer.objects.order_by('-created_at')[:5]
            
            return Response({
                'stats': stats,
                'recent_projects': ProjectRequirementSerializer(recent_projects, many=True).data,
                'recent_customers': CustomerSerializer(recent_customers, many=True).data
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def projects(self, request):
        """Get all projects with filtering options"""
        queryset = ProjectRequirement.objects.all()
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        priority_filter = request.query_params.get('priority')
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        project_type_filter = request.query_params.get('project_type')
        if project_type_filter:
            queryset = queryset.filter(project_type=project_type_filter)
        
        # Order by creation date
        queryset = queryset.order_by('-created_at')
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = queryset.count()
        projects = queryset[start:end]
        
        return Response({
            'results': ProjectRequirementSerializer(projects, many=True).data,
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size
        })
    
    @action(detail=False, methods=['get'])
    def customers(self, request):
        """Get all customers with search and filtering"""
        queryset = Customer.objects.all()
        
        # Search by name, email, or company
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(company__icontains=search)
            )
        
        # Order by creation date
        queryset = queryset.order_by('-created_at')
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = queryset.count()
        customers = queryset[start:end]
        
        return Response({
            'results': CustomerSerializer(customers, many=True).data,
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size
        })
    
    @action(detail=False, methods=['get'])
    def estimations(self, request):
        """Get project estimations with filtering"""
        queryset = ProjectEstimation.objects.all()
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        company_type_filter = request.query_params.get('company_type')
        if company_type_filter:
            queryset = queryset.filter(company_type=company_type_filter)
        
        # Order by creation date
        queryset = queryset.order_by('-created_at')
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = queryset.count()
        estimations = queryset[start:end]
        
        return Response({
            'results': ProjectEstimationSerializer(estimations, many=True).data,
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size
        })
    
    @action(detail=True, methods=['get'])
    def project_detail(self, request, pk=None):
        """Get detailed project information including conversations"""
        try:
            project = get_object_or_404(ProjectRequirement, pk=pk)
            conversations = Conversation.objects.filter(requirement=project).order_by('created_at')
            quotes = Quote.objects.filter(requirement=project).order_by('-created_at')
            
            return Response({
                'project': ProjectRequirementSerializer(project).data,
                'conversations': ConversationSerializer(conversations, many=True).data,
                'quotes': QuoteSerializer(quotes, many=True).data,
                'customer': CustomerSerializer(project.customer).data
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['patch'])
    def update_project_status(self, request, pk=None):
        """Update project status"""
        try:
            project = get_object_or_404(ProjectRequirement, pk=pk)
            new_status = request.data.get('status')
            
            if new_status not in dict(ProjectRequirement.STATUS_CHOICES):
                return Response(
                    {'error': 'Invalid status'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            project.status = new_status
            project.save()
            
            return Response({
                'message': 'Project status updated successfully',
                'project': ProjectRequirementSerializer(project).data
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get analytics data for charts and reports"""
        try:
            # Project status distribution
            status_distribution = {}
            for status_code, status_label in ProjectRequirement.STATUS_CHOICES:
                count = ProjectRequirement.objects.filter(status=status_code).count()
                status_distribution[status_label] = count
            
            # Project type distribution
            type_distribution = {}
            for type_code, type_label in ProjectRequirement.PROJECT_TYPES:
                count = ProjectRequirement.objects.filter(project_type=type_code).count()
                type_distribution[type_label] = count
            
            # Monthly revenue trend (last 6 months)
            from django.utils import timezone
            from datetime import timedelta
            import calendar
            
            revenue_trend = []
            for i in range(6):
                month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
                month_end = month_start + timedelta(days=calendar.monthrange(month_start.year, month_start.month)[1] - 1)
                
                revenue = ProjectEstimation.objects.filter(
                    status='confirmed',
                    confirmed_at__range=[month_start, month_end]
                ).aggregate(
                    total=models.Sum('total_estimate')
                )['total'] or 0
                
                revenue_trend.append({
                    'month': month_start.strftime('%Y-%m'),
                    'revenue': float(revenue)
                })
            
            revenue_trend.reverse()  # Most recent first
            
            return Response({
                'status_distribution': status_distribution,
                'type_distribution': type_distribution,
                'revenue_trend': revenue_trend
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerViewSet(viewsets.ModelViewSet):
    """CRUD operations for customers"""
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def get_queryset(self):
        queryset = Customer.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(company__icontains=search)
            )
        return queryset.order_by('-created_at')


class ProjectRequirementViewSet(viewsets.ModelViewSet):
    """CRUD operations for project requirements"""
    queryset = ProjectRequirement.objects.all()
    serializer_class = ProjectRequirementSerializer
    
    def get_queryset(self):
        queryset = ProjectRequirement.objects.all()
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        priority_filter = self.request.query_params.get('priority')
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        return queryset.order_by('-created_at')


class ProjectEstimationViewSet(viewsets.ModelViewSet):
    """CRUD operations for project estimations"""
    queryset = ProjectEstimation.objects.all()
    serializer_class = ProjectEstimationSerializer
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a project estimation"""
        try:
            estimation = get_object_or_404(ProjectEstimation, pk=pk)
            estimation.status = 'confirmed'
            estimation.confirmed_at = timezone.now()
            estimation.save()
            
            return Response({
                'message': 'Estimation confirmed successfully',
                'estimation': ProjectEstimationSerializer(estimation).data
            })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
