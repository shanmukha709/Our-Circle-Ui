import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AnimatedIntro from './components/AnimatedIntro/AnimatedIntro';
import AppRoutes from './components/routes/AppRoutes';
import BottomNav from './components/BottomNav/BottomNav';

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowIntro(true);
    setTimeout(() => {
      setShowIntro(false);
      localStorage.setItem('showIntroDone', 'true');
      navigate('/posts');
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const introDone = localStorage.getItem('showIntroDone') === 'true';
    if (token && introDone) {
      setIsAuthenticated(true);
    }
  }, []);

  if (showIntro) return <AnimatedIntro />;

  return (
    <div className="app-wrapper">
      {isAuthenticated && (
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      )}
      <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} />
      <BottomNavWrapper />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

const BottomNavWrapper = () => {
  const currentPath = window.location.pathname;
  const visibleRoutes = ['/posts', '/messages', '/circle', '/profile'];
  return visibleRoutes.some(path => currentPath.startsWith(path)) ? (
    <BottomNav
      selectedTab={currentPath.slice(1)}
      setSelectedTab={(tab) => (window.location.href = `/${tab}`)}
    />
  ) : null;
};

export default App;
