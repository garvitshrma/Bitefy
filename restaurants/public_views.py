from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Restaurant, MenuItem
from .serializers import MenuItemSerializer
from orders.models import Order

@api_view(['GET'])
@permission_classes([AllowAny])
def get_menu(request, slug):
    try:
        restaurant = Restaurant.objects.get(slug=slug)
    except:
        return Response(
            {'error': 'Restaurant not found'},
            status=404
        )
    
    items = MenuItem.objects.filter(
        restaurant=restaurant,
        is_available=True
    )

    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def place_order(request, slug):
    try:
        restaurant = Restaurant.objects.get(slug=slug)
    except:
        return Response(
            {'error': 'Restaurant not found'},
            status=404
        )
    name = request.data.get('name')
    items = request.data.get('items')
    total = request.data.get('total')

    order = Order.objects.create(
        user=None,
        restaurant=restaurant,
        name=name,
        items=items,
        total=total
    )

    return Response({
        'message': 'Order Placed!',
        'order_id': order.id,
        'order_number': name
    }, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_restaurants(request):
    restaurants = Restaurant.objects.all()
    data = [{'name': r.name, 'slug': r.slug} for r in restaurants]
    return Response(data)