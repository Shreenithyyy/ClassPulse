import { useState, useEffect } from "react";

function FacultyDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [responses, setResponses] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderStatus, setReminderStatus] = useState("");

  
const handleApproval = async (studentId, status) => {
  try {
    setApprovalMessage("");

    const formData = new URLSearchParams();
    formData.append("id", studentId);
    formData.append("status", status);

    const response = await fetch(
      "http://localhost:8080/Classpulse/update_student_status.php",
      {
        method: "POST",
        body: formData,
        credentials: "include"
      }
    );

    const result = (await response.text()).trim();

    if (!response.ok) {
      setApprovalMessage(result || "Could not update student status.");
      return;
    }

    setApprovalMessage(result);

    if (result === "Student status updated successfully.") {
      setPendingStudents((previousStudents) =>
        previousStudents.filter(
          (student) => String(student.id) !== String(studentId)
        )
      );
    }
  } catch (error) {
    setApprovalMessage("Could not connect to the server.");
  }
};

  useEffect(() => {
    if (activePage === "Student Responses") {
      fetch("http://localhost:8080/Classpulse/get_all_feedback.php", {
        method: "POST"
      })
        .then((response) => response.json())
        .then((data) => {
          setResponses(data);
        })
        .catch(() => {
          setResponses([]);
        });
    }
  }, [activePage]);

  
