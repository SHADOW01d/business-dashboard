"""
URL configuration for ProShop Business Dashboard
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

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
    # Catch-all pattern to serve React app for client-side routing
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
]
