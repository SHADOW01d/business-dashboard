"""
URL configuration for ProShop Business Dashboard
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.core.management import call_command
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def run_migrations_view(request):
    """Temporary endpoint to run migrations"""
    if request.method == 'POST':
        try:
            call_command('migrate', '--noinput')
            return JsonResponse({'status': 'success', 'message': 'Migrations completed'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'POST required'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/shops/', include('shops.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/stocks/', include('inventory.urls')),  # Alias for frontend compatibility
    path('api/expenses/', include('expenses.urls')),
    # Temporary migration endpoint (remove after use)
    path('run-migrations/', run_migrations_view),
]
