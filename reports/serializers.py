from rest_framework import serializers
from .models import UploadedFile


class UploadedFileSerializer(serializers.ModelSerializer):
    """Serializer for uploaded files"""
    file_size_display = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedFile
        fields = ['id', 'filename', 'file_type', 'file_size', 'file_size_display', 'uploaded_at']
        read_only_fields = ['id', 'file_size', 'uploaded_at']
    
    def get_file_size_display(self, obj):
        """Convert file size to human readable format"""
        size = obj.file_size
        if size < 1024:
            return f"{size} bytes"
        elif size < 1024 * 1024:
            return f"{size/1024:.1f} KB"
        else:
            return f"{size/(1024*1024):.1f} MB"


class FileUploadSerializer(serializers.Serializer):
    """Serializer for file upload"""
    file = serializers.FileField()
    
    def validate_file(self, value):
        """Validate file type and size"""
        # Check file extension
        allowed_extensions = ['.pdf', '.docx']
        file_extension = value.name.lower().split('.')[-1]
        
        if file_extension not in ['pdf', 'docx']:
            raise serializers.ValidationError("Only PDF and DOCX files are allowed")
        
        # Check file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("File size must be less than 10MB")
        
        return value
