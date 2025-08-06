from rest_framework import serializers
from .models import Student, AuditLog

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'subject', 'marks']

class AuditLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    subject = serializers.CharField(source="student.subject", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "action",
            "prev_marks",
            "new_marks",
            "student_name",
            "subject",
            "timestamp"
        ]