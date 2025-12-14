from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, F, DecimalField
from inventory.models import Stock
from sales.models import Sale
from expenses.models import Expense
from shops.models import Shop
from .serializers import ReportDataSerializer


class AnalyticsViewSet(viewsets.ViewSet):
    """Analytics and reporting"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def report_data(self, request):
        """Get comprehensive report data"""
        report_type = request.query_params.get('type', 'daily')
        shop_id = request.query_params.get('shop')
        
        if report_type == 'weekly':
            start_date = timezone.now().date() - timedelta(days=7)
        else:
            start_date = timezone.now().date()
        
        end_date = timezone.now().date()
        
        # Get sales
        sales_query = Sale.objects.filter(
            user=request.user,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        if shop_id:
            sales_query = sales_query.filter(shop_id=shop_id)
        
        # Get expenses
        expenses_query = Expense.objects.filter(
            user=request.user,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        if shop_id:
            expenses_query = expenses_query.filter(shop_id=shop_id)
        
        total_income = sales_query.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_expenses = expenses_query.aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'report_type': report_type,
            'date_range': {'start': start_date, 'end': end_date},
            'summary': {
                'total_income': total_income,
                'total_expenses': total_expenses,
                'net_profit': total_income - total_expenses,
                'total_sales': sales_query.count(),
                'total_items_sold': sales_query.aggregate(Sum('quantity'))['quantity__sum'] or 0,
                'total_stocks': Stock.objects.filter(user=request.user).count()
            }
        })
    
    @action(detail=False, methods=['get'])
    def profit_margin(self, request):
        """Get profit margin analysis"""
        shop_id = request.query_params.get('shop')
        
        sales_query = Sale.objects.filter(user=request.user)
        if shop_id:
            sales_query = sales_query.filter(shop_id=shop_id)
        
        expenses_query = Expense.objects.filter(user=request.user)
        if shop_id:
            expenses_query = expenses_query.filter(shop_id=shop_id)
        
        total_income = sales_query.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_expenses = expenses_query.aggregate(Sum('amount'))['amount__sum'] or 0
        
        if total_income == 0:
            margin = 0
        else:
            margin = ((total_income - total_expenses) / total_income) * 100
        
        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'profit_margin_percent': round(margin, 2)
        })
    
    @action(detail=False, methods=['get'])
    def top_products(self, request):
        """Get top selling products"""
        limit = int(request.query_params.get('limit', 5))
        shop_id = request.query_params.get('shop')
        
        sales_query = Sale.objects.filter(user=request.user)
        if shop_id:
            sales_query = sales_query.filter(shop_id=shop_id)
        
        top_products = sales_query.values('stock__name').annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total_amount'),
            sale_count=Count('id')
        ).order_by('-total_revenue')[:limit]
        
        return Response(list(top_products))
    
    @action(detail=False, methods=['get'])
    def expense_breakdown(self, request):
        """Get expense breakdown by category"""
        shop_id = request.query_params.get('shop')
        
        expenses_query = Expense.objects.filter(user=request.user)
        if shop_id:
            expenses_query = expenses_query.filter(shop_id=shop_id)
        
        breakdown = expenses_query.values('category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')
        
        return Response(list(breakdown))
    
    @action(detail=False, methods=['get'])
    def inventory_health(self, request):
        """Get inventory health status"""
        shop_id = request.query_params.get('shop')
        
        stocks_query = Stock.objects.filter(user=request.user)
        if shop_id:
            stocks_query = stocks_query.filter(shop_id=shop_id)
        
        total_stocks = stocks_query.count()
        low_stock = stocks_query.filter(quantity_in_stock__lt=F('min_stock_level')).count()
        critical_stock = stocks_query.filter(quantity_in_stock=0).count()
        
        health_percent = 100 - ((low_stock + critical_stock) / total_stocks * 100) if total_stocks > 0 else 0
        
        return Response({
            'total_stocks': total_stocks,
            'low_stock': low_stock,
            'critical_stock': critical_stock,
            'health_percent': round(health_percent, 2)
        })
