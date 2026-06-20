from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, RemovedOrderViewSet
from .public_views import order_status, public_initiate_payment, public_verify_payment
from .webhooks import razorpay_webhook

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'removed-orders', RemovedOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path(
        'public/order-status/<int:order_id>/',
        order_status,
        name='order-status'
    ),

    path('webhooks/razorpay/', razorpay_webhook, name='razorpay_webhook'),
    path('public/initiate-payment/<int:order_id>/', public_initiate_payment, name='public_initiate_payment'),

    path('public/verify-payment/<int:order_id>/', public_verify_payment, name='public_verify_payment'),
]