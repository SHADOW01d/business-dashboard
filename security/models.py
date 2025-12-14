from django.db import models
from django.contrib.auth.models import User
import secrets
from datetime import timedelta
from django.utils import timezone


class TwoFactorAuth(models.Model):
    """Two-factor authentication settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='two_factor_auth')
    is_enabled = models.BooleanField(default=False)
    method = models.CharField(
        max_length=20,
        choices=[('email', 'Email'), ('sms', 'SMS'), ('authenticator', 'Authenticator')],
        default='email'
    )
    phone_number = models.CharField(max_length=20, blank=True)
    backup_codes = models.TextField(blank=True)
    authenticator_secret = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"2FA for {self.user.username}"

    class Meta:
        verbose_name = "Two Factor Auth"
        verbose_name_plural = "Two Factor Auths"


class VerificationCode(models.Model):
    """Temporary verification codes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'code']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"Code for {self.user.username}"

    @staticmethod
    def create_code(user):
        """Create a new verification code"""
        code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        expires_at = timezone.now() + timedelta(minutes=10)
        return VerificationCode.objects.create(user=user, code=code, expires_at=expires_at)

    def is_valid(self):
        """Check if code is valid"""
        return not self.is_used and timezone.now() < self.expires_at
