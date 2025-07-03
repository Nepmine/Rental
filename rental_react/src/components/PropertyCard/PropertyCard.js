import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property, userType, onRequestProperty }) => {
  const handleRequestClick = (e) => {
    e.preventDefault();
    onRequestProperty(property);
  };

  return (
    <div className="property-card">
      <div className="property-image">
        {property.photos && property.photos.length > 0 ? (
          <img src={property.photos[0].profilePhoto} alt={property.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="property-info">
        <h3>{property.name}</h3>
        <p className="property-address">{property.address}</p>
        
        <div className="property-price">
          {property.price?.rent && (
            <span className="rent">₹{property.price.rent}/month</span>
          )}
          {property.price?.sellingPrice && (
            <span className="selling-price">₹{property.price.sellingPrice}</span>
          )}
        </div>
        
        <div className="property-stats">
          <span className="likes">❤️ {property.likes}</span>
          <span className={`status ${property.status.toLowerCase()}`}>
            {property.status}
          </span>
        </div>
        
        <div className="property-actions">
          <Link to={`/property/${property.id}`} className="details-btn">
            View Details
          </Link>
          {userType === 'latent' && property.status === 'Available' && (
            <button onClick={handleRequestClick} className="request-btn">
              Request
            </button>
          )}
          {userType === 'owner' && (
            <Link to={`/edit-property/${property.id}`} className="edit-btn">
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;