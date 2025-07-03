import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEditProperty.css';

const AddEditProperty = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    propDesc: '',
    address: '',
    price: {
      sellingPrice: '',
      rent: '',
      deposit: ''
    },
    features: [],
    preferences: ['Any'],
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/PropertyController/getPropertyById?propertyId=${propertyId}`);
      if (response.ok) {
        const property = await response.json();
        setFormData({
          name: property.name || '',
          propDesc: property.propDesc || '',
          address: property.address || '',
          price: {
            sellingPrice: property.price?.sellingPrice || '',
            rent: property.price?.rent || '',
            deposit: property.price?.deposit || ''
          },
          features: property.features || [],
          preferences: property.preferences || ['Any'],
          photos: property.photos || []
        });
      }
    } catch (error) {
      console.error('Failed to load property:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('price.')) {
      const priceField = name.split('.')[1];
      setFormData({
        ...formData,
        price: {
          ...formData.price,
          [priceField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFeatureAdd = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { featureName: '', featureDesc: '' }]
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleFeatureRemove = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        ownerId: user.id,
        price: {
          sellingPrice: formData.price.sellingPrice ? parseFloat(formData.price.sellingPrice) : null,
          rent: formData.price.rent ? parseFloat(formData.price.rent) : null,
          deposit: formData.price.deposit ? parseFloat(formData.price.deposit) : null
        }
      };

      let response;
      if (isEdit) {
        propertyData.id = id;
        response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/Property/UpdateProperty`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        });
      } else {
        response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/Property/addProperty`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        });
      }

      if (response.ok) {
        navigate('/home');
      } else {
        alert('Failed to save property');
      }
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-property">
      <header className="page-header">
        <h1>{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
        <button onClick={() => navigate('/home')}>Back to Home</button>
      </header>

      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label>Property Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="propDesc"
            value={formData.propDesc}
            onChange={handleInputChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="price-section">
          <h3>Pricing</h3>
          <div className="price-fields">
            <div className="form-group">
              <label>Selling Price:</label>
              <input
                type="number"
                name="price.sellingPrice"
                value={formData.price.sellingPrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Rent:</label>
              <input
                type="number"
                name="price.rent"
                value={formData.price.rent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Deposit:</label>
              <input
                type="number"
                name="price.deposit"
                value={formData.price.deposit}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Features</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <input
                type="text"
                placeholder="Feature name"
                value={feature.featureName}
                onChange={(e) => handleFeatureChange(index, 'featureName', e.target.value)}
              />
              <input
                type="text"
                placeholder="Feature description"
                value={feature.featureDesc}
                onChange={(e) => handleFeatureChange(index, 'featureDesc', e.target.value)}
              />
              <button type="button" onClick={() => handleFeatureRemove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleFeatureAdd}>
            Add Feature
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Property' : 'Add Property')}
        </button>
      </form>
    </div>
  );
};

export default AddEditProperty;