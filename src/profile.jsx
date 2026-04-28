import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Reusing your dashboard styles for consistency

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${API_URL}/api/auth/me`, config);
                
                // Handling both array and object responses based on your dashboard logic
                const data = res.data;
                setUserProfile(Array.isArray(data) ? data[0] : data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, API_URL]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Note: This endpoint (/api/auth/reset-password) must exist on your backend
            await axios.put(`${API_URL}/api/auth/reset-password`, { password: newPassword }, config);
            
            setMessage("Password updated successfully!");
            setNewPassword('');
        } catch (err) {
            setMessage("Failed to update password. Try again.");
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-wrapper">
            <div className="max-w-6xl mx-auto">
                <header className="main-header">
                    <div className="header-text">
                        <h1>User Profile & Settings</h1>
                        <p>Manage your account information and security</p>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-search">← Back to Dashboard</button>
                    </div>
                </header>

                <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* User Details Section */}
                    <section className="glass-card active-card" style={{ cursor: 'default' }}>
                        <div className="card-top">
                            <span className="badge blue">Account Info</span>
                            <h3 style={{ marginTop: '15px' }}>{userProfile?.FullName}</h3>
                            <div style={{ lineHeight: '2', marginTop: '10px' }}>
                                <p><strong>Email:</strong> {userProfile?.Email}</p>
                                <p><strong>Program:</strong> {userProfile?.Program || 'N/A'}</p>
                                <p><strong>Year of Study:</strong> {userProfile?.YearOfStudy || 'N/A'}</p>
                                <p><strong>Role:</strong> {userProfile?.Role}</p>
                            </div>
                        </div>
                    </section>

                    {/* Settings Section (Password Reset) */}
                    <section className="glass-card active-card" style={{ cursor: 'default' }}>
                        <div className="card-top">
                            <span className="badge purple">Security</span>
                            <h3 style={{ marginTop: '15px' }}>Reset Password</h3>
                            <form onSubmit={handlePasswordReset} style={{ marginTop: '15px' }}>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}
                                    required
                                />
                                <button type="submit" className="btn btn-create" style={{ width: '100%' }}>Update Password</button>
                            </form>
                            {message && <p style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

                        </div>
                    </section>
                </div>
            </div>
                            <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            UCU 2026 study groups system
                            </footer>
        </div>
    );
};

export default Profile;
