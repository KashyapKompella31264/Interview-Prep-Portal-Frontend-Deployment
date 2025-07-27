import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="instructor-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon"></span>
                    Interview Prep
                </Link>
                
                <div className="nav-links">
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </div>
        </nav>
    );
}
 
export default Navbar;