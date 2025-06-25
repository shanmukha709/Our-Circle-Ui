import React, { useState, useEffect } from 'react';
import axios, { AUTH_SERVICE_BASE_URL } from '../api/axios';
import '../auth/auth.css';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState('username');
  const [loginData, setLoginData] = useState({ username: '', email: '', mobile: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) navigate('/posts');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    let payload = {};
    let url = '';

    if (loginMethod === 'username') {
      url = `${AUTH_SERVICE_BASE_URL}/auth/login/username`;
      payload = { username: loginData.username, password: loginData.password };
    } else if (loginMethod === 'email') {
      url = `${AUTH_SERVICE_BASE_URL}/auth/login/email`;
      payload = { email: loginData.email, password: loginData.password };
    } else {
      url = `${AUTH_SERVICE_BASE_URL}/auth/login/mobile`;
      payload = { mobile: loginData.mobile, password: loginData.password };
    }

    try {
      const response = await axios.post(url, payload);
      if (response.data?.token && response.data?.username) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        onLogin();
      } else {
        alert("Login failed: Invalid server response.");
      }
    } catch {
      alert('Login failed: Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <select value={loginMethod} onChange={(e) => setLoginMethod(e.target.value)}>
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="mobile">Mobile</option>
        </select>

        {loginMethod === 'username' && (
          <input type="text" placeholder="Username" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required />
        )}
        {loginMethod === 'email' && (
          <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
        )}
        {loginMethod === 'mobile' && (
          <input type="text" placeholder="Mobile" value={loginData.mobile} onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })} required />
        )}
        <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
        <button type="submit">Login</button>
        <div className="auth-links-row">
          {/* <span><Link to="/otplogin">Login With OTP</Link></span> */}
          <span><Link to="/signup">Create Account</Link></span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
