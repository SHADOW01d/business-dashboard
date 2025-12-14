from django.contrib import admin
from .models import TwoFactorAuth, VerificationCode


@admin.register(TwoFactorAuth)
class TwoFactorAuthAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_enabled', 'method', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('is_enabled', 'method', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('2FA Settings', {'fields': ('is_enabled', 'method', 'phone_number')}),
        ('Backup', {'fields': ('backup_codes', 'authenticator_secret')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'is_used', 'expires_at', 'created_at')
    search_fields = ('user__username', 'code')
    list_filter = ('is_used', 'created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Code', {'fields': ('code', 'is_used')}),
        ('Expiration', {'fields': ('expires_at',)}),
        ('Timestamp', {'fields': ('created_at',)}),
    )
