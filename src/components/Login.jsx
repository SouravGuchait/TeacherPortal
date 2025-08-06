import { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.message) onLogin();
    else alert(res.error || "Login failed");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="brand">Evaluation Login</h1>
        <form onSubmit={submit}>
  <div className="form-row">
    <label>Username</label>
    <input
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="shiv.yadav@example.com"
    />
  </div>

  <div className="form-row">
    
    <div className="password-wrapper">
    <label>Password</label>
      <input
        type={showPass ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="******"
      />
      <button
        type="button"
        onClick={() => setShowPass(!showPass)}
        className="eye-toggle"
      >
        👁️
      </button>
    </div>
  </div>

  <div className="form-footer">
    <a href="#">Forgot Password?</a>
  </div>

  <button type="submit" className="login-btn">Login</button>
  <button type="button" onClick={switchToRegister} className="register-btn">Register</button>
</form>
      </div>
    </div>
  );
}
