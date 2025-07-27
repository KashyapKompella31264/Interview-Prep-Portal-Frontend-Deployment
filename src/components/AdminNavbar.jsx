import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBook, FiHome, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleCoursesDropdown = () => {
    setCoursesDropdownOpen(!coursesDropdownOpen);
  };

  return (
    <nav className="student-navbar">
      <div className="nav-container">
        <Link to="/adminhome" className="nav-brand">
          <FiHome className="nav-icon" />
          Dashboard
        </Link>

        <div className="nav-links">
          <Link to="/managestudents" className="nav-link">
            <FiUser className="nav-icon" />
            Students
          </Link>

          <Link to="/manageinstructors" className="nav-link">
            <FiUser className="nav-icon" />
            Instructors
          </Link>

          {/* Courses Dropdown */}
          <div className="nav-link dropdown" onClick={toggleCoursesDropdown} style={{ cursor: 'pointer' }}>
            <FiBook className="nav-icon" />
            Courses
            <FiChevronDown className="dropdown-icon" />
          </div>

          {coursesDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/viewcourses" className="dropdown-item">Manage Courses</Link>
              <Link to="/subtopics" className="dropdown-item">Manage Subtopics</Link>
              <Link to="/managequestions" className="dropdown-item">Manage Questions</Link>
            </div>
          )}

          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
