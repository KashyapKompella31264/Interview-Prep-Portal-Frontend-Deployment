import { useEffect, useState } from "react";
import InstructorNavbar from "../components/InstructorNavbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const instructorId = decodedToken.id;

    useEffect(() => {
        fetchInstructorCourses();
    }, []);

    const fetchInstructorCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://interview-prep-portal-backend-application.onrender.com/instructors/getinstructorcourses/${instructorId}`,
                {
                    method: 'POST', // Changed from POST to GET (since we're fetching data)
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch courses.");
            }

            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to load courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>My Courses</h1>
                <InstructorNavbar />
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>My Courses</h1>
                <InstructorNavbar />
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="my-courses">
            <h1>My Courses</h1>
            <InstructorNavbar />
            
            {courses.length === 0 ? (
                <p>No courses assigned. Contact the administrator.</p>
            ) : (
                <ul className="course-list">
                    {courses.map((course) => (
                        <li key={course.id} className="course-item">
                            <div className="course-info">
                                <strong>{course.title}</strong>
                                <p>{course.description}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/gotocourse/${course.id}`)}
                                className="view-course-btn"
                            >
                                Go to Course
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyCourses;