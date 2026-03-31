from django.contrib import admin
from .models import Hall, Room, Bed, Student, RoomAssignment, Rent

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'hall', 'capacity', 'room_type')
    list_filter = ('hall', 'room_type')

@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = ('bed_number', 'room', 'is_occupied')
    list_filter = ('is_occupied', 'room__hall')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'roll_number', 'department', 'joined_at')
    search_fields = ('name', 'roll_number')

@admin.register(RoomAssignment)
class RoomAssignmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'bed', 'check_in_date')
    list_filter = ('check_in_date',)

@admin.register(Rent)
class RentAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'amount', 'due_date', 'status')
    list_filter = ('status', 'due_date')
