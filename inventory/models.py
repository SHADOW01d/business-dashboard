from django.db import models
from django.contrib.auth.models import User
from shops.models import Shop


class Stock(models.Model):
    """Product stock management"""
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='stocks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stocks')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.IntegerField(default=0)
    quantity_sold = models.IntegerField(default=0)
    min_stock_level = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('shop', 'name')
        indexes = [
            models.Index(fields=['shop', 'user']),
            models.Index(fields=['created_at']),
            models.Index(fields=['shop', 'created_at']),
        ]

    def __str__(self):
        return f"{self.name} - {self.shop.name}"


class StockHistory(models.Model):
    """Track stock quantity changes"""
    ACTION_CHOICES = [
        ('sold', 'Sold'),
        ('added', 'Added'),
        ('adjusted', 'Adjusted'),
    ]
    
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='history')
    quantity_before = models.IntegerField()
    quantity_after = models.IntegerField()
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['stock', 'created_at']),
        ]

    def __str__(self):
        return f"{self.stock.name} - {self.action} ({self.created_at})"
