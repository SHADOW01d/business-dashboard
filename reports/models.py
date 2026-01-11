from django.db import models
import os
from django.core.files.storage import default_storage


class UploadedFile(models.Model):
    """Model for storing uploaded PDF and DOCX files"""
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    file = models.FileField(upload_to='reports/uploads/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10)  # 'pdf' or 'docx'
    file_size = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.filename} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        if self.file:
            self.filename = self.file.name
            self.file_type = self.filename.lower().split('.')[-1]
            self.file_size = self.file.size
        super().save(*args, **kwargs)
