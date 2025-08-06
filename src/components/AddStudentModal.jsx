import { useState, useEffect } from "react";
import { addStudent, updateStudent } from "../api";

export default function AddStudentModal({ open, onClose, onAdded, student }) {
  const [form, setForm] = useState({ name: "", subject: "", marks: "" });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        subject: student.subject,
        marks: student.marks,
        id: student.id,
      });
    } else {
      setForm({ name: "", subject: "", marks: "" });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setMessage(null);
    setIsError(false);

    if (!form.name || !form.subject || form.marks === "") {
      setIsError(true);
      setMessage("All fields are required.");
      return;
    }

    const marks = parseInt(form.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setIsError(true);
      setMessage("Marks must be a number between 0 and 100.");
      return;
    }

    let res;
    if (student) {
      res = await updateStudent({ id: form.id, name: form.name, subject: form.subject, marks });
    } else {
      res = await addStudent(form);
    }

    if (res.error) {
      setIsError(true);
      setMessage(res.error);
    } else {
      setIsError(false);
      setMessage(student ? "Student updated successfully." : "Student added successfully.");
      setTimeout(() => {
        setMessage(null);
        onAdded(); // refresh student list
        onClose(); // close modal
      }, 1000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{student ? "Edit Student" : "Add Student"}</h3>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />
        <input
          name="marks"
          type="number"
          placeholder="Marks"
          value={form.marks}
          onChange={handleChange}
        />

        {message && (
          <p style={{ color: isError ? "red" : "green" }}>{message}</p>
        )}

        <div className="modal-actions">
          <button onClick={submit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
