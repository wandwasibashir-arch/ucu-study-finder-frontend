import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, groups: 0, sessions: 0, announcements: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ADDED: Environment variable for network access
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const deleteItem = async (endpoint, id, stateSetter, currentState, idKey) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // UPDATED: Use API_URL
                await axios.delete(`${API_URL}/api/admin/${endpoint}/${id}`, config);
                stateSetter(currentState.filter(item => item[idKey] !== id));
                alert("Deleted successfully");
            } catch (err) {
                console.error("Delete Error:", err);
                alert("Failed to delete.");
            }
        }
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // UPDATED: All endpoints use API_URL
                const [statsRes, usersRes, groupsRes, sessionsRes, announcementsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/stats`, config),
                    axios.get(`${API_URL}/api/admin/users`, config),
                    axios.get(`${API_URL}/api/admin/groups`, config),
                    axios.get(`${API_URL}/api/admin/sessions`, config),
                    axios.get(`${API_URL}/api/admin/announcements`, config)
                ]);

                setStats(statsRes.data);
                setAllUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
                setAllGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
                setAllSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
                setAllAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data : []);

            } catch (err) {
                console.error("Admin Fetch Error:", err);
                if (err.response?.status === 401) handleLogout();
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [navigate, API_URL]);

    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading Admin Panel...</p></div>;

    return (
        <div className="dashboard-wrapper">
            <div className="max-w-6xl mx-auto">
                <header className="main-header">
                    <div className="header-text">
                        <h1>Admin Dashboard</h1>
                        <p>System Overview & User Management</p>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => navigate('/profile')} className="btn btn-profile">👤 Profile & Settings</button>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-search">Student View</button>
                        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                    </div>
                </header>

                {/* STATS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#007bff' }}>{stats.users}</h2>
                        <p>Total Students</p>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#28a745' }}>{stats.groups}</h2>
                        <p>Study Groups</p>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#ffc107' }}>{stats.sessions}</h2>
                        <p>Planned Sessions</p>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                        <h2 style={{ fontSize: '2rem', color: '#dc3545' }}>{stats.announcements}</h2>
                        <p>Announcements</p>
                    </div>
                </div>

                {/* USERS TABLE */}
                <section className="section" style={{ marginBottom: '40px' }}>
                    <div className="section-title"><h2>Registered Users</h2></div>
                    <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Full Name</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Program</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(user => (
                                    <tr key={user.UserID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>{user.FullName}</td>
                                        <td style={{ padding: '15px' }}>{user.Email}</td>
                                        <td style={{ padding: '15px' }}>{user.Program}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => deleteItem('users', user.UserID, setAllUsers, allUsers, 'UserID')} className="btn btn-logout" style={{ padding: '5px 10px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* STUDY GROUPS TABLE */}
                <section className="section" style={{ marginBottom: '40px' }}>
                    <div className="section-title"><h2>Study Groups</h2></div>
                    <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Group Name</th>
                                    <th style={{ padding: '15px' }}>Course</th>
                                    <th style={{ padding: '15px' }}>Faculty</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allGroups.map(group => (
                                    <tr key={group.GroupID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>{group.GroupName}</td>
                                        <td style={{ padding: '15px' }}>{group.CourseName || group.CourseCode || "N/A"}</td>
                                        <td style={{ padding: '15px' }}>{group.Faculty}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => deleteItem('groups', group.GroupID, setAllGroups, allGroups, 'GroupID')} className="btn btn-logout" style={{ padding: '5px 10px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SESSIONS TABLE */}
                <section className="section" style={{ marginBottom: '40px' }}>
                    <div className="section-title"><h2>Planned Sessions</h2></div>
                    <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Description</th>
                                    <th style={{ padding: '15px' }}>Date</th>
                                    <th style={{ padding: '15px' }}>Time</th>
                                    <th style={{ padding: '15px' }}>Link</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSessions.map(session => (
                                    <tr key={session.SessionID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>{session.SessionDescription || "N/A"}</td>
                                        <td style={{ padding: '15px' }}>{new Date(session.SessionDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px' }}>{session.SessionTime}</td>
                                        <td style={{ padding: '15px' }}>
                                            {session.LocationLink ? <a href={session.LocationLink} target="_blank" rel="noreferrer" style={{color: '#007bff'}}>Join</a> : "No Link"}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => deleteItem('sessions', session.SessionID, setAllSessions, allSessions, 'SessionID')} className="btn btn-logout" style={{ padding: '5px 10px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ANNOUNCEMENTS TABLE */}
                <section className="section" style={{ marginBottom: '40px' }}>
                    <div className="section-title"><h2>Recent Announcements</h2></div>
                    <div className="glass-card" style={{ overflowX: 'auto', padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Group</th>
                                    <th style={{ padding: '15px' }}>Message</th>
                                    <th style={{ padding: '15px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAnnouncements.map(ann => (
                                    <tr key={ann.AnnouncementID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '15px' }}>{ann.GroupName || "General"}</td>
                                        <td style={{ padding: '15px' }}>{ann.Message}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => deleteItem('announcements', ann.AnnouncementID, setAllAnnouncements, allAnnouncements, 'AnnouncementID')} className="btn btn-logout" style={{ padding: '5px 10px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
                            <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            &copy;UCU study groups system
                            </footer>
        </div>
    );
};

export default AdminDashboard;
