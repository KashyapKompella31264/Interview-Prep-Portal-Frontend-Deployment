
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'STUDENT'; // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://interview-prep-portal-backend-application.onrender.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Sorry...Server unavailable');
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <Navbar />
      <div className="auth-card transform transition-all hover:scale-[1.02] duration-300 max-w-md w-full">
        <div className="auth-header">
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Create Your Account</h2>
          <p className="text-gray-500 mt-2 text-sm">Start your interview preparation journey</p>
        </div>

        {error && (
          <div className="auth-error flex items-center gap-2 animate-pulse bg-red-50 text-red-600 p-3 rounded-md">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form space-y-6">
          <div className="input-group relative">
            <FiUser className="input-icon text-blue-500" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Username"
              className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="input-group relative">
            <FiMail className="input-icon text-blue-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="input-group relative">
            <FiLock className="input-icon text-blue-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="auth-button w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg group"
          >
            Create Account
            <FiArrowRight className="transform transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="auth-footer mt-6 text-gray-600 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;