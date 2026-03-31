from rest_framework import serializers
from .models import Hall, Room, Bed, Student, RoomAssignment, Rent

class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    beds = BedSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = '__all__'

class HallSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    class Meta:
        model = Hall
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class RoomAssignmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    bed_name = serializers.ReadOnlyField(source='bed.__str__')
    class Meta:
        model = RoomAssignment
        fields = '__all__'

class RentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='assignment.student.name')
    class Meta:
        model = Rent
        fields = '__all__'
