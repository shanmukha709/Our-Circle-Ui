import React, { useState } from 'react';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import OTPLoginForm from '../auth/OTPLoginForm';
import '../auth/auth.css';

const AuthContainer = ({ onLogin }) => {
  const [activeForm, setActiveForm] = useState('login');

  const handleFormSwitch = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="auth-container">
      {activeForm === 'login' && (
        <LoginForm
          onLogin={onLogin}
          switchToOtp={() => handleFormSwitch('otp')}
          switchToSignup={() => handleFormSwitch('signup')}
        />
      )}
      {activeForm === 'otp' && (
        <OTPLoginForm
          onLogin={onLogin}
          switchToLogin={() => handleFormSwitch('login')}
        />
      )}
      {activeForm === 'signup' && (
        <SignupForm
          onLogin={onLogin}
          switchToLogin={() => handleFormSwitch('login')}
        />
      )}
    </div>
  );
};

export default AuthContainer;
