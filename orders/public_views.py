from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Order
import razorpay
from django.conf import settings

@api_view(["GET"])
@permission_classes([AllowAny])
def order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        return Response({
            "order_number": order.name,
            "status": order.status,
            "total": order.total,
            "is_accepted": order.is_accepted,
            "payment_status": order.payment_status,
        })
    except Order.DoesNotExist:
        return Response({"status": "cancelled"}, status=404)
    
@api_view(["POST"])
@permission_classes([AllowAny])
def public_initiate_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    if not order.is_accepted:
        return Response({"error": "Order not accepted yet"}, status=400)

    if order.payment_status == "completed":
        return Response({"error": "Order already paid"}, status=400)

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    razorpay_order = client.order.create(
        {
            "amount": order.total * 100,
            "currency": "INR",
            "receipt": f"order_{order.id}",
            "notes": {"order_id": order.id},
        }
    )

    order.payment_id = razorpay_order["id"]
    order.save()

    return Response({
        "order_id": order.id,
        "razorpay_order_id": razorpay_order["id"],
        "amount": order.total,
        "key_id": settings.RAZORPAY_KEY_ID
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def public_verify_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID , settings.RAZORPAY_KEY_SECRET) 
    )

    params = {
        "razorpay_order_id": request.data.get("razorpay_order_id"),
        "razorpay_payment_id": request.data.get("razorpay_payment_id"),
        "razorpay_signature": request.data.get("razorpay_signature"),
    }

    try:
        client.utility.verify_payment_signature(params)
    except razorpay.errors.SignatureVerificationError:
        order.payment_status = "failed"
        order.save()
        return Response({"error": "Verification failed"}, status=400)

    order.payment_status = "completed"
    order.payment_id = params["razorpay_payment_id"]
    order.save()
    return Response({"payment_status": "completed"})    