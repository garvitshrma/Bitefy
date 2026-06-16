from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import razorpay
from .models import Order

@csrf_exempt
@require_http_methods(["POST"])
def razorpay_webhook(request):
    """Handle Razorpay payment confirmation webhook"""
    
    try:
        data = json.loads(request.body)
        payment_id = data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        order_id = data.get("payload", {}).get("payment", {}).get("entity", {}).get("notes", {}).get("order_id")
        event = data.get("event")
        
        if event == "payment.authorized":
            # Payment successful
            order = Order.objects.get(id=order_id)
            order.payment_status = "completed"
            order.payment_id = payment_id
            order.save()
            return JsonResponse({"status": "success"})
        
        elif event == "payment.failed":
            # Payment failed
            order = Order.objects.get(id=order_id)
            order.payment_status = "failed"
            order.save()
            return JsonResponse({"status": "failed"})
        
        return JsonResponse({"status": "received"})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)