from rest_framework import serializers
from .models import (
    Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page,
    Customer, ProjectRequirement, Conversation, Quote, Contract, AdminSettings,
    ProjectEstimation, JobApplication, Appointment
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


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for job applications with file upload support"""
    full_name = serializers.ReadOnlyField()
    application_age_days = serializers.ReadOnlyField()
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'position', 'experience', 'cover_letter', 'cv', 'linkedin', 'portfolio',
            'status', 'application_age_days', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'full_name', 'application_age_days']
        extra_kwargs = {
            'cv': {'required': False},  # Make CV optional for testing
            'cover_letter': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'position': {'required': True},
            'experience': {'required': True},
        }
    
    def validate_cv(self, value):
        """Validate CV file upload"""
        # Check file size (5MB limit)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB.")
        
        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx']
        import os
        file_extension = os.path.splitext(value.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, DOC, and DOCX files are allowed."
            )
        
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for appointment booking"""
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'name', 'email', 'phone', 'company', 'service',
            'preferred_date', 'preferred_time', 'message', 'status',
            'duration', 'meeting_link', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'meeting_link', 'notes', 'created_at', 'updated_at']
    
    def validate_preferred_date(self, value):
        """Ensure the preferred date is not in the past"""
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        
        # Limit to 3 months in advance
        max_date = timezone.now().date()
        max_date = max_date.replace(month=max_date.month + 3) if max_date.month <= 9 else max_date.replace(year=max_date.year + 1, month=max_date.month - 9)
        if value > max_date:
            raise serializers.ValidationError("Appointment date cannot be more than 3 months in advance.")
        
        return value
    
    def validate_preferred_time(self, value):
        """Validate time slot format"""
        import re
        time_pattern = r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
        if not re.match(time_pattern, value):
            raise serializers.ValidationError("Time must be in format HH:MM-HH:MM (e.g., 09:00-09:30)")
        
        # Validate business hours (9 AM to 5 PM)
        start_time = value.split('-')[0]
        end_time = value.split('-')[1]
        start_hour = int(start_time.split(':')[0])
        start_minute = int(start_time.split(':')[1])
        end_hour = int(end_time.split(':')[0])
        end_minute = int(end_time.split(':')[1])
        
        # Check if within business hours
        if start_hour < 9 or end_hour > 17:
            raise serializers.ValidationError("Appointment must be within business hours (9 AM - 5 PM)")
        
        # Check if it's a valid 30-minute slot
        total_start_minutes = start_hour * 60 + start_minute
        total_end_minutes = end_hour * 60 + end_minute
        duration = total_end_minutes - total_start_minutes
        
        if duration != 30:
            raise serializers.ValidationError("Appointment duration must be 30 minutes")
        
        # Check if start time is at valid intervals (00 or 30 minutes)
        if start_minute not in [0, 30]:
            raise serializers.ValidationError("Appointment must start at :00 or :30 minutes")
        
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value
