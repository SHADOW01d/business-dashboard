from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"


class UserSettings(models.Model):
    """User website and notification settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')

    # Theme Settings
    theme = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='auto'
    )

    # Notification Settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    low_stock_alerts = models.BooleanField(default=True)
    daily_report = models.BooleanField(default=False)

    # Business Settings
    currency = models.CharField(max_length=3, default='KES')
    language = models.CharField(
        max_length=10,
        choices=[('en', 'English'), ('sw', 'Swahili'), ('fr', 'French')],
        default='en'
    )

    # Privacy Settings
    two_factor_enabled = models.BooleanField(default=False)
    session_timeout = models.IntegerField(default=3600)  # seconds

    # Display Settings
    items_per_page = models.IntegerField(default=10)
    date_format = models.CharField(
        max_length=20,
        choices=[('DD/MM/YYYY', 'DD/MM/YYYY'), ('MM/DD/YYYY', 'MM/DD/YYYY'), ('YYYY-MM-DD', 'YYYY-MM-DD')],
        default='DD/MM/YYYY'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}"

    class Meta:
        verbose_name = "User Settings"
        verbose_name_plural = "User Settings"
