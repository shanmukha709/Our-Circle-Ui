import React from 'react';
import { FaUser, FaStickyNote, FaUsers, FaEnvelope } from 'react-icons/fa';
import 'C:/Users/upend/shannu/ourcircle/src/components/BottomNav/BottomNav.css';

const BottomNav = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="bottom-nav">
      <div
        className={selectedTab === 'profile' ? 'nav-item active' : 'nav-item'}
        onClick={() => setSelectedTab('profile')}
      >
        <FaUser />
        <span>Profile</span>
      </div>
      <div
        className={selectedTab === 'posts' ? 'nav-item active' : 'nav-item'}
        onClick={() => setSelectedTab('posts')}
      >
        <FaStickyNote />
        <span>Posts</span>
      </div>
      <div
        className={selectedTab === 'circle' ? 'nav-item active' : 'nav-item'}
        onClick={() => setSelectedTab('circle')}
      >
        <FaUsers />
        <span>Circle</span>
      </div>
      <div
        className={selectedTab === 'messages' ? 'nav-item active' : 'nav-item'}
        onClick={() => setSelectedTab('messages')}
      >
        <FaEnvelope />
        <span>Messages</span>
      </div>
    </div>
  );
};

export default BottomNav;