from rest_framework import serializers
from .models import (
    Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page,
    Customer, ProjectRequirement, Conversation, Quote, Contract, AdminSettings,
    ProjectEstimation
)

class BenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Benefit
        fields = '__all__'

class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ['view_count', 'created_at', 'updated_at']

class PageListSerializer(serializers.ModelSerializer):
    """Serializer for page list view (without full content)"""
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'meta_title', 'meta_description', 
                 'published', 'featured', 'author_name', 'excerpt', 'tags',
                 'view_count', 'created_at', 'updated_at']


# AI Customer Service Serializers
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'
        read_only_fields = ['created_at']


class ProjectRequirementSerializer(serializers.ModelSerializer):
    conversations = ConversationSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    
    class Meta:
        model = ProjectRequirement
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProjectRequirementCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating requirements"""
    class Meta:
        model = ProjectRequirement
        fields = ['project_title', 'project_type', 'description', 'budget_range', 
                 'timeline', 'priority', 'status']


class QuoteSerializer(serializers.ModelSerializer):
    requirement = ProjectRequirementSerializer(read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ContractSerializer(serializers.ModelSerializer):
    quote = QuoteSerializer(read_only=True)
    
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# Chat Interface Serializers
class ChatMessageSerializer(serializers.Serializer):
    """Serializer for incoming chat messages"""
    session_id = serializers.CharField(max_length=100)
    message = serializers.CharField()
    customer_info = serializers.JSONField(required=False)


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for AI chat responses"""
    response = serializers.CharField()
    next_step = serializers.CharField(required=False)
    requirement_complete = serializers.BooleanField(default=False)
    quote_ready = serializers.BooleanField(default=False)


class AdminSettingsSerializer(serializers.ModelSerializer):
    """Serializer for admin settings"""
    class Meta:
        model = AdminSettings
        fields = ['id', 'admin_email', 'company_name', 'email_notifications', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ProjectEstimationSerializer(serializers.ModelSerializer):
    """Serializer for project estimations"""
    breakdown_summary = serializers.CharField(source='get_breakdown_summary', read_only=True)
    
    class Meta:
        model = ProjectEstimation
        fields = [
            'id', 'project_name', 'company_name', 'company_type', 'description',
            'tech_stack', 'breakdown_details', 'breakdown_summary', 'total_estimate',
            'estimated_days', 'hourly_rate', 'contact_email', 'contact_phone',
            'refer_agent_code', 'assigned_agent', 'session_id', 'status',
            'confirmed_at', 'discount_applied', 'special_requirements',
            'timeline_requirements', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'breakdown_summary']


class EstimationConfirmationSerializer(serializers.Serializer):
    """Serializer for estimation confirmation"""
    estimation_id = serializers.IntegerField()
    confirmed = serializers.BooleanField()
    customer_notes = serializers.CharField(required=False, allow_blank=True)
