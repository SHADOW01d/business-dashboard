from django.db import models
from django.contrib.auth.models import User
from shops.models import Shop


class Expense(models.Model):
    """Expense tracking"""
    CATEGORY_CHOICES = [
        ('rent', 'Rent'),
        ('utilities', 'Utilities'),
        ('transport', 'Transport'),
        ('supplies', 'Supplies'),
        ('salary', 'Salary'),
        ('marketing', 'Marketing'),
        ('maintenance', 'Maintenance'),
        ('other', 'Other'),
    ]

    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='expenses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['category', 'created_at']),
        ]

    def __str__(self):
        return f"{self.category} - {self.amount} ({self.created_at})"
