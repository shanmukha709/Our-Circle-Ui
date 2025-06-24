import React, { useState } from 'react';
import axios from '../api/axios';

const OTPLoginForm = ({ onLogin, switchToLogin }) => {
  const [type, setType] = useState('mobile');
  const [value, setValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const requestOtp = async () => {
    try {
      const payload = type === 'email' ? { email: value } : { mobile: value };
      const endpoint =
        type === 'email'
          ? 'https://auth-service-n9ms.onrender.com/auth/email/send-otp'
          : 'https://auth-service-n9ms.onrender.com/auth/mobile/send-otp';

      await axios.post(endpoint, payload);
      setOtpSent(true);
      alert('OTP sent successfully');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP');
    }
  };

  const verifyOtp = async (e) => {
  e.preventDefault();
  try {
    const payload = type === 'email'
      ? { email: value, otp }
      : { mobile: value, otp };

    const response = await axios.post(
      type === 'email'
        ? 'https://auth-service-n9ms.onrender.com/auth/login/email/otp'
        : 'https://auth-service-n9ms.onrender.com/auth/login/mobile/otp',
      payload
    );

    const data = response.data;

    if (data && data.token && data.username) {
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('username', data.username); // ✅ Fix applied
      onLogin();
    } else {
      alert('Unexpected OTP login response.');
      console.error('OTP login response:', data);
    }
  } catch (err) {
    alert('Invalid OTP or login failed');
    console.error('OTP login error:', err);
  }
};



  return (
    <form className="auth-form" onSubmit={verifyOtp}>
      <h2>OTP Login</h2>

      <select
        value={type}
        onChange={(e) => {
          setOtpSent(false);
          setType(e.target.value);
          setValue('');
          setOtp('');
        }}
      >
        <option value="mobile">Mobile</option>
        <option value="email">Email</option>
      </select>

      <input
        type="text"
        placeholder={type === 'email' ? 'Enter Email' : 'Enter Mobile'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />

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
        <button type="button" onClick={requestOtp}>Send OTP</button>
      ) : (
        <button type="submit">Verify OTP</button>
      )}

      <p className="auth-links-single" onClick={switchToLogin}>Back to Login</p>
    </form>
  );
};

export default OTPLoginForm;
