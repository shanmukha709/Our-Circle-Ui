// src/components/Screens/Circle.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Must be at top level
import axios, {
  CITIZEN_SERVICE_BASE_URL,
  DESINATION_SERVICE_BASE_URL
} from '../api/axios';

import '../screens-styles/circle.css';
import { FaComments } from 'react-icons/fa';

const Circle = () => {
  const navigate = useNavigate(); // ✅ React Hook must be top-level

  const [citizens, setCitizens] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [areaDetailsMap, setAreaDetailsMap] = useState({});
  const [designationDetailsMap, setDesignationDetailsMap] = useState({});

  useEffect(() => {
    axios
      .get(`${CITIZEN_SERVICE_BASE_URL}/citizen`)
      .then(response => setCitizens(response.data))
      .catch(error => console.error("Error fetching citizens:", error));
  }, []);

  const handleCardClick = async (citizen) => {
    if (!citizen || !citizen.id) return;

    if (expandedCardId === citizen.id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(citizen.id);

      if (citizen.areaId && !areaDetailsMap[citizen.areaId]) {
        try {
          const res = await axios.get(`${CITIZEN_SERVICE_BASE_URL}/areas/${citizen.areaId}`);
          setAreaDetailsMap(prev => ({ ...prev, [citizen.areaId]: res.data }));
        } catch (error) {
          console.error("Error fetching area details:", error);
        }
      }

      if (citizen.designationId && !designationDetailsMap[citizen.designationId]) {
        try {
          const res = await axios.get(`${DESINATION_SERVICE_BASE_URL}/designation/${citizen.designationId}`);
          setDesignationDetailsMap(prev => ({ ...prev, [citizen.designationId]: res.data }));
        } catch (error) {
          console.error("Error fetching designation details:", error);
        }
      }
    }
  };

  const handleChatClick = (e, citizen) => {
    e.stopPropagation(); // Prevent card toggle
    if (!citizen?.username) return;
    localStorage.setItem("chatUser", citizen.username);
    localStorage.setItem("selectedTab", "messages");
    navigate(`/messages/${citizen.username}`); // ✅ useNavigate used correctly
  };

  return (
    <div className="circle-container">
      <h2 className="circle-title">All Citizens</h2>

      <div className="circle-grid">
        {citizens.map((citizen) => {
          const isExpanded = expandedCardId === citizen.id;
          const areaDetails = citizen.area || areaDetailsMap[citizen.areaId] || {};
          const designationDetails = citizen.designation || designationDetailsMap[citizen.designationId] || {};

          return (
            <div
              key={citizen.id}
              className={`circle-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => handleCardClick(citizen)}
            >
              <div className="circle-avatar">
                {citizen.name?.[0]?.toUpperCase() || '?'}
              </div>
              <h3 className="circle-username">@{citizen.username}</h3>
              <p className="circle-name">{citizen.name}</p>

              {isExpanded && (
                <div className="circle-extra">
                  <p><strong>Age:</strong> {citizen.age}</p>
                  <p><strong>Gender:</strong> {citizen.gender}</p>
                  <p><strong>Area:</strong> {areaDetails.name || '-'}</p>
                  <p><strong>Profession:</strong> {designationDetails.profession || '-'}</p>

                  <div className="chat-icon-wrapper">
                    <FaComments className="chat-icon" onClick={(e) => handleChatClick(e, citizen)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Circle;
