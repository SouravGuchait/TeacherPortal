from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Teacher, Student,AuditLog
from .utils import hash_password, calculate_new_marks
import secrets
from .serializers import StudentSerializer , AuditLogSerializer
from .auth import require_session
from .session_store import sessions

from django.utils import timezone

class RegisterView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")

        if not (name and email and password):
            return Response({"error": "Missing fields"}, status=400)

        if Teacher.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        password_hash, salt = hash_password(password)
        teacher = Teacher.objects.create(name=name, email=email, password_hash=password_hash, salt=salt)
        return Response({"message": "Registered successfully"}, status=201)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            teacher = Teacher.objects.get(email=email)
        except Teacher.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)

        input_hash, _ = hash_password(password, teacher.salt)
        if input_hash != teacher.password_hash:
            return Response({"error": "Invalid credentials"}, status=401)

        # Generate and store session token
        session_token = secrets.token_urlsafe(32)
        sessions[session_token] = teacher.id

        response = Response({"message": "Login successful"})
        response.set_cookie("session_token", session_token, httponly=True, samesite='Strict', secure=False)  # set `secure=True` in production
        return response

class SessionCheckView(APIView):
    def get(self, request):
        token = request.COOKIES.get("session_token")
        if not token or token not in sessions:
            return Response({"logged_in": False}, status=200)

        try:
            teacher = Teacher.objects.get(id=sessions[token])
            return Response({"logged_in": True, "teacher": teacher.name}, status=200)
        except Teacher.DoesNotExist:
            return Response({"logged_in": False}, status=200)

class StudentListView(APIView):
    @require_session
    def get(self, request):
        students = Student.objects.filter(teacher=request.teacher)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    
class AddStudentView(APIView):
    @require_session
    def post(self, request):
        name = request.data.get("name")
        subject = request.data.get("subject")
        marks = request.data.get("marks")

        if not all([name, subject, marks]):
            return Response({"error": "Missing fields"}, status=400)

        try:
            marks = int(marks)
        except ValueError:
            return Response({"error": "Marks must be a number"}, status=400)

        if marks < 0 or marks > 100:
            return Response({"error": "Marks must be between 0 and 100"}, status=400)

        # Check if student with same name + subject exists for this teacher
        existing = Student.objects.filter(name=name, subject=subject, teacher=request.teacher).first()

        if existing:
            new_total = calculate_new_marks(existing.marks, marks)
            if new_total > 100:
                return Response({"error": "Total marks cannot exceed 100"}, status=400)
            existing.marks = new_total
            existing.save()
            return Response({"message": "Marks updated"}, status=200)

        # Create new student
        student = Student.objects.create(name=name, subject=subject, marks=marks, teacher=request.teacher)
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=201)
    
class UpdateMarksView(APIView):
    @require_session
    def post(self, request):
        student_id = request.data.get("student_id")
        new_marks = request.data.get("marks")

        try:
            student = Student.objects.get(id=student_id, teacher=request.teacher)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        try:
            new_marks = int(new_marks)
        except (ValueError, TypeError):
            return Response({"error": "Invalid marks"}, status=400)

        if new_marks < 0 or new_marks > 100:
            return Response({"error": "Marks must be between 0 and 100"}, status=400)

        prev_marks = student.marks
        student.marks = new_marks
        student.save()

        # Log the update
        if student.marks != new_marks:
            AuditLog.objects.create(
                student=student,
                subject=student.subject,
                action="EDIT",
                prev_marks=student.marks,
                new_marks=new_marks,
                timestamp=timezone.now()
            )

        return Response({"message": "Marks updated successfully"}, status=200)
    
class DeleteStudentView(APIView):
    @require_session
    def post(self, request):
        student_id = request.data.get("student_id")

        try:
            student = Student.objects.get(id=student_id, teacher=request.teacher)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        # Log before deleting
        AuditLog.objects.create(
            student=student,
            prev_marks=student.marks,
            new_marks=0,
            action="delete",
            performed_by=request.teacher
        )

        student.delete()
        return Response({"message": "Student deleted successfully"}, status=200)
    
class AuditLogView(APIView):
    @require_session
    def get(self, request):
        logs = AuditLog.objects.filter(performed_by=request.teacher).order_by('-timestamp')
        serializer = AuditLogSerializer(logs, many=True)
        return Response(serializer.data)
    

class EditStudentView(APIView):
    @require_session
    def post(self, request):
        data = request.data
        student_id = data.get("id")
        new_name = data.get("name")
        new_subject = data.get("subject")
        new_marks = data.get("marks")

        if not all([student_id, new_name, new_subject, new_marks]):
            return Response({"error": "Missing fields"}, status=400)

        try:
            new_marks = int(new_marks)
        except ValueError:
            return Response({"error": "Invalid marks"}, status=400)

        if new_marks < 0 or new_marks > 100:
            return Response({"error": "Marks must be between 0 and 100"}, status=400)

        try:
            student = Student.objects.get(id=student_id, teacher=request.teacher)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        # Track previous marks for audit logging
        prev_marks = student.marks

        # Check if name or subject has changed
        student.name = new_name
        student.subject = new_subject
        student.marks = new_marks
        student.save()

        # Audit logging only for mark change (or log all if needed)
        if prev_marks != new_marks:
            AuditLog.objects.create(
                student=student,
                prev_marks=prev_marks,
                new_marks=new_marks,
                action="edit",
                performed_by=request.teacher
            )

        return Response({"message": "Student updated successfully"}, status=200)


class LogoutView(APIView):
    @require_session
    def post(self, request):
        token = request.COOKIES.get("session_token")
        if token in sessions:
            del sessions[token]

        response = Response({"message": "Logged out successfully"})
        response.delete_cookie("session_token")
        return response