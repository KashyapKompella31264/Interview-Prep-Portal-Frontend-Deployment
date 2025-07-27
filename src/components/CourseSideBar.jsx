import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiUser, FiChevronDown,FiBook, FiHome, FiLogOut } from 'react-icons/fi';

const CourseSideBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handlelogout =() =>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <nav className="student-navbar">
      <div className="nav-container">
        <Link to="/adminhome" className="nav-brand">
          <FiBook className="nav-icon" />
          Course Dashboard
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
                  <Link to="/viewcourses" className="nav-link">
                  <FiBook className="nav-icon" />
                    Courses
                  </Link>
                  
                </div>
        <div className="nav-links">
          {/* Courses Dropdown */}
          <div className="nav-link dropdown" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
            <FiBook className="nav-icon" />
            Courses
            <FiChevronDown className="dropdown-icon" />
          </div>

          {dropdownOpen && (
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

export default CourseSideBar;
