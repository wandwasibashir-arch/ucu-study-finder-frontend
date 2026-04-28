import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [sessionInput, setSessionInput] = useState({ 
        SessionDate: '', 
        SessionTime: '', 
        LocationLink: '', 
        SessionDescription: '' 
    });

    const fetchData = async () => {
        try {
            const [groupRes, memberRes, annRes, sessionRes] = await Promise.all([
                axios.get(`${API_URL}/api/groups/details/${id}`, config),
                axios.get(`${API_URL}/api/groups/members/${id}`, config),
                axios.get(`${API_URL}/api/groups/announcements/${id}`, config),
                axios.get(`${API_URL}/api/groups/sessions/${id}`, config)
            ]);
            setGroup(Array.isArray(groupRes.data) ? groupRes.data[0] : groupRes.data);
            setMembers(memberRes.data || []);
            setAnnouncements(annRes.data || []);
            setSessions(sessionRes.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to load study room data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [id]);

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            await axios.post(`${API_URL}/api/groups/announcements/${id}`, { Message: message }, config);
            setMessage("");
            fetchData();
        } catch (err) {
            alert("Error posting announcement.");
        }
    };

    const handleScheduleSession = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/groups/sessions`, { ...sessionInput, GroupID: id }, config);
            setShowSessionForm(false);
            setSessionInput({ SessionDate: '', SessionTime: '', LocationLink: '', SessionDescription: '' });
            fetchData();
        } catch (err) {
            alert("Error scheduling session.");
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm("Are you sure you want to leave this study group?")) {
            try {
                await axios.delete(`${API_URL}/api/groups/leave/${id}`, config);
                alert("Successfully left the group.");
                navigate('/dashboard');
            } catch (err) {
                alert(err.response?.data?.msg || "Error leaving group.");
            }
        }
    };

    // --- ADDED: MEMBER REMOVAL LOGIC ---
    const handleRemoveMember = async (targetUserId, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from the group?`)) {
            try {
                await axios({
                    method: 'delete',
                    url: `${API_URL}/api/groups/remove-member`,
                    headers: { Authorization: `Bearer ${token}` },
                    data: { 
                        GroupID: id, 
                        TargetUserID: targetUserId 
                    }
                });
                alert("Member removed.");
                fetchData(); // Refresh member list
            } catch (err) {
                console.error("Removal Error:", err.response?.data);
                alert(err.response?.data?.msg || "Error removing member.");
            }
        }
    };

    if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Study Room...</div>;
    if (error) return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>{error}</div>;
    if (!group) return <div style={{padding: '50px', textAlign: 'center'}}>Group not found.</div>;

    const isLeader = Number(currentUserId) === Number(group.LeaderID);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: '1px solid #ddd' }}> 
                ← Back to Dashboard 
            </button>

            <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                {/* Left Side: Sessions & Announcements */}
                <div style={{ flex: 2 }}>
                    <h1>{group.GroupName}</h1>
                    <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{group.CourseCode} | {group.Faculty}</p>

                    {/* Sessions Section */}
                    <div style={{ marginBottom: '30px', padding: '20px', background: '#f0fdf4', borderRadius: '15px', border: '1px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>🗓️ Upcoming Sessions</h3>
                            <button onClick={() => setShowSessionForm(!showSessionForm)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} >
                                {showSessionForm ? "Cancel" : "+ Schedule"}
                            </button>
                        </div>

                        {showSessionForm && (
                            <form onSubmit={handleScheduleSession} style={{ display: 'grid', gap: '12px', marginBottom: '20px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="date" required style={inputStyle} value={sessionInput.SessionDate} onChange={e => setSessionInput({...sessionInput, SessionDate: e.target.value})} />
                                    <input type="time" required style={inputStyle} value={sessionInput.SessionTime} onChange={e => setSessionInput({...sessionInput, SessionTime: e.target.value})} />
                                </div>
                                <input placeholder="Location Link (Zoom/Room)" style={inputStyle} value={sessionInput.LocationLink} onChange={e => setSessionInput({...sessionInput, LocationLink: e.target.value})} />
                                <textarea placeholder="Topic/Description" style={inputStyle} value={sessionInput.SessionDescription} onChange={e => setSessionInput({...sessionInput, SessionDescription: e.target.value})} />
                                <button type="submit" style={{ background: '#16a34a', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save Session</button>
                            </form>
                        )}

                        {sessions.length > 0 ? sessions.map(s => (
                            <div key={s.SessionID} style={{ background: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '10px', borderLeft: '5px solid #16a34a' }}>
                                <strong>{new Date(s.SessionDate).toDateString()}</strong> - {s.SessionTime}
                                <p style={{margin: '5px 0', fontSize: '14px'}}>{s.SessionDescription}</p>
                                {s.LocationLink ? (
                                    <a href={s.LocationLink.startsWith('http') ? s.LocationLink : `https://${s.LocationLink}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontSize: '13px', textDecoration: 'underline', fontWeight: 'bold' }}>
                                        Join Session →
                                    </a>
                                ) : <span style={{ color: '#999', fontSize: '12px' }}>No link provided</span>}
                            </div>
                        )) : <p style={{color: '#666', fontSize: '14px'}}>No sessions scheduled yet.</p>}
                    </div>

                    {/* Announcements Section */}
                    <h3>📢 Announcements</h3>
                    <form onSubmit={handlePostAnnouncement} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <input placeholder="Share an update..." style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} value={message} onChange={(e) => setMessage(e.target.value)} />
                        <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Post</button>
                    </form>
                    {announcements.map(a => (
                        <div key={a.AnnouncementID} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '10px', background: '#fff' }}>
                            <strong style={{fontSize: '14px'}}>{a.FullName}</strong>
                            <p style={{margin: '5px 0'}}>{a.Message}</p>
                        </div>
                    ))}
                </div>

                {/* Right Side: Members List */}
                <div style={{ flex: 1 }}>
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginTop: 0 }}>👥 Members ({members.length})</h3>
                        <div style={{ marginBottom: '20px' }}>
                            {members.map((m, index) => (
                                <div key={index} style={{ padding: '8px 0', borderBottom: index !== members.length - 1 ? '1px solid #eee' : 'none', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{m.FullName}</span>
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        {Number(m.UserID) === Number(group.LeaderID) ? (
                                            <span style={{fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '10px'}}>Leader</span>
                                        ) : (
                                            // Only show Remove button if the current user is the leader
                                            isLeader && (
                                                <button 
                                                    onClick={() => handleRemoveMember(m.UserID, m.FullName)}
                                                    style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: '5px', cursor: 'pointer' }}
                                                >
                                                    Remove
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!isLeader ? (
                            <button onClick={handleLeaveGroup} style={{ width: '100%', padding: '12px', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                🚪 Leave Group
                            </button>
                        ) : (
                            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
                                You are the leader of this group.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                UCU 2026 study groups system
            </footer>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };

export default GroupDetails;
