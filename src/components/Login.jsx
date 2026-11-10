import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(
        "http://localhost:8080/Classpulse/login.php",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      const result = (await response.text()).trim();

      if (response.ok && result.includes("|")) {
        const [id, role] = result.split("|");

        if (role === "student" || role === "faculty") {
          onLogin(role, id);
        } else {
          setError("Invalid account role.");
        }
      } else {
        setError(result || "Invalid username or password.");
      }
    } catch {
      setError("Cannot connect. Please check that XAMPP is running.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>ClassPulse</h1>
        <p>Your classroom, connected.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

        {error && <p className="login-message">{error}</p>}

        <p className="login-footer">Student &amp; Faculty Portal</p>
      </div>
    </div>
  );
}

export default Login;