from django.urls import path
from .views import RegisterView, LoginView,StudentListView,AddStudentView,UpdateMarksView,DeleteStudentView,AuditLogView, SessionCheckView, EditStudentView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('students/', StudentListView.as_view()),
    path('session-check/', SessionCheckView.as_view()),

    path('add-student/', AddStudentView.as_view()),
    path('update-marks/', UpdateMarksView.as_view()),
     path('update-student/', EditStudentView.as_view()),
    path('delete-student/', DeleteStudentView.as_view()),
    path('audit-log/', AuditLogView.as_view()),

     path('logout/', LogoutView.as_view()),
]