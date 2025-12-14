from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserProfileViewSet, UserSettingsViewSet

# Create two routers - one for auth endpoints, one for other endpoints
auth_router = DefaultRouter()
auth_router.register(r'', UserViewSet, basename='auth')

other_router = DefaultRouter()
other_router.register(r'users', UserViewSet, basename='user')
other_router.register(r'profiles', UserProfileViewSet, basename='profile')
other_router.register(r'settings', UserSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(auth_router.urls)),
    path('', include(other_router.urls)),
]
