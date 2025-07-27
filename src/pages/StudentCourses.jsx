import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StudentNavbar from "../components/StudentNavbar";
import { FiBook, FiAlertTriangle, FiInfo, FiArrowRight } from "react-icons/fi";

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication required.");
                    setLoading(false);
                    return;
                }

                const decodedToken = jwtDecode(token);
                const studentId = decodedToken.id;

                const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/${studentId}/courses`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch enrolled courses.");
                
                const data = await response.json();
                setCourses(data);
                setError("");

            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Could not load enrolled courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    return (
        <div className="student-courses-container">
            <StudentNavbar/>
            
            <main className="courses-main-content">
                <div className="courses-header">
                    <h1 className="page-title">
                        <FiBook className="title-icon" />
                        My Enrolled Courses
                    </h1>
                    {error && (
                        <div className="error-message">
                            <FiAlertTriangle className="error-icon" />
                            {error}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <h3>No Courses Enrolled</h3>
                        <p>Explore our courses to start learning!</p>
                        <button 
                            className="browse-button"
                            onClick={() => navigate('/courses')}
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="course-card">
                                <div className="card-header">
                                    <h3 className="course-title">{course.title}</h3>
                                    <span className={`difficulty-tag ${course.difficulty?.toLowerCase()}`}>
                                        {course.difficulty || 'Beginner'}
                                    </span>
                                </div>
                                <p className="course-description">{course.description}</p>
                                <div className="card-footer">
                                    <span className="category-badge">{course.category}</span>
                                    <Link 
                                        to={`/viewcourse/${course.id}`}
                                        className="view-details-button"
                                    >
                                        View Details
                                        <FiArrowRight className="button-icon" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentCourses;