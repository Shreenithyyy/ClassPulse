import { useState, useEffect } from "react";
import Feedback from "./Feedback";

function StudentDashboard({ studentId, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (activePage === "My Responses") {
      const formData = new URLSearchParams();

      formData.append("student_id", studentId);

      fetch("http://localhost:8080/Classpulse/get_feedback.php", {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          setResponses(data);
        });
    }
  }, [activePage, studentId]);

  
useEffect(() => {
  if (activePage === "Study Notes") {
    fetch("http://localhost:8080/Classpulse/get_files.php")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
      })
      .catch(() => {
        setFiles([]);
      });
  }
}, [activePage]);

  useEffect(() => {
  if (activePage === "Class Reminders") {
    fetch("http://localhost:8080/Classpulse/get_reminders.php")
      .then((response) => response.json())
      .then((data) => {
        setReminders(data);
      })
      .catch(() => {
        setReminders([]);
      });
  }
}, [activePage]);

  const menuItems = [
    "Dashboard",
    "Topics & Feedback",
    "Study Notes",
    "Class Reminders",
    "My Responses"
  ];

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <h2>ClassPulse</h2>
          <p>Student Portal</p>
        </div>

        <nav className="menu">

          {menuItems.map((item) => (
            <button
              key={item}
              className={activePage === item ? "active-menu" : ""}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}

        </nav>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>

      </aside>


      {/* Main Area */}
      <main className="main-content">

        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <>
            <div className="top-heading">
              <div>
                <p className="small-heading">STUDENT PORTAL</p>
                <h1>Welcome back! 👋</h1>
                <p>
                  Review your learning topics and share your understanding.
                </p>
              </div>
            </div>

            <h2 className="section-title">Overview</h2>

            <div className="cards">

              <div className="card">
                <div className="card-icon">📚</div>
                <h3>Learning Topics</h3>
                <p>5 topics available for feedback</p>
              </div>

              <div className="card">
                <div className="card-icon">📝</div>
                <h3>My Responses</h3>
                <p>View your submitted feedback</p>
              </div>

              <div className="card">
                <div className="card-icon">📄</div>
                <h3>Study Notes</h3>
                <p>Read notes provided by faculty</p>
              </div>

              <div className="card">
                <div className="card-icon">🔔</div>
                <h3>Reminders</h3>
                <p>Check important class reminders</p>
              </div>

            </div>

            <div className="welcome-section">

              <h2>What can you do?</h2>

              <div className="feature-list">

                <div>
                  <span>01</span>
                  <p>Give feedback about your understanding of topics.</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Read study notes shared by your faculty.</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Check important class reminders.</p>
                </div>

                <div>
                  <span>04</span>
                  <p>Review your previous responses.</p>
                </div>

              </div>

            </div>
          </>
        )}


        {/* Feedback */}
        {activePage === "Topics & Feedback" && (
          <Feedback studentId={studentId} />
        )}

{/* Study Notes */}
{activePage === "Study Notes" && (
  <div className="content-card">
    <p className="small-heading">LEARNING MATERIAL</p>

    <h1>Study Notes</h1>

    <p>Study notes shared by your faculty.</p>

    {files.length === 0 ? (
      <div className="empty-message">
        📄
        <h3>No notes available</h3>
        <p>Faculty notes will be displayed here.</p>
      </div>
    ) : (
      <div className="response-list">
        {files.map((file) => (
          <div className="response-card" key={file.id}>
            <h3>📄 {file.title}</h3>

            <p>{file.original_name}</p>

            <p>
              <a
                href={`http://localhost:8080/Classpulse/download_file.php?id=${file.id}&action=view`}
                target="_blank"
                rel="noreferrer"
              >
                Open File
              </a>
            </p>

            <p>
              <a
                href={`http://localhost:8080/Classpulse/download_file.php?id=${file.id}&action=download`}
              >
                Download File
              </a>
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/* Reminders */}
{activePage === "Class Reminders" && (
  <div className="content-card">
    <p className="small-heading">CLASS INFORMATION</p>
    <h1>Class Reminders</h1>
    <p>Important reminders shared by your faculty.</p>

    {reminders.length === 0 ? (
      <div className="empty-message">
        🔔
        <h3>No reminders available</h3>
        <p>New class reminders will appear here.</p>
      </div>
    ) : (
      <div className="response-list">
        {reminders.map((reminder) => (
          <div className="response-card" key={reminder.id}>
            <h3>🔔 {reminder.title}</h3>
            <p>{reminder.message}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {/* My Responses */}
        {activePage === "My Responses" && (
  <div className="content-card">

    <p className="small-heading">YOUR ACTIVITY</p>

    <h1>My Responses</h1>

    <p>
      Your submitted topic feedback will appear here.
    </p>

    {responses.length === 0 ? (
      <div className="empty-message">
        📝
        <h3>No responses yet</h3>
        <p>Your feedback history will appear here.</p>
      </div>
    ) : (
      <div className="response-list">

        {responses.map((response) => (
          <div className="response-card" key={response.id}>

            <h3>{response.topic}</h3>

            <p>
              <strong>Understanding:</strong> {response.rating}
            </p>

            <p>
              <strong>Comment:</strong> {response.comment}
            </p>

          </div>
        ))}

      </div>
    )}

  </div>
)}

      </main>

    </div>
  );
}

export default StudentDashboard;