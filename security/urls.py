from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TwoFactorAuthViewSet, VerificationCodeViewSet

router = DefaultRouter()
router.register(r'2fa', TwoFactorAuthViewSet, basename='2fa')
router.register(r'codes', VerificationCodeViewSet, basename='code')

urlpatterns = [
    path('', include(router.urls)),
]
