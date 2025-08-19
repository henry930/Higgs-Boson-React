from rest_framework import serializers
from .models import Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page

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
