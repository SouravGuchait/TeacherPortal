Project Title:
Teacher Evaluation Portal

A secure, logic-driven student management system with audit logging and custom authentication.

Technology Stack
Backend:

Python 3.13.5

Django 4.2

Django REST Framework

PostgreSQL

Backend Setup Instructions
Clone the backend repository:


git clone https://github.com/SouravGuchait/TeacherPortal.git
cd backend

Create and activate virtual environment:
python -m venv venv
venv\Scripts\activate     # On Windows

pip install -r requirements.txt

Apply migrations:
python manage.py makemigrations
python manage.py migrate

Run the development server:
python manage.py runserver
The server will be available at http://127.0.0.1:8000/

Backend API Endpoints
Endpoint	Method	Description
/api/register/	POST	Register a new teacher
/api/login/	POST	Login with custom session logic
/api/logout/	POST	Logout and clear session token
/api/check-session/	GET	Check if the session is active
/api/students/	GET	Get list of students
/api/add-student/	POST	Add a student or merge marks
/api/update-student/	POST	Edit student details
/api/delete-student/	POST	Delete a student
/api/audit-log/	GET	View audit trail of actions

All endpoints (except login/register/check-session) require a valid session cookie.