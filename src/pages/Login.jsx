import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://interview-prep-portal-backend-application.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Save token and role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        console.log(data.role);
        alert('Login successful!');
        if(data.role=="ADMIN"){
            navigate("/adminhome");
        }
        else if(data.role=="STUDENT"){
            navigate("/studenthome");
        }
        else if(data.role=="INSTRUCTOR"){
            navigate("/instructorhome");
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.',err);
    }
  };
  return (
    <div className="auth-container">
      <Navbar />
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Continue your interview preparation</p>
        </div>

        {error && <div className="auth-error"> {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Log In <FiArrowRight />
          </button>
        </form>

        <p className="auth-footer">
          New user? <a href="/signup">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;