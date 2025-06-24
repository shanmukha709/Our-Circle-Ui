import React, { useEffect, useState } from 'react';
import AnimatedIntro from './components/AnimatedIntro/AnimatedIntro';
import BottomNav from './components/BottomNav/BottomNav';
import Profile from './components/Screens/Profile';
import Posts from './components/Screens/Posts';
import Circle from './components/Screens/Circle';
import Messages from './components/Screens/Messages';
import AuthContainer from './components/auth/AuthContainer'; 
// import './App.css';

function App() {
  const [selectedTab, setSelectedTab] = useState(localStorage.getItem('selectedTab') || 'posts');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
  }, [selectedTab]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowIntro(true);

    setTimeout(() => {
      setShowIntro(false);
      localStorage.setItem('showIntroDone', 'true');
    }, 4000);
  };

  useEffect(() => {
    if (localStorage.getItem('jwtToken') && localStorage.getItem('showIntroDone') === 'true') {
      setIsAuthenticated(true);
      setShowIntro(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('showIntroDone');
    setIsAuthenticated(false);
    setSelectedTab('posts');
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile': return <Profile />;
      case 'posts': return <Posts />;
      case 'circle': return <Circle />;
      case 'messages': return <Messages />;
      default: return <Posts />;
    }
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <AuthContainer onLogin={handleLogin} />
      ) : showIntro ? (
        <AnimatedIntro />
      ) : (
        <>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

          <div className="app-body">
            <div className="content-area">
              {renderContent()}
            </div>
            <BottomNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
