from django.contrib import admin
from .models import (
    Benefit, ProcessStep, Testimonial, HeroSlide, TeamMember, Service, Page,
    Customer, ProjectRequirement, Conversation, Quote, Contract, AdminSettings,
    JobApplication
)

# Register your models here.

@admin.register(AdminSettings)
class AdminSettingsAdmin(admin.ModelAdmin):
    list_display = ('admin_email', 'company_name', 'email_notifications', 'updated_at')
    fieldsets = (
        ('Email Settings', {
            'fields': ('admin_email', 'email_notifications')
        }),
        ('Company Settings', {
            'fields': ('company_name',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one AdminSettings instance
        return not AdminSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of AdminSettings
        return False

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'session_id', 'created_at')
    list_filter = ('created_at', 'company')
    search_fields = ('name', 'email', 'company', 'session_id')
    readonly_fields = ('session_id', 'created_at', 'updated_at')

@admin.register(ProjectRequirement)
class ProjectRequirementAdmin(admin.ModelAdmin):
    list_display = ('project_title', 'customer', 'project_type', 'status', 'estimated_cost', 'created_at')
    list_filter = ('project_type', 'status', 'priority', 'created_at')
    search_fields = ('project_title', 'description', 'customer__name', 'customer__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('customer', 'project_title', 'project_type', 'description')
        }),
        ('Requirements', {
            'fields': ('budget_range', 'timeline', 'priority', 'status')
        }),
        ('AI Evaluation', {
            'fields': ('feasibility_score', 'estimated_days', 'estimated_cost', 'complexity_level', 'detected_features', 'ai_evaluation'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'position', 'experience', 'status', 'created_at')
    list_filter = ('status', 'experience', 'position', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'position')
    readonly_fields = ('created_at', 'updated_at', 'application_age_days')
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Application Details', {
            'fields': ('position', 'experience', 'cover_letter')
        }),
        ('Documents & Links', {
            'fields': ('cv', 'linkedin', 'portfolio')
        }),
        ('Application Management', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'application_age_days'),
            'classes': ('collapse',)
        }),
    )
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Full Name'
    
    def application_age_days(self, obj):
        return f"{obj.application_age_days} days ago"
    application_age_days.short_description = 'Application Age'
