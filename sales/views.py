from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Sale
from .serializers import SaleSerializer
from inventory.models import Stock
from shops.models import Shop


class SaleViewSet(viewsets.ModelViewSet):
    """Sales management"""
    serializer_class = SaleSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        """Get sales for current user's active shop"""
        user = self.request.user
        # If user is not authenticated, return empty queryset
        if not user.is_authenticated:
            return Sale.objects.none()
        active_shop = Shop.objects.filter(user=user, is_active=True).first()
        if active_shop:
            return Sale.objects.filter(user=user, shop=active_shop)
        return Sale.objects.filter(user=user)
    
    def perform_create(self, serializer):
        """Create sale and update stock"""
        user = self.request.user
        active_shop = Shop.objects.filter(user=user, is_active=True).first()
        if not active_shop:
            # Create default shop if none exists
            active_shop = Shop.objects.create(
                user=user,
                name="Main Shop",
                location="Default",
                is_active=True
            )
        
        sale = serializer.save(user=user, shop=active_shop)
        
        # Update stock quantities
        stock = sale.stock
        stock.quantity_in_stock -= sale.quantity
        if stock.quantity_in_stock < 0:
            stock.quantity_in_stock = 0
        stock.quantity_sold += sale.quantity
        stock.save()
    
    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        """Get today's sales summary"""
        today = timezone.now().date()
        sales_today = self.get_queryset().filter(created_at__date=today)
        
        total_sales = sales_today.count()
        total_amount = sales_today.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        return Response({
            'date': today,
            'total_sales': total_sales,
            'total_amount': float(total_amount),
            'sales': SaleSerializer(sales_today, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def yesterday_summary(self, request):
        """Get yesterday's sales summary"""
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        sales_yesterday = self.get_queryset().filter(created_at__date=yesterday)
        
        total_sales = sales_yesterday.count()
        total_amount = sales_yesterday.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        return Response({
            'date': yesterday,
            'total_sales': total_sales,
            'total_amount': float(total_amount),
            'sales': SaleSerializer(sales_yesterday, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def report_data(self, request):
        """Generate report data for daily or weekly"""
        report_type = request.query_params.get('type', 'daily')  # daily or weekly
        
        if report_type == 'weekly':
            # Get last 7 days
            today = timezone.now().date()
            start_date = today - timedelta(days=6)
            sales = self.get_queryset().filter(created_at__date__gte=start_date, created_at__date__lte=today)
        else:
            # Get today's sales
            today = timezone.now().date()
            sales = self.get_queryset().filter(created_at__date=today)
        
        # Calculate totals
        total_amount = sales.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_sales = sales.count()
        
        # Get stocks info
        stocks = Stock.objects.filter(user=request.user)
        total_items_sold = stocks.aggregate(Sum('quantity_sold'))['quantity_sold__sum'] or 0
        
        # Calculate expenses (40% of revenue)
        total_expenses = float(total_amount) * 0.4
        net_profit = float(total_amount) - total_expenses
        
        # Group sales by day for chart
        daily_data = {}
        for sale in sales:
            day = sale.created_at.date()
            if day not in daily_data:
                daily_data[day] = {'income': 0, 'expenses': 0, 'sales_count': 0}
            daily_data[day]['income'] += float(sale.total_amount)
            daily_data[day]['expenses'] = daily_data[day]['income'] * 0.4
            daily_data[day]['sales_count'] += 1
        
        # Convert to list and sort
        chart_data = []
        for day in sorted(daily_data.keys()):
            chart_data.append({
                'day': day.strftime('%a, %b %d'),
                'income': daily_data[day]['income'],
                'expenses': daily_data[day]['expenses'],
                'sales_count': daily_data[day]['sales_count']
            })
        
        return Response({
            'report_type': report_type,
            'date_range': {
                'start': (timezone.now().date() - timedelta(days=6 if report_type == 'weekly' else 0)).isoformat(),
                'end': timezone.now().date().isoformat(),
            },
            'summary': {
                'total_income': float(total_amount),
                'total_expenses': total_expenses,
                'net_profit': net_profit,
                'total_sales': total_sales,
                'total_items_sold': total_items_sold,
                'total_stocks': stocks.count(),
            },
            'chart_data': chart_data,
            'sales': SaleSerializer(sales, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get sales summary"""
        sales = self.get_queryset()
        total_sales = sales.count()
        total_amount = sales.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        return Response({
            'total_sales': total_sales,
            'total_amount': float(total_amount),
            'average_sale': float(total_amount) / total_sales if total_sales > 0 else 0
        })
    
    @action(detail=False, methods=['get'])
    def low_stock_alerts(self, request):
        """Get low stock alerts"""
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get all stocks for the user
        stocks = Stock.objects.filter(user=user)
        
        critical_alerts = []
        warning_alerts = []
        
        for stock in stocks:
            if stock.quantity_in_stock == 0:
                # Critical: stock is zero
                critical_alerts.append({
                    'product_id': stock.id,
                    'product_name': stock.name,
                    'category': stock.category,
                    'current_stock': stock.quantity_in_stock,
                    'min_stock_level': stock.min_stock_level,
                    'stock_deficit': stock.min_stock_level - stock.quantity_in_stock,
                    'price': float(stock.price),
                    'alert_level': 'critical'
                })
            elif stock.quantity_in_stock < stock.min_stock_level:
                # Warning: stock below minimum
                warning_alerts.append({
                    'product_id': stock.id,
                    'product_name': stock.name,
                    'category': stock.category,
                    'current_stock': stock.quantity_in_stock,
                    'min_stock_level': stock.min_stock_level,
                    'stock_deficit': stock.min_stock_level - stock.quantity_in_stock,
                    'price': float(stock.price),
                    'alert_level': 'warning'
                })
        
        all_alerts = critical_alerts + warning_alerts
        
        return Response({
            'critical_alerts': len(critical_alerts),
            'warning_alerts': len(warning_alerts),
            'total_alerts': len(all_alerts),
            'items': all_alerts
        })
    
    @action(detail=False, methods=['get'])
    def profit_margin_analysis(self, request):
        """Get profit margin analysis by product"""
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get all stocks for the user
        stocks = Stock.objects.filter(user=user)
        
        products = []
        total_revenue = 0
        total_cost = 0
        total_profit = 0
        
        for stock in stocks:
            if stock.quantity_sold > 0:
                # Calculate revenue (price * quantity sold)
                revenue = float(stock.price) * stock.quantity_sold
                
                # Estimate cost (assume 60% of price is cost)
                cost = revenue * 0.6
                
                # Calculate profit
                profit = revenue - cost
                
                # Calculate margin percentage
                margin_percent = (profit / revenue * 100) if revenue > 0 else 0
                
                products.append({
                    'product_id': stock.id,
                    'product_name': stock.name,
                    'category': stock.category,
                    'quantity_sold': stock.quantity_sold,
                    'total_revenue': revenue,
                    'total_cost': cost,
                    'total_profit': profit,
                    'profit_margin_percent': margin_percent,
                    'price': float(stock.price),
                })
                
                total_revenue += revenue
                total_cost += cost
                total_profit += profit
        
        # Calculate overall metrics
        overall_margin_percent = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return Response({
            'overall_metrics': {
                'total_revenue': total_revenue,
                'total_cost': total_cost,
                'total_profit': total_profit,
                'overall_margin_percent': overall_margin_percent,
                'product_count': len(products),
            },
            'products': products
        })
