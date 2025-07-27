import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth'; // Import the utility function

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Check if the token is missing or expired
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Clear expired token
    localStorage.removeItem('role'); // Clear role
    return <Navigate to="/login" />; // Redirect to login
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
