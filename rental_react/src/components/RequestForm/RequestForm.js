import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = ({ property, onSubmit, onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await onSubmit({
      description,
      ownerId: property.ownerId
    });
    
    setLoading(false);
  };

  return (
    <div className="request-form-overlay">
      <div className="request-form-modal">
        <header className="modal-header">
          <h2>Request Property</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </header>
        
        <div className="property-summary">
          <h3>{property.name}</h3>
          <p>{property.address}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Message to Owner:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the owner why you're interested in this property..."
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;