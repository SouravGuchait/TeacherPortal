from rest_framework.response import Response
from rest_framework import status
from .session_store import sessions
from .models import Teacher

def require_session(func):
    def wrapper(self, request, *args, **kwargs):
        token = request.COOKIES.get('session_token')
        if not token or token not in sessions:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            teacher = Teacher.objects.get(id=sessions[token])
            request.teacher = teacher
            return func(self, request, *args, **kwargs)
        except Teacher.DoesNotExist:
            return Response({'error': 'Invalid session'}, status=status.HTTP_401_UNAUTHORIZED)
    return wrapper
