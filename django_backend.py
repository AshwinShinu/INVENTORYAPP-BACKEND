import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import models, IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.urls import path
from django.apps import AppConfig
from django.core.management import execute_from_command_line

# Django settings
settings.configure(
    DEBUG=True,
    SECRET_KEY='your-secret-key',
    ROOT_URLCONF=__name__,
    ALLOWED_HOSTS=['*'],
    INSTALLED_APPS=[
        'django.contrib.contenttypes',
        'django.contrib.auth',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        __name__,
    ],
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'USER': 'postgres',
            'PASSWORD': 'stan',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    },
    MIDDLEWARE=[
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ],
    STATIC_URL='/static/',
)

# WSGI application
application = get_wsgi_application()

# Models
class Room(models.Model):
    student_name = models.CharField(max_length=255)
    hostel = models.CharField(max_length=255)
    room_number = models.CharField(max_length=255)
    created_by = models.EmailField()

    class Meta:
        unique_together = ('room_number', 'created_by')

class PanCard(models.Model):
    name = models.CharField(max_length=255)
    pan_number = models.CharField(max_length=255)
    dob = models.DateField()
    created_by = models.EmailField()

    class Meta:
        unique_together = ('pan_number', 'created_by')

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.BigIntegerField()
    location = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

# Views
@csrf_exempt
def default_route(request):
    return JsonResponse({'message': 'Hostel Management Server is running...'})

@csrf_exempt
def view_rooms(request):
    if request.method == 'GET':
        user_email = request.GET.get('email')
        if not user_email:
            return JsonResponse({'error': 'User email is required'}, status=400)
        rooms = list(Room.objects.filter(created_by=user_email).values())
        return JsonResponse(rooms, safe=False)

@csrf_exempt
def add_room(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            room = Room.objects.create(
                student_name=data['studentName'],
                hostel=data['hostel'],
                room_number=data['roomNumber'],
                created_by=data['createdBy']
            )
            return JsonResponse({'success': True, 'message': 'Room added successfully'})
        except IntegrityError:
            return JsonResponse({'error': 'Room number already exists for this user'}, status=400)

@csrf_exempt
def find_room(request, id):
    try:
        room = Room.objects.get(id=id)
        return JsonResponse(room.__dict__)
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'Room not found'}, status=404)

@csrf_exempt
def edit_room(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            room = Room.objects.get(id=id)
            for key, value in data.items():
                setattr(room, key, value)
            room.save()
            return JsonResponse({'success': True, 'message': 'Room updated successfully'})
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'Room not found'}, status=404)

@csrf_exempt
def delete_room(request, id):
    try:
        room = Room.objects.get(id=id)
        room.delete()
        return JsonResponse({'success': True, 'message': 'Room deleted successfully'})
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'Room not found'}, status=404)

@csrf_exempt
def view_pan_cards(request):
    if request.method == 'GET':
        user_email = request.GET.get('email')
        if not user_email:
            return JsonResponse({'error': 'User email is required'}, status=400)
        pan_cards = list(PanCard.objects.filter(created_by=user_email).values())
        return JsonResponse(pan_cards, safe=False)

@csrf_exempt
def add_pan_card(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            pan_card = PanCard.objects.create(
                name=data['name'],
                pan_number=data['panNumber'],
                dob=data['dob'],
                created_by=data['createdBy']
            )
            return JsonResponse({'success': True, 'message': 'PAN Card added successfully'})
        except IntegrityError:
            return JsonResponse({'error': 'PAN number already exists for this user'}, status=400)

@csrf_exempt
def find_pan_card(request, id):
    try:
        pan_card = PanCard.objects.get(id=id)
        return JsonResponse(pan_card.__dict__)
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'PAN Card not found'}, status=404)

@csrf_exempt
def edit_pan_card(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            pan_card = PanCard.objects.get(id=id)
            for key, value in data.items():
                setattr(pan_card, key, value)
            pan_card.save()
            return JsonResponse({'success': True, 'message': 'PAN Card updated successfully'})
        except ObjectDoesNotExist:
            return JsonResponse({'message': 'PAN Card not found'}, status=404)

@csrf_exempt
def delete_pan_card(request, id):
    try:
        pan_card = PanCard.objects.get(id=id)
        pan_card.delete()
        return JsonResponse({'success': True, 'message': 'PAN Card deleted successfully'})
    except ObjectDoesNotExist:
        return JsonResponse({'message': 'PAN Card not found'}, status=404)

# URL patterns
urlpatterns = [
    path('', default_route),
    path('viewRooms', view_rooms),
    path('addRoom', add_room),
    path('findRoom/<int:id>', find_room),
    path('editRoom/<int:id>', edit_room),
    path('deleteRoom/<int:id>', delete_room),
    path('viewPanCards', view_pan_cards),
    path('addPanCard', add_pan_card),
    path('findPanCard/<int:id>', find_pan_card),
    path('editPanCard/<int:id>', edit_pan_card),
    path('deletePanCard/<int:id>', delete_pan_card),
]

# Application configuration
class DemoAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = __name__

if __name__ == '__main__':
    execute_from_command_line()