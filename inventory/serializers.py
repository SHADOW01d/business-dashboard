from rest_framework import serializers
from .models import Stock, StockHistory


class StockHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StockHistory
        fields = ['id', 'quantity_before', 'quantity_after', 'action', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class StockSerializer(serializers.ModelSerializer):
    history = StockHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Stock
        fields = [
            'id', 'shop', 'name', 'category', 'price', 'quantity_in_stock',
            'quantity_sold', 'min_stock_level', 'created_at', 'updated_at', 'history'
        ]
        read_only_fields = ['id', 'shop', 'created_at', 'updated_at']
