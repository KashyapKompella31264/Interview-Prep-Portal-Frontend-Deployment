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
            method: 'POST', // Changed from POST to GET (since we're fetching data)
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
            method: 'POST', // Changed from POST to GET (since we're fetching data)
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch courses.");
        const data = await res.json();
        setCourses(data);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="instructor-profile">
            <h1>Instructor Profile</h1>
            <InstructorNavbar />
            
            {instructor && (
                <div className="profile-details">
                    <h2>Personal Information</h2>
                    <p><strong>ID:</strong> {instructor.id}</p>
                    <p><strong>Name:</strong> {instructor.name}</p>
                    <p><strong>Email:</strong> {instructor.email}</p>
                    <p><strong>Expertise:</strong> {instructor.expertise}</p>
                    <p><strong>Experience:</strong> {instructor.experience}</p>

                    <h2>Assigned Courses</h2>
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
                        <p>No courses assigned. Please contact the administrator.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstructorProfile;