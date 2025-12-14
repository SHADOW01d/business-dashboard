from rest_framework import serializers
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source='stock.name', read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'shop', 'stock', 'stock_name', 'quantity', 'price_per_unit', 'total_amount', 'created_at']
        read_only_fields = ['id', 'shop', 'created_at']
