import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
