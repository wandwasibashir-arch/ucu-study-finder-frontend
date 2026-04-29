import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
// Import the UCU logo
import ucuLogo from './assets/ucu-logo.png'; 

const StudentDashboard = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [userProfile, setUserProfile] = useState({ FullName: '', Program: '', YearOfStudy: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return navigate('/');
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
          const profileRes = await axios.get(`${API_URL}/api/auth/me`, config);
          const data = profileRes.data;
          if (data && Array.isArray(data) && data.length > 0) {
            setUserProfile(data[0]);
          } else if (data && !Array.isArray(data)) {
            setUserProfile(data);
          }
        } catch (pErr) {
          console.error("Profile Fetch Error:", pErr);
          setUserProfile({ FullName: 'User Profile', Program: 'Error Loading', YearOfStudy: 'N/A' });
        }

        const myRes = await axios.get(`${API_URL}/api/groups/my-groups`, config);
        const joinedGroups = Array.isArray(myRes.data) ? myRes.data : [];
        setMyGroups(joinedGroups);

        const allRes = await axios.get(`${API_URL}/api/groups`, config);
        const allData = Array.isArray(allRes.data) ? allRes.data : [];
        const recommended = allData.filter(g => !joinedGroups.some(myG => myG.GroupID === g.GroupID));
        setAllGroups(recommended);
      } catch (err) {
        console.error("Dashboard Global Fetch Error:", err);
        if (err.response?.status === 401) handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, API_URL]);

  const enterGroup = (id) => {
    if (id) navigate(`/group/${id}`);
    else alert("Error: This group has an invalid ID.");
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading your Study Hub...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="max-w-6xl mx-auto">
        <header className="main-header">
          {/* UPDATED: Brand section with Logo */}
          <div className="header-brand">
            <img 
              src={ucuLogo} 
              alt="UCU Logo" 
              className="university-logo" 
              style={{ width: '50px', height: 'auto' }} 
            />
            <div className="header-text">
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                Uganda Christian University Student Study Group Finder
              </h1>
              <h1>Student Dashboard</h1>
              <div className="profile-info-banner">
                <p>
                  Welcome back, <strong>{userProfile?.FullName || "Student"}</strong>!
                </p>
                <p className="sub-text">
                  {userProfile?.Program || "Not Assigned"} | Year {userProfile?.YearOfStudy || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button onClick={() => navigate('/profile')} className="btn btn-profile">👤 Profile & Settings</button>
            <button onClick={() => navigate('/create-group')} className="btn btn-create">+ Create Group</button>
            <button onClick={() => navigate('/search')} className="btn btn-search">🔍 Find Groups</button>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </div>
        </header>

        <section className="section">
          <div className="section-title">
            <span className="dot blue"></span>
            <h2>My Enrolled Groups ({myGroups.length})</h2>
          </div>
          {myGroups.length > 0 ? (
            <div className="card-grid">
              {myGroups.map(group => (
                <div key={group.GroupID} className="glass-card active-card" onClick={() => enterGroup(group.GroupID)}>
                  <div className="card-top">
                    <span className="badge blue">{group.CourseCode}</span>
                    <h3 className="group-name">{group.GroupName}</h3>
                    <p className="group-desc">{group.Description || "No description provided."}</p>
                  </div>
                  <div className="card-footer">
                    <div className="location">📍 {group.MeetingLocation || "Location Pending"}</div>
                    <button className="enter-btn">Open Room →</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No active groups found. Time to join one!</p>
              <button onClick={() => navigate('/search')}>Browse Available Groups</button>
            </div>
          )}
        </section>

        {allGroups.length > 0 && (
          <section className="section">
            <div className="section-title">
              <span className="dot purple"></span>
              <h2>Suggested for You</h2>
            </div>
            <div className="rec-grid">
              {allGroups.slice(0, 4).map(group => (
                <div key={group.GroupID} className="glass-card rec-card">
                  <h4>{group.GroupName}</h4>
                  <span className="rec-code">{group.CourseCode}</span>
                  <button onClick={() => enterGroup(group.GroupID)} className="btn-small">View Details</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        &copy;UCU study groups system
      </footer>
    </div>
  );
};

export default StudentDashboard;