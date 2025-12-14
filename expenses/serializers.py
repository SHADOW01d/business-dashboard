from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'shop', 'category', 'description', 'amount', 'created_at']
        read_only_fields = ['id', 'shop', 'created_at']
