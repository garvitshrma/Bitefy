from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, RemovedOrderViewSet
from .public_views import order_status

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
]