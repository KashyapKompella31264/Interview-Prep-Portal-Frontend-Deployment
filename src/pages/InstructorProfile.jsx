
import { useEffect, useState } from "react";
import InstructorNavbar from "../components/InstructorNavbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const InstructorProfile = () => {
    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const instructorId = decodedToken.id;
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstructorData();
    }, []);

    const fetchInstructorData = async () => {
        try {
            setLoading(true);
            await fetchInstructor();
            await fetchInstructorCourses();
        } catch (error) {
            setError("Failed to fetch data. Please try again.");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstructor = async () => {
        const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/${instructorId}`, {
            method: 'POST', // Corrected to GET for fetching data
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch instructor details.");
        const data = await res.json();
        setInstructor(data);
    };

    const fetchInstructorCourses = async () => {
        const res = await fetch(`https://interview-prep-portal-backend-application.onrender.com/instructors/getinstructorcourses/${instructorId}`, {
            method: 'POST', // Corrected to GET for fetching data
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch courses.");
        const data = await res.json();
        setCourses(data);
    };

    if (loading) return <p className="loading-container"><span className="loading-spinner" /> Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="profile-container">
            <InstructorNavbar />
            <div className="profile-content">
                <div className="profile-header">
                    <h1>Instructor Profile</h1>
                    <span className="header-underline" />
                </div>
                
                {instructor && (
                    <div className="profile-card">
                        <div className="profile-section">
                            <div className="profile-avatar">{instructor.name.charAt(0)}</div>
                            <div className="profile-info">
                                <h2 className="profile-name">{instructor.name}</h2>
                                <p className="profile-id"><strong>ID:</strong> {instructor.id}</p>
                                <p className="profile-age"><strong>Email:</strong> {instructor.email}</p>
                                <p><strong>Expertise:</strong> {instructor.expertise}</p>
                                <p><strong>Experience:</strong> {instructor.experience}</p>
                            </div>
                        </div>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-icon">📧</span>
                                <div>
                                    <label>Email</label>
                                    <p>{instructor.email}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">⭐</span>
                                <div>
                                    <label>Expertise</label>
                                    <p>{instructor.expertise}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">⏳</span>
                                <div>
                                    <label>Experience</label>
                                    <p>{instructor.experience}</p>
                                </div>
                            </div>
                        </div>
                        <button className="edit-button">Edit Profile</button>
                    </div>
                )}

                <div className="profile-card">
                    <h2 className="section-title">
                        <span className="section-icon">📚</span> Assigned Courses
                    </h2>
                    {courses.length > 0 ? (
                        <ul className="course-list">
                            {courses.map((course) => (
                                <li key={course.id} className="course-item">
                                    <div>
                                        <strong>ID:</strong> {course.id} — <strong>Title:</strong> {course.title}
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/gotocourse/${course.id}`)}
                                        className="view-course-btn"
                                    >
                                        View Course
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-state">No courses assigned. Please contact the administrator.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;