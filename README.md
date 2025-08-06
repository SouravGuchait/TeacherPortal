Project Title:
Teacher Evaluation Portal(Frontend)

A secure, logic-driven student management system with audit logging and custom authentication.

Frontend Setup Instructions
Clone the frontend repository:
git clone https://github.com/SouravGuchait/TeacherPortal.git -b frontend
cd frontend

Install dependencies:
npm install

Start the React development server:
npm start

The frontend will run at http://localhost:3000/
Ensure the backend is also running on http://localhost:8000/

Application Usage
Register a new teacher or log in using an existing account.
Add new students via the modal.
Edit student details (name, subject, or marks).
Delete a student entry.
Toggle the audit log to view action history.
Logout to end the session.

Security Implementation
Passwords are hashed and salted using SHA-256 (no plain text).
Manual session handling using secure cookies.
Inputs validated on both frontend and backend.
CSRF and XSS protection in place via secure headers and controlled input/output.
Django ORM used to prevent SQL injection.

The source code (frontend and backend).

Ensure both folders contain this README.txt file with instructions.
