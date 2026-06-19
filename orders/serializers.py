from rest_framework import serializers
from .models import Order, RemovedOrder

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'name', 'items', 'total', 'created_at', 'is_completed', 'order_type', 'status','is_accepted','payment_status', 'payment_id','priority']


class RemovedOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RemovedOrder
        fields = ['id', 'order', 'removed_at', 'reason']