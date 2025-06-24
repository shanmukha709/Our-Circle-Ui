import React, { useState } from 'react';
import axios from '../api/axios';

const SignupForm = ({ onLogin, switchToLogin }) => {
  const [data, setData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://auth-service-n9ms.onrender.com/auth/signup', data);
      alert('Signup successful!');
      switchToLogin(); // Redirect to login form
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSignup}>
      <h2>Sign Up</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={data.username}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={data.mobile}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>

      <p className="auth-links-single" onClick={switchToLogin}>
        Back to Login
      </p>
    </form>
  );
};

export default SignupForm;
