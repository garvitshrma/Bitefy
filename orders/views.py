from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, RemovedOrder
from .serializers import OrderSerializer, RemovedOrderSerializer
from rest_framework.decorators import action

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all() 
    
    def get_queryset(self):
        from django.db.models import Q
        from restaurants.models import Restaurant   
        try:
            restaurant = Restaurant.objects.get(owner=self.request.user)
        # Don't show removed orders
            return Order.objects.filter(is_completed=False).exclude(
            removedorder__isnull=False  # ← Exclude removed
            ).filter(
                Q(user=self.request.user) | Q(restaurant=restaurant)
            )
        except Restaurant.DoesNotExist:
            return Order.objects.filter(
                user=self.request.user, 
                is_completed=False
            ).exclude(removedorder__isnull=False)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 
        
        
    @action(detail=False, methods=['get'])
    def completed(self, request):
        from django.db.models import Q
        from restaurants.models import Restaurant
    
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
            orders = Order.objects.filter(
                is_completed=True
            ).filter(
                Q(user=request.user) |      # ← Staff orders
                Q(restaurant=restaurant)     # ← Customer orders
            )
        except Restaurant.DoesNotExist:
            orders = Order.objects.filter(
                user=request.user,
                is_completed=True
            )
    
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        order.status = new_status
        if new_status == "ready":
            order.is_completed = True
        order.save()
        return Response({"order_id": order.id, "status": order.status})
    
class RemovedOrderViewSet(viewsets.ModelViewSet):
    queryset = RemovedOrder.objects.all()
    serializer_class = RemovedOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from restaurants.models import Restaurant
        try:
            restaurant = Restaurant.objects.get(owner=self.request.user)
            return RemovedOrder.objects.filter(order__restaurant=restaurant)
        except Restaurant.DoesNotExist:
            return RemovedOrder.objects.filter(order__user=self.request.user)