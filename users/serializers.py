from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, UserSettings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'phone', 'address', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'id', 'theme', 'email_notifications', 'sms_notifications',
            'low_stock_alerts', 'daily_report', 'currency', 'language',
            'two_factor_enabled', 'session_timeout', 'items_per_page',
            'date_format', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        # create_user already hashes the password, so don't call set_password again
        user = User.objects.create_user(password=password, **validated_data)
        
        # Create default profile and settings
        UserProfile.objects.create(user=user)
        UserSettings.objects.create(user=user)
        
        return user
