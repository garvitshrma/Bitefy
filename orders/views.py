from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from rest_framework.decorators import action

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all() 
    
    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user , 
            is_completed = False
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 
        
        
    @action(detail=False, methods=['get'])
    def completed(self, request):
        orders = Order.objects.filter(
            user=request.user,
            is_completed=True
        )
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data) # ← Save with their user!