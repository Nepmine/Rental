import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEditProperty.css';

const AddEditProperty = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    propDesc: '',
    address: '',
    status: 'Available',
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const statusOptions = ['Available', 'Occupied', 'Under Maintenance', 'Sold'];
  const preferenceOptions = ['Any', 'Family Only', 'Married Couples', 'No Bachelors', 'Students Welcome', 'Professionals Only'];

  const getStatusIcon = (status) => {
    const icons = {
      'Available': '✅',
      'Occupied': '🏠',
      'Under Maintenance': '🔧',
      'Sold': '💰'
    };
    return icons[status] || '✅';
  };

  const getPreferenceIcon = (preference) => {
    const icons = {
      'Any': '🏠',
      'Family Only': '👨‍👩‍👧‍👦',
      'Married Couples': '💑',
      'No Bachelors': '🚫👨‍💼',
      'Students Welcome': '🎓',
      'Professionals Only': '💼'
    };
    return icons[preference] || '🏠';
  };

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property/Property/getPropertyById?propertyId=${propertyId}`);
      if (response.ok) {
        const property = await response.json();
        setFormData({
          name: property.name || '',
          propDesc: property.propDesc || '',
          address: property.address || '',
          status: property.status || 'Available',
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

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    let updatedPreferences = [...formData.preferences];
    
    if (value === 'Any') {
      updatedPreferences = checked ? ['Any'] : [];
    } else {
      if (checked) {
        updatedPreferences = updatedPreferences.filter(pref => pref !== 'Any');
        updatedPreferences.push(value);
      } else {
        updatedPreferences = updatedPreferences.filter(pref => pref !== value);
      }
      
      if (updatedPreferences.length === 0) {
        updatedPreferences = ['Any'];
      }
    }
    
    setFormData({
      ...formData,
      preferences: updatedPreferences
    });
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          title: '',
          description: ''
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (imageId) => {
    setImagePreviews(prev => prev.filter(img => img.id !== imageId));
    setImageFiles(prev => prev.filter(file => file.name !== imageId));
  };

  const handleImageInfoChange = (imageId, field, value) => {
    setImagePreviews(prev => prev.map(img => 
      img.id === imageId ? { ...img, [field]: value } : img
    ));
  };

  const uploadImages = async () => {
    const uploadedPhotos = [];
    
    for (const preview of imagePreviews) {
      if (preview.file) {
        const formData = new FormData();
        formData.append('image', preview.file);
        
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload/image`, {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            uploadedPhotos.push({
              title: preview.title || preview.file.name,
              photoDesc: preview.description || '',
              profilePhoto: result.url, // Assuming the API returns the image URL
              photoPath: [result.url]
            });
          }
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
    }
    
    return uploadedPhotos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      const uploadedPhotos = await uploadImages();
      
      const propertyData = {
        ...formData,
        ownerId: user.id,
        photos: [...formData.photos, ...uploadedPhotos], // Merge existing and new photos
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

        <div className="form-group">
          <label>Status:</label>
          <div className="status-select-container">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="status-select"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className={`status-indicator ${formData.status.toLowerCase().replace(' ', '-')}`}>
              {getStatusIcon(formData.status)}
            </div>
          </div>
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

        <div className="preferences-section">
          <h3>Tenant Preferences</h3>
          <div className="preferences-container">
            {preferenceOptions.map(preference => (
              <div 
                key={preference} 
                className={`preference-card ${formData.preferences.includes(preference) ? 'selected' : ''}`}
                onClick={() => handlePreferenceChange({ target: { value: preference, checked: !formData.preferences.includes(preference) } })}
              >
                <div className="preference-icon">
                  {getPreferenceIcon(preference)}
                </div>
                <span className="preference-label">{preference}</span>
                <div className="preference-check">
                  {formData.preferences.includes(preference) && '✓'}
                </div>
              </div>
            ))}
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

        <div className="photos-section">
          <h3>Property Photos</h3>
          
          {/* Existing photos display */}
          {formData.photos.length > 0 && (
            <div className="existing-photos">
              <h4>Current Photos</h4>
              <div className="photo-grid">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo.profilePhoto} alt={photo.title} />
                    <div className="photo-overlay">
                      <p>{photo.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image upload */}
          <div className="form-group">
            <label>Upload New Photos:</label>
            <div className="file-upload-container">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                id="photo-upload"
                className="file-input"
              />
              <label htmlFor="photo-upload" className="file-upload-label">
                <div className="upload-icon">📸</div>
                <div>Choose Photos</div>
                <div className="upload-hint">Click to select multiple images</div>
              </label>
            </div>
          </div>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              <h4>New Photos Preview</h4>
              <div className="preview-grid">
                {imagePreviews.map(preview => (
                  <div key={preview.id} className="image-preview-card">
                    <div className="preview-image-container">
                      <img 
                        src={preview.url} 
                        alt="Preview" 
                        className="preview-image"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleImageRemove(preview.id)}
                        className="remove-image-btn"
                      >
                        ×
                      </button>
                    </div>
                    <div className="image-info">
                      <input
                        type="text"
                        placeholder="Image title"
                        value={preview.title}
                        onChange={(e) => handleImageInfoChange(preview.id, 'title', e.target.value)}
                        className="image-title-input"
                      />
                      <textarea
                        placeholder="Image description"
                        value={preview.description}
                        onChange={(e) => handleImageInfoChange(preview.id, 'description', e.target.value)}
                        className="image-desc-input"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Property' : 'Add Property')}
        </button>
      </form>
    </div>
  );
};


export default AddEditProperty;