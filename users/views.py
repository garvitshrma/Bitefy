from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework import status 

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
# Create your views here.
