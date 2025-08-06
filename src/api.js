const API = "http://localhost:8000/api"; // Update if hosted elsewhere

export async function login(email, password) {
  const res = await fetch(`${API}/login/`, {
    method: "POST",
    credentials: "include", // needed to send cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getStudents() {
  const res = await fetch(`${API}/students/`, { credentials: "include" });
  return res.json();
}

export async function addStudent(data) {
  const res = await fetch(`${API}/add-student/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStudent(student) {
  const res = await fetch(`${API}/update-student/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // IMPORTANT: sends session cookie
    body: JSON.stringify(student),
  });
  return await res.json();
}


export async function deleteStudent(student_id) {
  const res = await fetch(`${API}/delete-student/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id }),
  });
  return res.json();
}

export async function getAuditLog() {
  const res = await fetch(`${API}/audit-log/`, {
    credentials: "include",
  });
  return res.json();
}

export async function checkSession() {
  const res = await fetch(`${API}/session-check/`, {
    credentials: "include",
  });
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API}/logout/`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}