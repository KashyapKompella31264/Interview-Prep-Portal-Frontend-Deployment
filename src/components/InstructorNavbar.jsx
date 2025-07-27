import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const InstructorNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return ( 
        <nav className="instructor-navbar">
            <div className="nav-container">
                <Link to="/instructorhome" className="nav-brand">
                    Dashboard
                </Link>
                <div className="nav-links">
                    <Link to="/instructorprofile" className="nav-link">
                        Profile
                    </Link>
                    <Link to="/mycourses" className="nav-link">
                        My Courses
                    </Link>
                    <Link to="/viewstudents" className="nav-link">
                        View Students
                    </Link>
                    <Link to="/preparequestions" className="nav-link">
                        Prepare Questions
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
     );
}
 
export default InstructorNavbar;