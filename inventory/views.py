from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Stock, StockHistory
from .serializers import StockSerializer, StockHistorySerializer


class StockViewSet(viewsets.ModelViewSet):
    """Stock management"""
    serializer_class = StockSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated for cross-domain debugging
    
    def get_queryset(self):
        """Get stocks for current user and active shop"""
        user = self.request.user
        shop_id = self.request.query_params.get('shop')
        
        queryset = Stock.objects.filter(user=user)
        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create stock for current user"""
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
    def summary(self, request):
        """Get stock summary"""
        stocks = self.get_queryset()
        total_stocks = stocks.count()
        total_quantity = sum(s.quantity_in_stock for s in stocks)
        total_sold = sum(s.quantity_sold for s in stocks)
        
        return Response({
            'total_stocks': total_stocks,
            'total_quantity': total_quantity,
            'total_sold': total_sold,
            'average_price': sum(s.price for s in stocks) / total_stocks if total_stocks > 0 else 0
        })
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get low stock items"""
        stocks = self.get_queryset().filter(
            Q(quantity_in_stock__lt=models.F('min_stock_level'))
        )
        serializer = self.get_serializer(stocks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_stock(self, request, pk=None):
        """Add incoming stock"""
        stock = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response(
                    {'error': 'Quantity must be positive'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create history record
            StockHistory.objects.create(
                stock=stock,
                quantity_before=stock.quantity_in_stock,
                quantity_after=stock.quantity_in_stock + quantity,
                action='added',
                notes=request.data.get('notes', '')
            )
            
            # Update stock
            stock.quantity_in_stock += quantity
            stock.save()
            
            serializer = self.get_serializer(stock)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid quantity'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def record_sale(self, request, pk=None):
        """Record a sale"""
        stock = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response(
                    {'error': 'Quantity must be positive'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if stock.quantity_in_stock < quantity:
                return Response(
                    {'error': f'Insufficient stock. Available: {stock.quantity_in_stock}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create history record
            StockHistory.objects.create(
                stock=stock,
                quantity_before=stock.quantity_in_stock,
                quantity_after=stock.quantity_in_stock - quantity,
                action='sold',
                notes=request.data.get('notes', '')
            )
            
            # Update stock
            stock.quantity_in_stock -= quantity
            stock.quantity_sold += quantity
            stock.save()
            
            serializer = self.get_serializer(stock)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid quantity'},
                status=status.HTTP_400_BAD_REQUEST
            )


class StockHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Stock history (read-only)"""
    serializer_class = StockHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get history for current user's stocks"""
        stock_id = self.request.query_params.get('stock')
        
        queryset = StockHistory.objects.filter(stock__user=self.request.user)
        if stock_id:
            queryset = queryset.filter(stock_id=stock_id)
        
        return queryset.order_by('-created_at')
