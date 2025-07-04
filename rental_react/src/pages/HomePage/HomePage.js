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
  const [showFavourites, setShowFavourites] = useState(false);
  const [currentView, setCurrentView] = useState('properties'); // 'properties', 'requests', 'favourites'

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

  const loadMyRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/latent/Latent/GetAllRequests?latentId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyFavourites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/latent/Latent/AllFavourates?latentId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ latentId: user.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to load favourites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (location.trim()) {
      setCurrentView('properties');
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

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowRequests(false);
    setShowFavourites(false);
    
    switch (view) {
      case 'properties':
        loadProperties();
        break;
      case 'favourites':
        loadMyFavourites();
        break;
      default:
        loadProperties();
    }
  };

  const getPageTitle = () => {
    if (userType === 'owner') {
      return showRequests ? 'Property Requests' : 'My Properties';
    } else {
      switch (currentView) {
        case 'requests':
          return 'My Requests';
        case 'favourites':
          return 'My Favourites';
        default:
          return 'Available Properties';
      }
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
          {userType === 'latent' && (
            <>
              <button 
                onClick={() => handleViewChange('properties')}
                className={currentView === 'properties' ? 'active' : ''}
              >
                All Properties
              </button>
              <button 
                onClick={() => handleViewChange('requests')}
                className={currentView === 'requests' ? 'active' : ''}
              >
                My Requests
              </button>
              <button 
                onClick={() => handleViewChange('favourites')}
                className={currentView === 'favourites' ? 'active' : ''}
              >
                My Favourites
              </button>
            </>
          )}
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>

      <main className="home-content">
        {userType === 'latent' && currentView === 'properties' && (
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

        {userType === 'latent' && currentView === 'requests' && (
          <RequestList userId={user.id} userType={userType} />
        )}

        <div className="properties-section">
          <h2>{getPageTitle()}</h2>
          
          {currentView === 'favourites' && properties.length === 0 && (
            <div className="empty-state">
              <p>You haven't added any properties to your favourites yet.</p>
              <button onClick={() => handleViewChange('properties')} className="browse-btn">
                Browse Properties
              </button>
            </div>
          )}

          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                userType={userType}
                onRequestProperty={handleRequestProperty}
                currentView={currentView}
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