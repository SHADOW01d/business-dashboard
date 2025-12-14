from django.contrib import admin
from .models import Shop


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'location', 'is_active', 'created_at')
    search_fields = ('name', 'location', 'user__username')
    list_filter = ('is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Shop Info', {'fields': ('name', 'location', 'description')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
