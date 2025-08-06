import { useState } from "react";

export default function StudentRow({ student, onUpdate, onDelete, onEdit }) {
  const [marks, setMarks] = useState(student.marks);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBlur = async () => {
    if (marks !== student.marks) {
      await onUpdate(student.id, marks, student);
      alert("Updated successfully");
    }
  };

  return (
    <tr>
      <td>
        <div className="avatar-circle">{student.name[0]}</div>
        {student.name}
      </td>
      <td>{student.subject}</td>
      <td>
        <input
          type="number"
          value={marks}
          min="0"
          max="100"
          onChange={(e) => setMarks(e.target.value)}
          onBlur={handleBlur}
          className="marks-input"
        />
      </td>
      <td className="action-cell">
        <div className="action-menu-wrapper">
          <button
            className="action-button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ⬤
          </button>
          {menuOpen && (
            <div className="dropdown">
              <div onClick={() => onEdit(student)}>Edit</div>
              <div onClick={() => onDelete(student.id)}>Delete</div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
