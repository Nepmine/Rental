import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetails.css';

const PropertyDetails = ({ user, userType }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const response = await fetch(`${process.env.backendUrl}/property/PropertyController/getPropertyById?propertyId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const response = await fetch('${process.env.backendUrl}/latent/LatentController/AddFavourate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: id,
          latentId: user.id
        }),
      });

      if (response.ok) {
        alert('Added to favorites!');
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!property) {
    return <div className="error">Property not found</div>;
  }

  return (
    <div className="property-details">
      <header className="details-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back
        </button>
        <h1>{property.name}</h1>
        {userType === 'latent' && (
          <button onClick={handleAddToFavorites} className="favorite-btn">
            Add to Favorites
          </button>
        )}
      </header>

      <div className="details-content">
        <div className="property-images">
          {property.photos && property.photos.length > 0 ? (
            property.photos.map((photo, index) => (
              <div key={index} className="photo-section">
                <img src={photo.profilePhoto} alt={photo.title} />
                <h4>{photo.title}</h4>
                {photo.photoDesc && <p>{photo.photoDesc}</p>}
              </div>
            ))
          ) : (
            <div className="no-images">No images available</div>
          )}
        </div>

        <div className="property-info-detailed">
          <div className="basic-info">
            <h2>Property Information</h2>
            <p><strong>Address:</strong> {property.address}</p>
            <p><strong>Status:</strong> {property.status}</p>
            <p><strong>Description:</strong> {property.propDesc}</p>
          </div>

          <div className="pricing-info">
            <h3>Pricing</h3>
            {property.price?.rent && (
              <p><strong>Rent:</strong> ₹{property.price.rent}/month</p>
            )}
            {property.price?.deposit && (
              <p><strong>Deposit:</strong> ₹{property.price.deposit}</p>
            )}
            {property.price?.sellingPrice && (
              <p><strong>Selling Price:</strong> ₹{property.price.sellingPrice}</p>
            )}
          </div>

          {property.features && property.features.length > 0 && (
            <div className="features-list">
              <h3>Features</h3>
              {property.features.map((feature, index) => (
                <div key={index} className="feature">
                  <h4>{feature.featureName}</h4>
                  {feature.featureDesc && <p>{feature.featureDesc}</p>}
                </div>
              ))}
            </div>
          )}

          {property.preferences && property.preferences.length > 0 && (
            <div className="preferences">
              <h3>Preferences</h3>
              <ul>
                {property.preferences.map((pref, index) => (
                  <li key={index}>{pref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;