import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import HomePage from './pages/HomePage/HomePage';
import AddEditProperty from './pages/AddEditProperty/AddEditProperty';
import PropertyDetails from './components/PropertyDetails/PropertyDetails';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
  }, []);

  const handleLogin = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Registration /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/home" 
            element={user ? <HomePage user={user} userType={userType} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-property" 
            element={user && userType === 'owner' ? <AddEditProperty user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-property/:id" 
            element={user && userType === 'owner' ? <AddEditProperty user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/property/:id" 
            element={user ? <PropertyDetails user={user} userType={userType} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} userType={userType} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
