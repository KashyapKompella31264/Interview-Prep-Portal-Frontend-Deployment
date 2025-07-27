import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBook, FiHome, FiLogOut } from 'react-icons/fi';

const StudentNavbar = () => {
  const navigate=useNavigate();
  const Logout = () =>{
    localStorage.removeItem("token");
    navigate('/login');
  }
  return (
    <nav className="instructor-navbar">
      <div className="nav-container">
        <Link to="/studenthome" className="nav-brand">
          <FiHome className="nav-icon" />
          Dashboard
        </Link>
        
        <div className="nav-links">
          <Link to="/viewstudentprofile" className="nav-link">
            <FiUser className="nav-icon" />
            Profile
          </Link>
          <Link to="/studentcourses" className="nav-link">
            <FiBook className="nav-icon" />
            My Courses
          </Link>
          <button onClick={Logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;