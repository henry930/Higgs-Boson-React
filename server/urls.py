from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'Django API server is running with Supabase'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    # Original Django ORM routes (for legacy compatibility)
    path('api/legacy/', include('api.urls')),
    # New Supabase-based routes (primary)
    path('', include('api.supabase_urls')),
]
