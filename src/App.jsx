import { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";

function App() {
  const [user, setUser] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleLogin = (role, id) => {
    setUser(role);
    setStudentId(id);
  };

  const handleLogout = () => {
    setUser("");
    setStudentId("");
  };

  if (user === "") {
    return <Login onLogin={handleLogin} />;
  }

  if (user === "student") {
    return (
      <StudentDashboard
        studentId={studentId}
        onLogout={handleLogout}
      />
    );
  }

  return <FacultyDashboard onLogout={handleLogout} />;
}

export default App;