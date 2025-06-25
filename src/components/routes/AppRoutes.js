import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from '../auth/LoginForm';
import OTPLoginForm from '../auth/OTPLoginForm';
import SignupForm from '../auth/SignupForm';
import Messages from '../Screens/Messages';
import Circle from '../Screens/Circle';
import Posts from '../Screens/Posts';
import Profile from '../Screens/Profile';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = ({ isAuthenticated, onLogin }) => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginForm onLogin={onLogin} />} />
    <Route path="/otplogin" element={<OTPLoginForm onLogin={onLogin} />} />
    <Route path="/signup" element={<SignupForm />} />
    <Route path="/messages/:username" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    <Route path="/circle" element={<ProtectedRoute><Circle /></ProtectedRoute>} />
    <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;
