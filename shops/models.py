from django.db import models
from django.contrib.auth.models import User


class Shop(models.Model):
    """Multi-shop management"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'name')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.user.username}"
