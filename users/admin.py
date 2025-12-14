from django.contrib import admin
from .models import UserProfile, UserSettings


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'created_at')
    search_fields = ('user__username', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Contact', {'fields': ('phone', 'address')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'theme', 'language', 'currency', 'two_factor_enabled')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Theme & Display', {'fields': ('theme', 'language', 'date_format', 'items_per_page')}),
        ('Business', {'fields': ('currency',)}),
        ('Notifications', {'fields': ('email_notifications', 'sms_notifications', 'low_stock_alerts', 'daily_report')}),
        ('Security', {'fields': ('two_factor_enabled', 'session_timeout')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
