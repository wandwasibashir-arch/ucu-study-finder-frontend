import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import StudentDashboard from './studentdashboard';
import CreateGroup from './creategroup';
import SearchGroups from './searchgroups';
import GroupDetails from './groupdetails';
import AdminDashboard from './AdminDashboard';
import Profile from './profile'; // Import the new Profile component

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        
        {/* ADDED: Route for the Profile page */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchGroups /></ProtectedRoute>} />
        <Route path="/group/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
