import { useState, useEffect } from "react";
import {
  getStudents,
  deleteStudent,
  addStudent,
  getAuditLog,
  updateStudent,
  logout
} from "../api";

import StudentRow from "./StudentRow";
import AddStudentModal from "./AddStudentModal";

export default function Dashboard({onLogout }) {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
//   const [editStudent, setEditStudent] = useState(null);
//   const [editingStudent, setEditingStudent] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const fetchStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const fetchAuditLogs = async () => {
    const data = await getAuditLog();
    setAuditLogs(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (showLogs) fetchAuditLogs();
  }, [showLogs]);

  const handleUpdate = async (id, marks, student) => {
    const updatedStudent = { ...student, marks: parseInt(marks) };
    const res = await updateStudent(updatedStudent);
    if (res.message) {
      fetchStudents();
      fetchAuditLogs(); // refresh log
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteStudent(id);
    if (res.message) fetchStudents();
    else alert(res.error);
  };

  const handleEdit = (student) => {
    setStudentToEdit(student);
    setModalOpen(true);
  };

const handleLogout = async () => {
  const res = await logout();
  if (res.message) {
    onLogout(); // switches UI to login screen
  } else {
    alert("Logout failed");
  }
};

  return (
    <div className="dashboard-container">
      {/* 🔓 Logout link */}
      <div style={{ textAlign: "right", margin: "10px 20px" }}>
       <button
  onClick={handleLogout}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
  }}
>
  Logout
</button>
      </div>

      <div className="main-content">
        <div className="student-section">
          <div className="section-header">
            <h2>Student List</h2>
            <button className="add-btn" onClick={() => setModalOpen(true)}>
              Add Student
            </button>
          </div>

          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <StudentRow
                  key={s.id}
                  student={s}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </tbody>
          </table>

          <AddStudentModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setStudentToEdit(null);
            }}
            onAdded={() => {
              fetchStudents();
              fetchAuditLogs();
            }}
            student={studentToEdit}
          />
        </div>

        <div className="audit-section">
          <button className="toggle-log" onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? "Hide Audit Logs" : "Show Audit Logs"}
          </button>

          {showLogs && (
            <div className="audit-log">
              <h3>Audit Log</h3>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Action</th>
                    <th>Old Marks</th>
                    <th>New Marks</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.student_name}</td>
                      <td>{log.subject}</td>
                      <td>{log.action}</td>
                      <td>{log.prev_marks}</td>
                      <td>{log.new_marks}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
