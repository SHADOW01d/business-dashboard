from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockViewSet, StockHistoryViewSet

router = DefaultRouter()
router.register(r'', StockViewSet, basename='stock')
router.register(r'history', StockHistoryViewSet, basename='history')

urlpatterns = [
    path('', include(router.urls)),
]
