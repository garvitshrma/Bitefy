from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet
from .public_views import get_menu, place_order, get_restaurants

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')

urlpatterns = [
    path('', include(router.urls)),
    path('public/menu/<slug:slug>/', get_menu, name='get_menu'),
    path('public/order/<slug:slug>/', place_order, name='place_order'),
    path('public/restaurants/', get_restaurants, name='get_restaurants'),
]