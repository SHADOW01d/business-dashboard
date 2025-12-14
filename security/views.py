from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import TwoFactorAuth, VerificationCode
from .serializers import TwoFactorAuthSerializer, VerificationCodeSerializer


class TwoFactorAuthViewSet(viewsets.ModelViewSet):
    """Two-factor authentication management"""
    serializer_class = TwoFactorAuthSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get 2FA settings for current user"""
        return TwoFactorAuth.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """Get 2FA status"""
        two_fa, created = TwoFactorAuth.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(two_fa)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def enable(self, request):
        """Enable 2FA"""
        two_fa, created = TwoFactorAuth.objects.get_or_create(user=request.user)
        method = request.data.get('method', 'email')
        
        if method not in ['email', 'sms', 'authenticator']:
            return Response(
                {'error': 'Invalid method'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        two_fa.is_enabled = True
        two_fa.method = method
        
        if method == 'sms':
            phone = request.data.get('phone_number')
            if not phone:
                return Response(
                    {'error': 'Phone number required for SMS'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            two_fa.phone_number = phone
        
        two_fa.save()
        serializer = self.get_serializer(two_fa)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def disable(self, request):
        """Disable 2FA"""
        two_fa, created = TwoFactorAuth.objects.get_or_create(user=request.user)
        two_fa.is_enabled = False
        two_fa.save()
        serializer = self.get_serializer(two_fa)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def send_code(self, request):
        """Send verification code"""
        two_fa, created = TwoFactorAuth.objects.get_or_create(user=request.user)
        
        if not two_fa.is_enabled:
            return Response(
                {'error': '2FA not enabled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        code = VerificationCode.create_code(request.user)
        
        # TODO: Send code via email/SMS based on method
        # For now, just return the code (remove in production)
        
        return Response({
            'message': 'Code sent',
            'code': code.code,  # Remove in production
            'expires_at': code.expires_at
        })
    
    @action(detail=False, methods=['post'])
    def verify_code(self, request):
        """Verify code"""
        code_str = request.data.get('code')
        
        if not code_str:
            return Response(
                {'error': 'Code required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        code = VerificationCode.objects.filter(
            user=request.user,
            code=code_str
        ).first()
        
        if not code:
            return Response(
                {'error': 'Invalid code'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not code.is_valid():
            return Response(
                {'error': 'Code expired'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        code.is_used = True
        code.save()
        
        return Response({'message': 'Code verified'})
    
    @action(detail=False, methods=['post'])
    def backup_codes(self, request):
        """Generate backup codes"""
        import secrets
        
        two_fa, created = TwoFactorAuth.objects.get_or_create(user=request.user)
        
        # Generate 10 backup codes
        codes = [secrets.token_hex(4) for _ in range(10)]
        two_fa.backup_codes = ','.join(codes)
        two_fa.save()
        
        return Response({
            'backup_codes': codes,
            'message': 'Save these codes in a safe place'
        })


class VerificationCodeViewSet(viewsets.ReadOnlyModelViewSet):
    """Verification codes (read-only)"""
    serializer_class = VerificationCodeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get verification codes for current user"""
        return VerificationCode.objects.filter(user=self.request.user).order_by('-created_at')
