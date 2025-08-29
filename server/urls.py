from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'Django API server is running'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    # Main API routes
    path('api/', include('api.urls')),
    # Supabase routes (optional)
    path('api/supabase/', include('api.supabase_urls')),
]
