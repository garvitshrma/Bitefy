from django.urls import path
from .views import signup, login_view, google_login

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('google/', google_login, name='google_login')
]