from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.db import connection
from .models import Hall, Room, Bed, Student, RoomAssignment, Rent
from .serializers import (
    HallSerializer, RoomSerializer, BedSerializer, 
    StudentSerializer, RoomAssignmentSerializer, RentSerializer
)

class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class RoomAssignmentViewSet(viewsets.ModelViewSet):
    queryset = RoomAssignment.objects.all()
    serializer_class = RoomAssignmentSerializer

class RentViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all()
    serializer_class = RentSerializer


# Health Check Endpoint for Cron Jobs and Monitoring
@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for monitoring and cron jobs.
    Returns server status and database connectivity.
    
    URL: GET /api/health/
    
    Response:
    {
        "status": "healthy",
        "timestamp": "2024-03-31T04:58:00Z",
        "database": "connected",
        "uptime": "running",
        "version": "1.0.0"
    }
    """
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    response_data = {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "timestamp": timezone.now().isoformat(),
        "database": db_status,
        "uptime": "running",
        "version": "1.0.0",
        "message": "Hostel Management System is operational"
    }
    
    return Response(response_data, status=status.HTTP_200_OK)
