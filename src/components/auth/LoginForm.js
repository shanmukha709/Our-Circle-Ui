// LoginForm.js
import React, { useState } from 'react';
import axios from '../api/axios';
import '../auth/auth.css';

const LoginForm = ({ onLogin, switchToOtp, switchToSignup }) => {
  const [loginMethod, setLoginMethod] = useState('username');
  const [loginData, setLoginData] = useState({ username: '', email: '', mobile: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    let payload = {};
    let url = '';

    if (loginMethod === 'username') {
      url = 'https://auth-service-n9ms.onrender.com/auth/login/username';
      payload = { username: loginData.username, password: loginData.password };
    } else if (loginMethod === 'email') {
      url = 'https://auth-service-n9ms.onrender.com/auth/login/email';
      payload = { email: loginData.email, password: loginData.password };
    } else if (loginMethod === 'mobile') {
      url = 'https://auth-service-n9ms.onrender.com/auth/login/mobile';
      payload = { mobile: loginData.mobile, password: loginData.password };
    }

    try {
      const response = await axios.post(url, payload);
      if (response.data && response.data.token && response.data.username) {
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

      <div className="auth-links">
        <span onClick={switchToOtp}>OTP Login</span>
        <span onClick={switchToSignup}>Create Account</span>
      </div>
    </form>
  );
};

export default LoginForm;
