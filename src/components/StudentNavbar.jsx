
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBook, FiHome, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <nav className="student-navbar">
      <div className="nav-container">
        <Link to="/studenthome" className="nav-brand">
          <FiHome className="nav-icon" />
          <span className="nav-brand-text">Dashboard</span>
        </Link>
        
        <div className="nav-toggle">
          <FiMenu className="nav-icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <Link to="/viewstudentprofile" className="nav-link">
            <FiUser className="nav-icon" />
            <span className="nav-text">Profile</span>
          </Link>
          <Link to="/studentcourses" className="nav-link">
            <FiBook className="nav-icon" />
            <span className="nav-text">My Courses</span>
          </Link>
          <button onClick={Logout} className="nav-link nav-logout">
            <FiLogOut className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
