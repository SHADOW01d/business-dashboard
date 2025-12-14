"""
URL configuration for ProShop Business Dashboard
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/shops/', include('shops.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/stocks/', include('inventory.urls')),  # Alias for frontend compatibility
    path('api/expenses/', include('expenses.urls')),
]
