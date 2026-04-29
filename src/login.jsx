import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const Login = () => { 
  const [formData, setFormData] = useState({ Email: '', Password: '' }); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  // UPDATED: Smart URL logic to work on both PC (localhost) and Phone (IP) 
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : (process.env.REACT_APP_API_URL || 'http://192.168.50.43:5000'); 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try { 
      // Using the smart API_URL 
      const res = await axios.post(`${API_URL}/api/auth/login`, formData); 
      localStorage.setItem('token', res.data.token); 
      localStorage.setItem('userId', res.data.user.UserID || res.data.user.id); 

      // UPDATED: Added window.Swal for clean success popup
      window.Swal.fire({
        title: 'Success!',
        text: 'Login Successful!',
        icon: 'success',
        confirmButtonColor: '#28a745'
      });

      const userRole = (res.data.user.Role || res.data.user.role || "").toLowerCase(); 
      if (userRole === 'admin') { 
        navigate('/admin'); 
      } else { 
        navigate('/dashboard'); 
      } 
    } catch (err) { 
      console.error("Login Error:", err); 
      
      // UPDATED: Replaced native alert with window.Swal error popup
      window.Swal.fire({
        title: 'Login Failed',
        text: err.response?.data?.error || "Server error",
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } 
  }; 

  return ( 
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff' }}> 
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Login</h2> 
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> 
        <input type="email" placeholder="Email" required style={inputStyle} onChange={e => setFormData({...formData, Email: e.target.value})} /> 
        
        {/* --- PROFESSIONAL EYE TOGGLE --- */} 
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}> 
          <input type={showPassword ? "text" : "password"} placeholder="Password" required style={{ ...inputStyle, width: '100%', paddingRight: '45px' }} onChange={e => setFormData({...formData, Password: e.target.value})} /> 
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} > 
            {showPassword ? ( 
              <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> 
            ) : ( 
              <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> 
            )} 
          </button> 
        </div> 
        <button type="submit" style={btnStyle}>Login</button> 
      </form> 
      <p style={{ textAlign: 'center', marginTop: '15px' }}> 
        Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'blue', cursor: 'pointer' }}>Register</span> 
      </p> 
      <footer style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '15px' }}> 
        &copy;UCU study groups system 
      </footer> 
    </div> 
  ); 
}; 

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }; 
const btnStyle = { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }; 

export default Login;
