import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ FullName: '', Email: '', Password: '', Program: '', YearOfStudy: '', Role: '' });
  const navigate = useNavigate();

  // ADDED: Environment variable for network access
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPDATED: Used API_URL instead of hardcoded localhost
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="FullName" placeholder="Full Name" required onChange={handleChange} style={inputStyle} />
        <input type="email" name="Email" placeholder="University Email" required onChange={handleChange} style={inputStyle} />
        <input type="password" name="Password" placeholder="Password" required onChange={handleChange} style={inputStyle} />
        <input type="text" name="Program" placeholder="Program (e.g. BSIT)" required onChange={handleChange} style={inputStyle} />
        <select name="YearOfStudy" required onChange={handleChange} style={inputStyle}>
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
        </select>
        <input type="text" name="Role" placeholder="Role" required onChange={handleChange} style={inputStyle} />
        <button type="submit" style={btnStyle}>Register Student</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}> Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer' }}>Login</span> </p>
      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}> &copy;UCU study groups system </footer>
    </div>
  );
};

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc' };
const btnStyle = { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Register;
