import math
import ephem
import holidays
from datetime import date, timedelta
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
def calculate_calendar(target_date=None):
    target_date = target_date or date.today()
    observation_date = ephem.Date(target_date.strftime('%Y/%m/%d 12:00:00'))
    sun = ephem.Sun(observation_date)
    moon = ephem.Moon(observation_date)
    
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
    
    nakshatras = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu',
        'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
        'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
        'Uttara Bhadrapada', 'Revati',
    ]
    nakshatra_index = int((math.degrees(ephem.Ecliptic(moon).lon) % 360) / (360 / 27))
    doshas = ['Vata', 'Pitta', 'Kapha']

    return {
        'tithi': tithis[tithi_index],
        'nakshatra': nakshatras[nakshatra_index],
        'dosha': doshas[target_date.toordinal() % len(doshas)],
    }


def get_holiday_signals(target_date):
    indian_holidays = holidays.country_holidays('IN', years=[target_date.year, target_date.year + 1])
    holiday_today = indian_holidays.get(target_date)
    upcoming = []
    cursor = target_date
    while len(upcoming) < 4 and cursor <= target_date + timedelta(days=370):
        holiday_name = indian_holidays.get(cursor)
        if holiday_name:
            upcoming.append({'date': cursor.isoformat(), 'name': holiday_name})
        cursor += timedelta(days=1)
    return holiday_today, upcoming

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_zen_calendar(request):
    requested_date = request.query_params.get('date')
    try:
        target_date = date.fromisoformat(requested_date) if requested_date else date.today()
    except ValueError:
        return Response({'error': 'Use an ISO date in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)

    calendar = calculate_calendar(target_date)
    current_tithi = calendar['tithi']
    
    if "Ekadashi" in current_tithi or "Purnima" in current_tithi:
        energy = "High (Zen Mode Optimal)"
    elif "Amavasya" in current_tithi:
        energy = "Low (Rest Recommended)"
    else:
        energy = "Stable"

    holiday, upcoming_holidays = get_holiday_signals(target_date)
    return Response({
        'date': target_date.isoformat(),
        'tithi': current_tithi,
        'nakshatra': calendar['nakshatra'],
        'dosha': calendar['dosha'],
        'energy_status': energy,
        'holiday': {'name': holiday} if holiday else None,
        'upcoming_holidays': upcoming_holidays,
    })
