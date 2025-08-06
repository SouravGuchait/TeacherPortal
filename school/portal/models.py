from django.db import models

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=256)
    salt = models.CharField(max_length=64)

    def __str__(self):
        return self.email
    
class Student(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    marks = models.PositiveIntegerField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.subject}"
    
class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('edit', 'Edit'),
        ('delete', 'Delete')
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    prev_marks = models.PositiveIntegerField()
    new_marks = models.PositiveIntegerField()
    action = models.CharField(choices=ACTION_CHOICES, max_length=10)
    performed_by = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} by {self.performed_by.email} on {self.timestamp}"