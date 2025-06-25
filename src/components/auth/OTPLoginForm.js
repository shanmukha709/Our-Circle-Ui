// src/components/auth/OTPLoginForm.js
import React, { useState, useEffect } from 'react';
import axios, { AUTH_SERVICE_BASE_URL } from '../api/axios';
import '../auth/auth.css';
import { useNavigate, Link } from 'react-router-dom';

const OTPLoginForm = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState('mobile');
  const [loginData, setLoginData] = useState({ mobile: '', email: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      navigate('/posts');
    }
  }, [navigate]);

  const handleSendOtp = async () => {
    try {
      const payload = loginMethod === 'mobile'
        ? { mobile: loginData.mobile }
        : { email: loginData.email };

      const sendOtpUrl =
        loginMethod === 'mobile'
          ? `${AUTH_SERVICE_BASE_URL}/auth/mobile/send-otp`
          : `${AUTH_SERVICE_BASE_URL}/auth/email/send-otp`;

      await axios.post(sendOtpUrl, payload);
      alert('OTP sent successfully!');
      setOtpSent(true);
    } catch (error) {
      console.error('Send OTP failed:', error);
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const payload = loginMethod === 'mobile'
        ? { mobile: loginData.mobile, otp }
        : { email: loginData.email, otp };

      const verifyOtpUrl =
        loginMethod === 'mobile'
          ? `${AUTH_SERVICE_BASE_URL}/auth/login/mobile/otp`
          : `${AUTH_SERVICE_BASE_URL}/auth/login/email/otp`;

      const response = await axios.post(verifyOtpUrl, payload);

      if (response.data?.token && response.data?.username) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        onLogin();
      } else {
        alert('OTP verification failed.');
      }
    } catch (error) {
      console.error('Verify OTP failed:', error);
      alert('Invalid OTP or contact information.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleVerifyOtp}>
        <h2>Login with OTP</h2>

        <select
          value={loginMethod}
          onChange={(e) => {
            setLoginMethod(e.target.value);
            setLoginData({ mobile: '', email: '' });
            setOtp('');
            setOtpSent(false);
          }}
        >
          <option value="mobile">Mobile</option>
          <option value="email">Email</option>
        </select>

        {loginMethod === 'mobile' && (
          <input
            type="text"
            placeholder="Enter Mobile"
            value={loginData.mobile}
            onChange={(e) => setLoginData({ ...loginData, mobile: e.target.value })}
            required
          />
        )}
        {loginMethod === 'email' && (
          <input
            type="email"
            placeholder="Enter Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
        )}

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        {!otpSent ? (
          <button type="button" onClick={handleSendOtp}>Send OTP</button>
        ) : (
          <button type="submit">Verify OTP</button>
        )}

        <div className="auth-links-row">
          <span><Link to="/login">Login With Password</Link></span>
          <span><Link to="/signup">Create Account</Link></span>
        </div>
      </form>
    </div>
  );
};

export default OTPLoginForm;
