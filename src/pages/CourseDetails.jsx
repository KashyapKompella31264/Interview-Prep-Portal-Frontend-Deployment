import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import { jwtDecode } from "jwt-decode";
import { FiBook, FiUser, FiAlertTriangle, FiCheckCircle, FiLoader } from "react-icons/fi";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://interview-prep-portal-backend-application.onrender.com/student/courses/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch course details");

        const data = await response.json();
        setCourse(data);
        
        const decodedToken = jwtDecode(token);
        setIsRegistered(data.students?.some(student => student.id === decodedToken.id));
        setError("");
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error fetching course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Authentication token is missing.");

      const studentId = jwtDecode(token).id;
      const response = await fetch(
        `https://interview-prep-portal-backend-application.onrender.com/student/courses/${id}/registercourse/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      
      if (response.status === 409) {
        setMessage(data.message);
        return setIsRegistered(true);
      }

      if (!response.ok) throw new Error(data.message || "Registration failed");

      setMessage("Successfully registered for the course!");
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration Error:", err);
      setMessage(err.message || "Failed to register for the course");
    }
  };

  return (
    <div className="course-details-container">
      <StudentNavbar />
      
      <main className="course-content">
        {error && (
          <div className="error-alert">
            <FiAlertTriangle /> {error}
          </div>
        )}

        {message && (
          <div className={`message-alert ${isRegistered ? 'success' : 'warning'}`}>
            {isRegistered ? <FiCheckCircle /> : <FiAlertTriangle />} {message}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <FiLoader className="loading-spinner" />
            Loading course details...
          </div>
        ) : course?.title ? (
          <div className="course-card">
            <div className="course-header">
              <FiBook className="course-icon" />
              <h1>{course.title}</h1>
              {isRegistered && (
                <span className="registered-badge">
                  <FiCheckCircle /> Enrolled
                </span>
              )}
            </div>

            <p className="course-description">{course.description}</p>

            <div className="instructors-section">
              <h2><FiUser /> Instructors</h2>
              <div className="instructors-grid">
                {course.instructors?.length > 0 ? (
                  course.instructors.map((instructor, index) => (
                    <div key={index} className="instructor-card">
                      <div className="instructor-avatar">
                        {instructor.name[0]}
                      </div>
                      <div className="instructor-info">
                        <h3>{instructor.name}</h3>
                        <p>{instructor.expertise}</p>
                        <p>{instructor.experience} years experience</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No instructors assigned</p>
                )}
              </div>
            </div>

            {!isRegistered && (
              <button 
                onClick={handleRegister}
                className="register-button"
                disabled={!!message}
              >
                Enroll in Course
              </button>
            )}
          </div>
        ) : (
          <p className="empty-state">Course details not available</p>
        )}
      </main>
    </div>
  );
};

export default CourseDetails;