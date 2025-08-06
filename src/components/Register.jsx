import { useState } from "react";
import { register } from "../api";

export default function Register({ onRegistered, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setMessage(null);
    setIsError(false);

    const { name, email, password } = form;
    if (!name || !email || !password) {
      setMessage("All fields are required.");
      setIsError(true);
      return;
    }

    const res = await register(name, email, password);

    if (res.error) {
      setIsError(true);
      setMessage(res.error || "Registration failed.");
    } else {
      setIsError(false);
      setMessage("Registered successfully. Please log in.");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => onRegistered(), 1000);
    }
  };

  return (
    <div className="modal">
      <h2>Teacher Registration</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      {message && (
        <p style={{ color: isError ? "red" : "green" }}>{message}</p>
      )}

      <button onClick={submit}>Register</button>
      <button onClick={switchToLogin}>Back to Login</button>
    </div>
  );
}
