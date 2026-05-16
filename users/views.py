from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework import status 
from django.contrib.auth.models import User

class SignupView(APIView):
    def post(self, request):
        data = request.data
        serializer = UserSerializer(data = data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            response_data = {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'access': access,
                'refresh': str(refresh)
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.filter(email=email).first()
            if not user:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        response_data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'access': access,
            'refresh': str(refresh)
        }
        return Response(response_data, status=status.HTTP_200_OK)