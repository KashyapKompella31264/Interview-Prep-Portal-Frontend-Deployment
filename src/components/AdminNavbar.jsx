
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBook, FiHome, FiLogOut, FiChevronDown, FiMenu } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleCoursesDropdown = () => {
    setCoursesDropdownOpen(!coursesDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCoursesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="nav-container">
        <Link to="/adminhome" className="nav-brand">
          <FiHome className="nav-icon" />
          <span className="nav-brand-text">Admin Dashboard</span>
        </Link>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FiMenu className="nav-icon" />
        </div>

        <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <Link to="/managestudents" className="nav-link">
            <FiUser className="nav-icon" />
            <span className="nav-text">Students</span>
          </Link>

          <Link to="/manageinstructors" className="nav-link">
            <FiUser className="nav-icon" />
            <span className="nav-text">Instructors</span>
          </Link>

          <div className="nav-link dropdown" onClick={toggleCoursesDropdown} ref={dropdownRef} style={{ position: 'relative' }}>
            <div className="dropdown-trigger">
              <FiBook className="nav-icon" />
              <span className="nav-text">Courses</span>
              <FiChevronDown className="dropdown-icon" />
            </div>
            {coursesDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/viewcourses" className="dropdown-item">Manage Courses</Link>
                <Link to="/subtopics" className="dropdown-item">Manage Subtopics</Link>
                <Link to="/managequestions" className="dropdown-item">Manage Questions</Link>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="nav-link logout-btn">
            <FiLogOut className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;