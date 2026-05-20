from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from restaurants.models import Restaurant
from rest_framework_simplejwt.tokens import RefreshToken

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
    
    Restaurant.objects.create(
        owner=user,
        name=restaurant_name
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