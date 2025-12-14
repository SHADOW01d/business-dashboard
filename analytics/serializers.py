from rest_framework import serializers


class ReportSummarySerializer(serializers.Serializer):
    """Report summary data"""
    total_income = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=15, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_sales = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    total_stocks = serializers.IntegerField()


class ChartDataSerializer(serializers.Serializer):
    """Chart data for reports"""
    day = serializers.CharField()
    income = serializers.DecimalField(max_digits=15, decimal_places=2)
    expenses = serializers.DecimalField(max_digits=15, decimal_places=2)
    sales_count = serializers.IntegerField()


class SaleDetailSerializer(serializers.Serializer):
    """Sale details for reports"""
    stock_name = serializers.CharField()
    quantity = serializers.IntegerField()
    price_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    created_at = serializers.DateTimeField()


class ReportDataSerializer(serializers.Serializer):
    """Complete report data"""
    report_type = serializers.CharField()
    date_range = serializers.DictField()
    summary = ReportSummarySerializer()
    chart_data = ChartDataSerializer(many=True)
    sales = SaleDetailSerializer(many=True)
