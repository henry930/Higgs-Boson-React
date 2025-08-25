"""
URL Configuration for AI services
"""
from django.urls import path
from .views import AIUsageStatsView, AIConfigurationView

ai_urlpatterns = [
    path('ai/usage-stats/', AIUsageStatsView.as_view(), name='ai-usage-stats'),
    path('ai/configuration/', AIConfigurationView.as_view(), name='ai-configuration'),
]
