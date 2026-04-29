import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchGroups = () => {
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Added for navigation

    // ADDED: Environment variable for network access
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchAllGroups = async () => {
            try {
                // UPDATED: Used API_URL instead of hardcoded localhost
                const response = await axios.get(`${API_URL}/api/groups`);
                setGroups(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };
        fetchAllGroups();
    }, [API_URL]);

    const handleJoin = async (groupId) => {
        try {
            const token = localStorage.getItem('token');
            
            // UPDATED: Used API_URL instead of hardcoded localhost
            const response = await axios.post(`${API_URL}/api/groups/join/${groupId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.msg || "Successfully joined!");
            navigate('/dashboard'); 
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to join group.");
        }
    };

    
    const filteredGroups = groups.filter(g => 
        (g.GroupName && g.GroupName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (g.CourseCode && g.CourseCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-2xl font-bold mb-4">Find Study Groups</h1>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    ← Back to Dashboard
                </button>
            </div>
            
            <input 
                type="text" 
                placeholder="Search by name or course code..." 
                style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ddd' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <div key={group.GroupID} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                            <h3 style={{ margin: '0 0 5px 0' }}>{group.GroupName}</h3>
                            <p style={{ color: '#007bff', fontWeight: 'bold', margin: '0 0 10px 0' }}>{group.CourseCode}</p>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>{group.Description || "No description provided."}</p>
                            <button 
                                onClick={() => handleJoin(group.GroupID)}
                                style={{ marginTop: '15px', width: '100%', backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Join Group
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No groups found matching your search.</p>
                )}
            </div>
                <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                &copy;UCU study groups system
                </footer>
        </div>
    );
};

export default SearchGroups;
