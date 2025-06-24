import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../screens-styles/circle.css';
import { FaComments } from 'react-icons/fa';

const Circle = () => {
  const [citizens, setCitizens] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [areaDetailsMap, setAreaDetailsMap] = useState({});
  const [designationDetailsMap, setDesignationDetailsMap] = useState({});

  useEffect(() => {
    axios.get('https://designation-service.onrender.com/citizen')
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
          const res = await axios.get(`https://designation-service.onrender.com/areas/${citizen.areaId}`);
          setAreaDetailsMap(prev => ({ ...prev, [citizen.areaId]: res.data }));
        } catch (error) {
          console.error("Error fetching area details:", error);
        }
      }

      if (citizen.designationId && !designationDetailsMap[citizen.designationId]) {
        try {
          const res = await axios.get(`https://designation-service-ci54.onrender.com/designation/${citizen.designationId}`);
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
    window.location.reload();
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
                  <p><strong>Age : </strong> {citizen.age}</p>
                  <p><strong>Gender : </strong>{citizen.gender}</p>
                  <p><strong>Area Name : </strong> {areaDetails.name}</p>
                  {/* <p><strong>Area About : </strong>{areaDetails.description || areaDetails.about}</p> */}
                  <p><strong>Profession : </strong> {designationDetails.profession}</p>
                  {/* <p><strong>Profession About : </strong>{designationDetails.about}</p> */}

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
