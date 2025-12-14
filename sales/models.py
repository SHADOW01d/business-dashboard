from django.db import models
from django.contrib.auth.models import User
from inventory.models import Stock
from shops.models import Shop


class Sale(models.Model):
    """Sales transactions"""
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='sales_transactions')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='sales_records')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_records')
    quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['stock', 'created_at']),
        ]

    def __str__(self):
        return f"Sale: {self.stock.name} x{self.quantity} ({self.created_at})"
