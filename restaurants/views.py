from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Restaurant
from .serializers import RestaurantSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Restaurant.objects.filter(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_restaurant(self, request):
        """GET /api/restaurants/my_restaurant/"""
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
            serializer = self.get_serializer(restaurant)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant not found'},
                status=404
            )