useEffect(() => {
  if (activePage === "Students") {
    fetch("http://localhost:8080/Classpulse/get_students.php", {
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load students.");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudents([]));
  }
}, [activePage]);



useEffect(() => {
  if (activePage === "Pending Approvals") {
    fetch("http://localhost:8080/Classpulse/get_pending_students.php", {
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load pending students.");
        }
        return response.json();
      })
      .then((data) => {
        setPendingStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setPendingStudents([]);
        setApprovalMessage("Could not load pending students. Please log in again if needed.");
      });
  }
}, [activePage]);



  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (fileTitle.trim() === "" || !selectedFile) {
      setUploadMessage("Enter a title and choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", fileTitle);
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:8080/Classpulse/upload_file.php",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.text();
      setUploadMessage(result);

      if (response.ok && result.includes("File uploaded successfully")) {
        setFileTitle("");
        setSelectedFile(null);
        event.target.reset();
      }
    } catch (error) {
      setUploadMessage("Upload failed. Check your XAMPP server.");
    }
  };

  const handleAddReminder = async (event) => {
    event.preventDefault();

    if (
      reminderTitle.trim() === "" ||
      reminderMessage.trim() === ""
    ) {
      setReminderStatus("Please enter both title and message.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("title", reminderTitle);
    formData.append("message", reminderMessage);

    try {
      const response = await fetch(
        "http://localhost:8080/Classpulse/add_reminder.php",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.text();

      if (
        response.ok &&
        result.includes("Reminder added successfully")
      ) {
        setReminderStatus("Reminder added successfully!");
        setReminderTitle("");
        setReminderMessage("");
      } else {
        setReminderStatus(result || "Could not add reminder.");
      }
    } catch (error) {
      setReminderStatus("Could not connect to the server.");
    }
  };

  const menuItems = [
  "Dashboard",
  "Student Responses",
  "Study Notes",
  "Class Reminders",
  "Students",
  "Pending Approvals"
];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <h2>ClassPulse</h2>
          <p>Faculty Portal</p>
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

      <main className="main-content">
        {activePage === "Dashboard" && (
          <>
            <div className="top-heading">
              <div>
                <p className="small-heading">FACULTY PORTAL</p>
                <h1>Welcome back! 👋</h1>
                <p>
                  Manage student feedback and class learning materials.
                </p>
              </div>
            </div>

            <h2 className="section-title">Overview</h2>

            <div className="cards">
              <div className="card">
                <div className="card-icon">👨‍🎓</div>
                <h3>Student Responses</h3>
                <p>View feedback submitted by students</p>
              </div>

              <div className="card">
                <div className="card-icon">📄</div>
                <h3>Study Notes</h3>
                <p>Add learning notes for students</p>
              </div>

              <div className="card">
                <div className="card-icon">🔔</div>
                <h3>Class Reminders</h3>
                <p>Add important class reminders</p>
              </div>

              <div className="card">
                <div className="card-icon">👥</div>
                <h3>Students</h3>
                <p>View enrolled students</p>
              </div>
            </div>

            <div className="welcome-section">
              <h2>What can you do?</h2>

              <div className="feature-list">
                <div>
                  <span>01</span>
                  <p>Review feedback submitted by students.</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Add study notes for students.</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Add important class reminders.</p>
                </div>

                <div>
                  <span>04</span>
                  <p>View student information.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activePage === "Student Responses" && (
          <div className="content-card">
            <p className="small-heading">STUDENT ACTIVITY</p>
            <h1>Student Responses</h1>
            <p>Feedback submitted by all students.</p>

            {responses.length === 0 ? (
              <div className="empty-message">
                📝
                <h3>No responses yet</h3>
                <p>Student feedback will appear here.</p>
              </div>
            ) : (
              <div className="response-list">
                {responses.map((response) => (
                  <div className="response-card" key={response.id}>
                    <h3>{response.topic}</h3>
                    <p>
                      <strong>Student ID:</strong> {response.student_id}
                    </p>
                    <p>
                      <strong>Understanding:</strong> {response.rating}
                    </p>
                    <p>
                      <strong>Comment:</strong>{" "}
                      {response.comment || "No comment"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activePage === "Study Notes" && (
          <div className="content-card">
            <p className="small-heading">LEARNING MATERIAL</p>
            <h1>Study Notes</h1>
            <p>Upload study materials for students.</p>

            <form onSubmit={handleFileUpload}>
              <input
                type="text"
                placeholder="Enter file title"
                value={fileTitle}
                onChange={(event) => setFileTitle(event.target.value)}
              />

              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                onChange={(event) =>
                  setSelectedFile(event.target.files[0] || null)
                }
              />

              <button type="submit">Upload File</button>
            </form>

            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        )}

        {activePage === "Class Reminders" && (
          <div className="content-card">
            <p className="small-heading">CLASS INFORMATION</p>
            <h1>Class Reminders</h1>
            <p>Add important reminders for students.</p>

            <form onSubmit={handleAddReminder}>
              <input
                type="text"
                placeholder="Enter reminder title"
                value={reminderTitle}
                onChange={(event) =>
                  setReminderTitle(event.target.value)
                }
              />

              <textarea
                placeholder="Enter reminder details"
                value={reminderMessage}
                onChange={(event) =>
                  setReminderMessage(event.target.value)
                }
                rows="5"
              />

              <button type="submit">Add Reminder</button>
            </form>

            {reminderStatus && <p>{reminderStatus}</p>}
          </div>
        )}

{/* Students */}
{activePage === "Students" && (
  <div className="content-card">
    <p className="small-heading">STUDENT INFORMATION</p>
    <h1>Students</h1>
    <p>View the available student accounts.</p>

    {students.length === 0 ? (
      <div className="empty-message">
        <h3>No student records found</h3>
      </div>
    ) : (
      <div className="response-list">
        {students
          .filter((student) => student.role === "student")
          .map((student) => (
            <div className="response-card" key={student.id}>
              <h3>{student.username}</h3>
            </div>
          ))}
      </div>
    )}
  </div>
)}

{activePage === "Pending Approvals" && (
  <div className="content-card">
    <p className="small-heading">ACCOUNT MANAGEMENT</p>
    <h1>Pending Approvals</h1>
    <p>Review student accounts waiting for approval.</p>

    {pendingStudents.length === 0 ? (
      <div className="empty-message">
        <h3>No pending students</h3>
        <p>New student registrations will appear here.</p>
      </div>
    ) : (
      <div className="response-list">
        {pendingStudents.map((student) => (
          <div className="response-card" key={student.id}>
            <h3>{student.email || student.username}</h3>
            <p>
              <strong>Account ID:</strong> {student.id}
            </p>
            <p>
              <strong>Status:</strong> {student.status}
              
<div className="approval-buttons">
  <button
    type="button"
    onClick={() => handleApproval(student.id, "approved")}
  >
    Approve
  </button>

  <button
    type="button"
    onClick={() => handleApproval(student.id, "rejected")}
  >
    Reject
  </button>
</div>

            </p>
          </div>
        ))}
      </div>
    )}

    {approvalMessage && <p>{approvalMessage}</p>}
  </div>
)}


      </main>
    </div>
  );
}

export default FacultyDashboard;