import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import '../../components/screens-styles/profile.css';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    mobile: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    areaId: '',
    designationId: '',
  });

  const [areas, setAreas] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [areaAbout, setAreaAbout] = useState('');
  const [professionAbout, setProfessionAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ NEW: block UI until data ready

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      const username = decoded.username || '';
      const email = decoded.email || '';
      const mobile = decoded.sub || decoded.mobile || '';

      setUserInfo({ username, email, mobile });

      fetchCitizen(username);
    }

    fetchAreas();
    fetchProfessions();
  }, []);

  const fetchCitizen = async (username) => {
    try {
      const res = await axios.get(`/citizen/username/${username}`);
      const citizen = res.data;

      setFormData({
        name: citizen.name || '',
        age: citizen.age || '',
        gender: citizen.gender || '',
        areaId: citizen.area?.id || '',
        designationId: citizen.designation?.id || '',
      });

      setAreaAbout(citizen.area?.about || '');
      setProfessionAbout(citizen.designation?.about || '');

      setProfileExists(true);
      localStorage.setItem('profileExists', 'true');
    } catch (err) {
      console.log('No profile found yet.');
      setProfileExists(false);
      localStorage.setItem('profileExists', 'false');
    } finally {
      setLoading(false); // ✅ render now
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await axios.get('/areas');
      setAreas(res.data);
    } catch (err) {
      console.error('Failed to load areas');
    }
  };

  const fetchProfessions = async () => {
    try {
      const res = await axios.get('https://designation-service-ci54.onrender.com/designation');
      setProfessions(res.data);
    } catch (err) {
      console.error('Failed to load professions');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAreaSelect = (e) => {
    const areaId = parseInt(e.target.value);
    const selectedArea = areas.find((area) => area.id === areaId);
    setAreaAbout(selectedArea?.about || '');
    setFormData((prev) => ({ ...prev, areaId }));
  };

  const handleProfessionSelect = (e) => {
    const designationId = parseInt(e.target.value);
    const selected = professions.find((p) => p.id === designationId);
    setProfessionAbout(selected?.about || '');
    setFormData((prev) => ({ ...prev, designationId }));
  };

  const handleSubmit = async () => {
    try {
      const citizenPayload = {
        username: userInfo.username,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        area: { id: formData.areaId },
        designation: { id: formData.designationId },
      };

      if (profileExists && isEditing) {
        await axios.put('/citizen', citizenPayload);
        alert('Profile updated successfully!');
      } else {
        await axios.post('/citizen', citizenPayload);
        alert('Profile submitted successfully!');
      }

      await fetchCitizen(userInfo.username);
      setIsEditing(false);
      setProfileExists(true);
      localStorage.setItem('profileExists', 'true');
    } catch (err) {
      console.error('Submission failed', err);
      alert('Failed to submit profile');
    }
  };

  // ✅ Wait for loading before showing anything
  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      <div className="readonly-section">
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Mobile:</strong> {userInfo.mobile}</p>
      </div>

      {(profileExists && !isEditing) ? (
        <div className="view-profile">
          <h3>Profile Details</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Area:</strong> {areas.find((a) => a.id === formData.areaId)?.name}</p>
          <p><strong>About Area:</strong> {areaAbout}</p>
          <p><strong>Profession:</strong> {professions.find((p) => p.id === formData.designationId)?.profession}</p>
          <p><strong>About Profession:</strong> {professionAbout}</p>
          <button className="submit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <div className="edit-section">
          <h3>{profileExists ? 'Edit Your Profile' : 'Complete Your Profile'}</h3>
          <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
          <input type="number" placeholder="Age" name="age" value={formData.age} onChange={handleChange} />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select name="areaId" value={formData.areaId} onChange={handleAreaSelect}>
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
          {areaAbout && <p className="info-text"><strong>About Area:</strong> {areaAbout}</p>}

          <select name="designationId" value={formData.designationId} onChange={handleProfessionSelect}>
            <option value="">Select Profession</option>
            {professions.map((p) => (
              <option key={p.id} value={p.id}>{p.profession}</option>
            ))}
          </select>
          {professionAbout && <p className="info-text"><strong>About Profession:</strong> {professionAbout}</p>}

          <button className="submit-btn" onClick={handleSubmit}>
            {profileExists ? 'Update Profile' : 'Submit Profile'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
