from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """Expense management"""
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get expenses for current user"""
        user = self.request.user
        shop_id = self.request.query_params.get('shop')
        
        queryset = Expense.objects.filter(user=user)
        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create expense for current user"""
        # Get the active shop for the user
        from shops.models import Shop
        active_shop = Shop.objects.filter(user=self.request.user, is_active=True).first()
        
        if not active_shop:
            # If no active shop, get the first shop
            active_shop = Shop.objects.filter(user=self.request.user).first()
        
        if active_shop:
            serializer.save(user=self.request.user, shop=active_shop)
        else:
            serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        """Get today's expenses summary"""
        today = timezone.now().date()
        expenses = self.get_queryset().filter(created_at__date=today)
        
        total = sum(e.amount for e in expenses)
        by_category = {}
        for expense in expenses:
            if expense.category not in by_category:
                by_category[expense.category] = 0
            by_category[expense.category] += expense.amount
        
        return Response({
            'date': today,
            'total': total,
            'count': expenses.count(),
            'by_category': by_category,
            'expenses': ExpenseSerializer(expenses, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get expenses by category"""
        expense_type = request.query_params.get('type', 'daily')
        
        if expense_type == 'weekly':
            start_date = timezone.now().date() - timedelta(days=7)
        else:  # daily
            start_date = timezone.now().date()
        
        expenses = self.get_queryset().filter(created_at__date__gte=start_date)
        
        by_category = {}
        for expense in expenses:
            if expense.category not in by_category:
                by_category[expense.category] = {'count': 0, 'total': 0}
            by_category[expense.category]['count'] += 1
            by_category[expense.category]['total'] += expense.amount
        
        return Response({
            'type': expense_type,
            'by_category': by_category,
            'total': sum(e.amount for e in expenses)
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get expenses summary"""
        expenses = self.get_queryset()
        total = sum(e.amount for e in expenses)
        
        return Response({
            'total_expenses': total,
            'count': expenses.count(),
            'average': total / expenses.count() if expenses.count() > 0 else 0
        })
