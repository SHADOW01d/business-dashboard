from rest_framework import serializers
from .models import TwoFactorAuth, VerificationCode


class TwoFactorAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwoFactorAuth
        fields = ['id', 'is_enabled', 'method', 'phone_number', 'backup_codes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ['id', 'code', 'is_used', 'expires_at', 'created_at']
        read_only_fields = ['id', 'code', 'expires_at', 'created_at']
