from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from .models import Shop
from .serializers import ShopSerializer


class ShopViewSet(viewsets.ModelViewSet):
    """Shop management"""
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get shops for current user"""
        return Shop.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create shop for current user"""
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise serializers.ValidationError(
                {'name': 'A shop with this name already exists for your account'}
            )
    
    def create(self, request, *args, **kwargs):
        """Override create to handle errors better"""
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def set_active(self, request, pk=None):
        """Set this shop as active"""
        shop = self.get_object()
        
        # Deactivate all other shops
        Shop.objects.filter(user=request.user).exclude(id=shop.id).update(is_active=False)
        
        # Activate this shop
        shop.is_active = True
        shop.save()
        
        serializer = self.get_serializer(shop)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active_shop(self, request):
        """Get the currently active shop"""
        shop = Shop.objects.filter(user=request.user, is_active=True).first()
        if shop:
            serializer = self.get_serializer(shop)
            return Response(serializer.data)
        return Response({'error': 'No active shop'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get shops summary"""
        shops = self.get_queryset()
        total_shops = shops.count()
        active_shop = shops.filter(is_active=True).first()
        
        return Response({
            'total_shops': total_shops,
            'active_shop': ShopSerializer(active_shop).data if active_shop else None
        })
