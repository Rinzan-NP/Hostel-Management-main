from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HallViewSet, RoomViewSet, BedViewSet, 
    StudentViewSet, RoomAssignmentViewSet, RentViewSet,
    health_check
)

router = DefaultRouter()
router.register(r'halls', HallViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'beds', BedViewSet)
router.register(r'students', StudentViewSet)
router.register(r'assignments', RoomAssignmentViewSet)
router.register(r'rents', RentViewSet)

urlpatterns = [
    path('health/', health_check, name='health-check'),  # Health check endpoint for cron jobs
    path('', include(router.urls)),
]
