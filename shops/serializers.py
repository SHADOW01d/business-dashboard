from rest_framework import serializers
from .models import Shop


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'name', 'location', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        """Validate shop name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Shop name cannot be empty")
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Shop name must be at least 2 characters")
        if len(value) > 255:
            raise serializers.ValidationError("Shop name cannot exceed 255 characters")
        return value.strip()
    
    def validate_location(self, value):
        """Validate location"""
        if value:
            return value.strip()
        return value
