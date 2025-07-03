import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import RequestForm from '../../components/RequestForm/RequestForm';
import RequestList from '../../components/RequestList/RequestList';
import './HomePage.css';

const HomePage = ({ user, userType, onLogout }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [location, setLocation] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [userType, user]);

  const loadProperties = async () => {
    try {
      let endpoint = '';
      if (userType === 'owner') {
        endpoint = `owner/myAllProperties?ownerId=${user.id}`;
      } else {
        // For latent users, get properties by location
        if (location) {
          endpoint = `property/Property/searchByLocation?location=${location}`;
        } else {
          endpoint = 'property/Property/getAllProperties';
        }
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (location.trim()) {
      loadProperties();
    }
  };

  const handleRequestProperty = (property) => {
    setSelectedProperty(property);
    setShowRequestForm(true);
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/latent/Latent/RequestForProperty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          latentId: user.id,
          propertyId: selectedProperty.id
        }),
      });

      if (response.ok) {
        alert('Request submitted successfully!');
        setShowRequestForm(false);
        setSelectedProperty(null);
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Sheltr</h1>
        <nav>
          <Link to="/profile">Profile</Link>
          {userType === 'owner' && <Link to="/add-property">Add Property</Link>}
          {userType === 'owner' && (
            <button onClick={() => setShowRequests(!showRequests)}>
              {showRequests ? 'Hide Requests' : 'View Requests'}
            </button>
          )}
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>

      <main className="home-content">
        {userType === 'latent' && (
          <div className="search-section">
            <h2>Find Properties Near You</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button onClick={handleLocationSearch}>Search</button>
            </div>
          </div>
        )}

        {userType === 'owner' && showRequests && (
          <RequestList userId={user.id} userType={userType} />
        )}

        <div className="properties-section">
          <h2>
            {userType === 'owner' ? 'My Properties' : 'Available Properties'}
          </h2>
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                userType={userType}
                onRequestProperty={handleRequestProperty}
              />
            ))}
          </div>
        </div>
      </main>

      {showRequestForm && (
        <RequestForm
          property={selectedProperty}
          onSubmit={handleRequestSubmit}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
};

export default HomePage;