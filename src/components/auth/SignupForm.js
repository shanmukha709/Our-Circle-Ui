import React, { useState, useEffect } from 'react';
import axios, { AUTH_SERVICE_BASE_URL } from '../api/axios';
import '../auth/auth.css';
import { useNavigate, Link } from 'react-router-dom';

const SignupForm = () => {
  const [data, setData] = useState({ username: '', email: '', mobile: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) navigate('/posts');
  }, [navigate]);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${AUTH_SERVICE_BASE_URL}/auth/signup`, data);
      alert('Signup successful!');
      navigate('/login');
    } catch {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input type="text" name="username" placeholder="Username" value={data.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
        <input type="text" name="mobile" placeholder="Mobile" value={data.mobile} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        <p className="auth-links-row"><Link to="/login">Back to Login</Link></p>
      </form>
    </div>
  );
};

export default SignupForm;
