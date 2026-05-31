from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from restaurants.models import Restaurant
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.utils.text import slugify

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    restaurant_name = request.data.get('restaurant_name')
    
    if not username or not email or not password or not restaurant_name:
        return Response(
            {'error': 'All fields required'},
            status=400
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=400
        )
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    restaurant = Restaurant.objects.create(
        owner=user,
        name=restaurant_name,
        slug=slugify(restaurant_name)
    )
    
    return Response(
        {
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        },
        status=201
    )

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    if not user.check_password(password):
        return Response({'error': 'Invalid credentials'}, status=401)
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')

    CLIENT_ID = "1008158849735-sjgl25v6jk6k9do60ispsafqg3cbumj4.apps.googleusercontent.com"

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            CLIENT_ID
        )
    except ValueError:
        return Response({'error': 'Invalid token'}, status=400)
    
    
    email = idinfo['email']
    name = idinfo['name']

    user, created = User.objects.get_or_create(
        email=email,
        defaults={'username': email.split('@')[0]}
    )

    if created:
        Restaurant.objects.create(
            owner=user,
            name=f"{name}'s Restaurant",
            slug = slugify(f"{name}s-restaurant")
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })

    