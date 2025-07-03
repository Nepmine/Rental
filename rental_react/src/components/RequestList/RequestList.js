import React, { useState, useEffect } from 'react';
import './RequestList.css';

const RequestList = ({ userId, userType }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [userId, userType]);

  const loadRequests = async () => {
    try {
      const endpoint = userType === 'owner' 
        ? `owner/GetAllRequests?ownerId=${userId}`
        : `latent/Latent/GetAllRequests?latentId=${userId}`;
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="request-list">
      <h2>{userType === 'owner' ? 'Property Requests' : 'My Requests'}</h2>
      {requests.length === 0 ? (
        <p className="no-requests">No requests found.</p>
      ) : (
        <div className="requests-grid">
          {requests.map((request, index) => (
            <div key={index} className="request-card">
              <h3>{request.name}</h3>
              <p className="request-address">{request.address}</p>
              <p className="request-description">{request.description}</p>
              <div className="request-status">
                <span className={`status ${request.status?.toLowerCase()}`}>
                  {request.status || 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;