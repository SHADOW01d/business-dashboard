from django.contrib import admin
from .models import Stock, StockHistory


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('name', 'shop', 'category', 'price', 'quantity_in_stock', 'quantity_sold', 'created_at')
    search_fields = ('name', 'category', 'shop__name')
    list_filter = ('shop', 'category', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Shop & User', {'fields': ('shop', 'user')}),
        ('Product Info', {'fields': ('name', 'category', 'price')}),
        ('Inventory', {'fields': ('quantity_in_stock', 'quantity_sold', 'min_stock_level')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(StockHistory)
class StockHistoryAdmin(admin.ModelAdmin):
    list_display = ('stock', 'action', 'quantity_before', 'quantity_after', 'created_at')
    search_fields = ('stock__name',)
    list_filter = ('action', 'created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Stock', {'fields': ('stock',)}),
        ('History', {'fields': ('action', 'quantity_before', 'quantity_after', 'notes')}),
        ('Timestamp', {'fields': ('created_at',)}),
    )
