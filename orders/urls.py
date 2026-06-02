from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from .public_views import order_status

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),

    path(
        'public/order-status/<int:order_id>/',
        order_status,
        name='order-status'
    ),
]