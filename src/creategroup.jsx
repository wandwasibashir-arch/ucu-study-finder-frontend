import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const CreateGroup = () => { 
  const [formData, setFormData] = useState({ GroupName: '', CourseCode: '', Description: '', Faculty: '', MeetingLocation: '' // Matches backend variable 
  }); 
  const navigate = useNavigate(); 

  // UPDATED: Smart URL logic to work on both PC (localhost) and Phone (IP) 
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : (process.env.REACT_APP_API_URL || 'http://localhost:5000'); 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try { 
      const token = localStorage.getItem('token'); 
      // UPDATED: Use smart API_URL instead of hardcoded localhost 
      await axios.post(`${API_URL}/api/groups/create`, formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      }); 

      // UPDATED: Replaced alert with window.Swal success popup
      window.Swal.fire({
        title: 'Group Created!',
        text: 'Group Created Successfully!',
        icon: 'success',
        confirmButtonColor: '#28a745'
      });

      navigate('/dashboard'); 
    } catch (err) { 
      // UPDATED: Replaced alert with window.Swal error popup
      window.Swal.fire({
        title: 'Error',
        text: err.response?.data?.error || "Server error",
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } 
  }; 

  return ( 
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}> 
      {/* ADDED: Header section with Back to Dashboard option */} 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}> 
        <h2 style={{ margin: 0 }}>Create New Study Group</h2> 
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }} > Back to Dashboard </button> 
      </div> 
      <form onSubmit={handleSubmit}> 
        <input style={inputStyle} placeholder="Group Name" onChange={e => setFormData({...formData, GroupName: e.target.value})} required /> 
        <input style={inputStyle} placeholder="Course Code" onChange={e => setFormData({...formData, CourseCode: e.target.value})} required /> 
        <input style={inputStyle} placeholder="Faculty" onChange={e => setFormData({...formData, Faculty: e.target.value})} /> 
        {/* NEW FIELD */} 
        <input style={inputStyle} placeholder="Meeting Location or Link" onChange={e => setFormData({...formData, MeetingLocation: e.target.value})} /> 
        <textarea style={inputStyle} placeholder="Description" onChange={e => setFormData({...formData, Description: e.target.value})} /> 
        <button type="submit" style={btnStyle}>Create Group</button> 
      </form> 
      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}> 
        &copy;UCU study groups system 
      </footer> 
    </div> 
  ); 
}; 

const inputStyle = { width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }; 
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }; 

export default CreateGroup;
