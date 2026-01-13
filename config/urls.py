"""
URL configuration for ProShop Business Dashboard
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse

# Test endpoint for debugging authentication issues
def test_endpoint(request):
    return JsonResponse({
        'authenticated': request.user.is_authenticated,
        'user': str(request.user) if request.user.is_authenticated else None,
        'method': request.method,
        'headers': dict(request.headers),
        'cookies': dict(request.COOKIES),
        'session_key': request.session.session_key,
        'user_id': request.user.id if request.user.is_authenticated else None,
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/shops/', include('shops.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/stocks/', include('inventory.urls')),  # Alias for frontend compatibility
    path('api/expenses/', include('expenses.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/test/', test_endpoint),  # Debug endpoint
    # Catch-all pattern to serve React app for client-side routing
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
]
