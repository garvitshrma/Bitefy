from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Order

@api_view(["GET"])
@permission_classes([AllowAny])
def order_status(request, order_id):
    order = Order.objects.get(id=order_id)

    return Response({
        "order_number": order.name,
        "status": order.status,
        "total": order.total,
    })