from django.db import models

class Hall(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    ROOM_TYPES = [
        ('AC', 'Air Conditioned'),
        ('NON_AC', 'Non Air Conditioned'),
    ]
    hall = models.ForeignKey(Hall, related_name='rooms', on_delete=models.CASCADE)
    room_number = models.CharField(max_length=20)
    capacity = models.IntegerField(default=1)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPES, default='NON_AC')
    rent_price = models.DecimalField(max_digits=10, decimal_places=2, default=450.00)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            for i in range(1, self.capacity + 1):
                Bed.objects.create(room=self, bed_number=str(i))

    def __str__(self):
        return f"{self.hall.name} - {self.room_number}"

class Bed(models.Model):
    room = models.ForeignKey(Room, related_name='beds', on_delete=models.CASCADE)
    bed_number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.room.room_number} - Bed {self.bed_number}"

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100, blank=True)
    joined_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class RoomAssignment(models.Model):
    student = models.OneToOneField(Student, related_name='assignment', on_delete=models.CASCADE)
    bed = models.OneToOneField(Bed, related_name='assignment', on_delete=models.CASCADE)
    check_in_date = models.DateField()
    check_out_date = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk: # New assignment
            self.bed.is_occupied = True
            self.bed.save()
            super().save(*args, **kwargs)
            # Auto-generate first month's rent using room's rent_price
            from django.utils import timezone
            Rent.objects.create(
                assignment=self,
                amount=self.bed.room.rent_price,
                due_date=timezone.now().date(),
                status='UNPAID'
            )
        else:
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.bed.is_occupied = False
        self.bed.save()
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.student.name} in {self.bed}"

class Rent(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('UNPAID', 'Unpaid'),
        ('OVERDUE', 'Overdue'),
    ]
    assignment = models.ForeignKey(RoomAssignment, related_name='rents', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='UNPAID')
    paid_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Rent for {self.assignment.student.name} - {self.due_date}"
