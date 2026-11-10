import { useState } from "react";

function Feedback({ studentId }) {
  const [topic, setTopic] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (topic === "" || rating === "") {
      setMessage("Please select a topic and rating.");
      return;
    }

    const formData = new URLSearchParams();

    formData.append("student_id", studentId);
    formData.append("topic", topic);
    formData.append("rating", rating);
    formData.append("comment", comment);

    const response = await fetch(
      "http://localhost:8080/Classpulse/submit_feedback.php",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.text();

    if (result === "Feedback saved successfully") {
      setMessage("Feedback submitted successfully!");

      setTopic("");
      setRating("");
      setComment("");
    } else {
      setMessage("Error submitting feedback.");
    }
  };

  return (
    <div className="content-card">

      <p className="small-heading">LEARNING FEEDBACK</p>

      <h1>Topics & Feedback</h1>

      <p className="page-description">
        Select a topic and tell us how well you understand it.
      </p>

      <form className="feedback-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Select Topic</label>

          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          >
            <option value="">Choose a topic</option>

            <option value="JavaScript Functions">
              JavaScript Functions
            </option>

            <option value="Arrays and Functional Programming">
              Arrays and Functional Programming
            </option>

            <option value="React Components">
              React Components
            </option>

            <option value="React Hooks">
              React Hooks
            </option>

            <option value="Forms and CRUD">
              Forms and CRUD
            </option>

          </select>
        </div>


        <div className="form-group">

          <label>Understanding Level</label>

          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            <option value="">Choose level</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
          </select>

        </div>


        <div className="form-group">

          <label>Comment</label>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Enter your comment"
          ></textarea>

        </div>


        <button className="feedback-button" type="submit">
          Submit Feedback
        </button>

      </form>


      {message && (
        <p className="feedback-message">
          {message}
        </p>
      )}

    </div>
  );
}

export default Feedback;