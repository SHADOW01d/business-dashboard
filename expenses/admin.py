from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('category', 'description', 'amount', 'shop', 'user', 'created_at')
    search_fields = ('description', 'category', 'shop__name', 'user__username')
    list_filter = ('category', 'shop', 'created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('User & Shop', {'fields': ('user', 'shop')}),
        ('Expense Info', {'fields': ('category', 'description', 'amount')}),
        ('Timestamp', {'fields': ('created_at',)}),
    )
