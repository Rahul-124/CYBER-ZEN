import math
import ephem
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail

from .models import Task
from .serializers import TaskSerializer, RegisterSerializer


# ENTERPRISE STANDARD: Limit this endpoint to 5 requests per minute per IP.
# If someone exceeds this, Django automatically blocks them.
@api_view(['GET', 'POST'])
@ratelimit(key='ip', rate='5/m', block=True)
def task_list(request):
    # Your existing task logic goes here
    return Response({"status": "Active tasks retrieved."})


# ==========================================
# 1. TASK MANAGEMENT
# ==========================================
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==========================================
# 2. USER REGISTRATION
# ==========================================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


# ==========================================
# 3. PASSWORD RESET SYSTEM
# ==========================================
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email address is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Secure response: don't reveal if account exists
        return Response({'message': 'If an identity exists with this email, a token has been generated.'}, status=status.HTTP_200_OK)

    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # Send email (Printed to terminal)
    subject = "Cyber-Zen Quantum Identity Recovery"
    message = f"Identity Reset Requested.\n\nUID: {uid}\nToken: {token}\n\nEnter these into your Cyber-Zen HUD to reset your password."
    send_mail(subject, message, 'devroy12033015@gmail.com', [email], fail_silently=False)

    return Response({
        'message': 'Recovery token dispatched! Check your terminal output.',
        'uid': uid
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not uidb64 or not token or not new_password:
        return Response({'error': 'UID, Token, and New Password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid request UID.'}, status=status.HTTP_400_BAD_REQUEST)

    token_generator = PasswordResetTokenGenerator()
    if token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful! You may now authenticate.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Token is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 4. VEDIC CALENDAR ENGINE
# ==========================================
def calculate_tithi():
    date = ephem.now()
    sun = ephem.Sun(date)
    moon = ephem.Moon(date)
    
    sun_lon = math.degrees(ephem.Ecliptic(sun).lon)
    moon_lon = math.degrees(ephem.Ecliptic(moon).lon)
    
    diff = moon_lon - sun_lon
    if diff < 0:
        diff += 360
        
    tithi_index = int(diff / 12)
    
    tithis = [
        "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
        "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
        "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima (Full Moon)",
        "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
        "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
        "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya (New Moon)"
    ]
    
    return tithis[tithi_index]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_zen_calendar(request):
    current_tithi = calculate_tithi()
    
    if "Ekadashi" in current_tithi or "Purnima" in current_tithi:
        energy = "High (Zen Mode Optimal)"
    elif "Amavasya" in current_tithi:
        energy = "Low (Rest Recommended)"
    else:
        energy = "Stable"

    return Response({
        "tithi": current_tithi,
        "energy_status": energy
    })