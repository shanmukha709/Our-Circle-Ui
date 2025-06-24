import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../screens-styles/messages.css';

const Messages = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(localStorage.getItem('chatUser') || '');
  const scrollRef = useRef(null);

  const sender = localStorage.getItem('username');

  // Fetch all users current user has chatted with
  useEffect(() => {
    if (sender) {
      axios
        .get(`https://chat-service-z1y7.onrender.com/chat/conversations/${sender}`)
        .then((res) => {
          setConversations(res.data);
          if (!selectedUser && res.data.length > 0) {
            setSelectedUser(res.data[0]);
            localStorage.setItem('chatUser', res.data[0]);
          }
        })
        .catch((err) => console.error('Conversation fetch error:', err));
    }
  }, [sender, selectedUser]);

  // Fetch chat history with selected user
  useEffect(() => {
    if (sender && selectedUser) {
      axios
        .get(`https://chat-service-z1y7.onrender.com/chat/history/${sender}/${selectedUser}`)
        .then((res) => setChat(res.data))
        .catch((err) => console.error('Chat fetch error:', err));
    }
  }, [sender, selectedUser]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgObj = {
      senderUsername: sender,
      receiverUsername: selectedUser,
      content: message,
    };

    axios
      .post('https://chat-service-z1y7.onrender.com/chat/send', msgObj)
      .then((res) => {
        setChat((prev) => [...prev, res.data]);
        setMessage('');
      })
      .catch((err) => {
        console.error('Send error:', err);
        alert('Failed to send message. Please try again.');
      });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    localStorage.setItem('chatUser', user);
  };

  return (
  <div className="messages-container">
    <div className="chat-sidebar">
      <h3>Chats</h3>
      <div className="chat-user-list">
        {conversations.map((user) => (
          <div
            key={user}
            className={`chat-user ${user === selectedUser ? 'active' : ''}`}
            onClick={() => handleUserClick(user)}
          >
            @{user}
          </div>
        ))}
      </div>
    </div>

    <div className="chat-main">
      <div className="chat-header"><strong>@{selectedUser}</strong></div>

      <div className="chat-body">
        {chat.length === 0 ? (
          <p className="no-messages">No messages yet.</p>
        ) : (
          chat.map((msg, idx) => {
            const isSender = msg.senderUsername === sender;
            return (
              <div
                key={idx}
                className={`chat-bubble ${isSender ? 'sent' : 'received'}`}
              >
                {!isSender && <div className="chat-username">{msg.senderUsername}</div>}
                <div className="chat-text">{msg.content}</div>
                <div className="chat-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
      </div>
    </div>
  </div>
);
};

export default Messages;
