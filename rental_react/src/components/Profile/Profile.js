import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ user, userType }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, [user.id, userType]);

  const loadProfile = async () => {
    try {
      const endpoint = userType === 'owner' 
        ? `owner/Profile?id=${user.id}`
        : `latent/LatentController/Profile?id=${user.id}`;
      
      const response = await fetch(`${process.env.backendUrl}/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          description: data.description || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Note: You'll need to implement update profile endpoints in your backend
      const endpoint = userType === 'owner' 
        ? 'owner/UpdateProfile'
        : 'latent/LatentController/UpdateProfile';
      
      const response = await fetch(`${process.env.backendUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: user.id
        }),
      });

      if (response.ok) {
        setProfile({ ...profile, ...formData });
        setEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back to Home
        </button>
        <h1>Profile</h1>
        <button onClick={() => setEditing(!editing)} className="edit-btn">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile:</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>

                {userType === 'latent' && (
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <h2>{profile?.name}</h2>
                <p className="user-type">{userType === 'owner' ? 'Property Owner' : 'Tenant'}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Mobile:</strong> {profile?.mobile || 'Not provided'}</p>
                {userType === 'latent' && profile?.description && (
                  <p><strong>About:</strong> {profile.description}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{userType === 'owner' ? 'Properties' : 'Requests'}</h3>
            <p className="stat-number">
              {userType === 'owner' 
                ? profile?.properties?.length || 0 
                : profile?.requests?.length || 0}
            </p>
          </div>
          
          {userType === 'latent' && (
            <div className="stat-card">
              <h3>Favorites</h3>
              <p className="stat-number">{profile?.favourites?.length || 0}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;