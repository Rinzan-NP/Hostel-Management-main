from rest_framework import viewsets
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
