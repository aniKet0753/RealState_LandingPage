import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api'; // Import the real axios library
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const AddLeadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const [formData, setFormData] = useState({
    // user_id: localStorage.getItem('user_id') || sessionStorage.getItem('user_id'),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    leadType: '',
    propertyType: '',
    budgetRange: '',
    preferredLocation: '',
    bedrooms: '',
    bathrooms: '',
    timeline: '',
    leadSource: '',
    leadStatus: '',
    notes: '',
    socialMedia: [{ platform: '', handle: '' }],
  });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'bedrooms' || name === 'bathrooms') {
      // Convert to integer, or set to null/empty string for non-numeric input
      processedValue = value !== '' ? parseInt(value, 10) : '';
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: processedValue
    }));
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    const newSocialMedia = [...formData.socialMedia];
    newSocialMedia[index][name] = value;
    setFormData(prevState => ({
      ...prevState,
      socialMedia: newSocialMedia,
    }));
  };

  const handleAddSocialMedia = () => {
    setFormData(prevState => ({
      ...prevState,
      socialMedia: [...prevState.socialMedia, { platform: '', handle: '' }],
    }));
  };

  const handleRemoveSocialMedia = (index) => {
    const newSocialMedia = formData.socialMedia.filter((_, i) => i !== index);
    setFormData(prevState => ({
      ...prevState,
      socialMedia: newSocialMedia,
    }));
  };

  const buildPayload = (data) => {
    const payload = {
      // user_id: data.user_id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      type: data.leadType,
      property_type: data.propertyType,
      budget_range: data.budgetRange,
      preferred_location: data.preferredLocation,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      timeline: data.timeline,
      source: data.leadSource,
      status: data.leadStatus,
      notes: data.notes,
      social_media: data.socialMedia.filter(s => s.platform && s.handle),
    };

    // Remove keys with empty string, null, or undefined
    Object.keys(payload).forEach(
      (key) => (payload[key] === '' || payload[key] === null || payload[key] === undefined) && delete payload[key]
    );

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out any empty social media entries before submission
      const filteredSocialMedia = formData.socialMedia.filter(
        (social) => social.platform && social.handle
      );

      // Construct the data object for submission
      const payload = buildPayload(formData);

      const response = await axios.post('/api/leads', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      console.log('Lead created successfully:', response.data);
      showNotification('Lead created successfully!', 'success');

      setTimeout(() => {
        navigate('/leads');
      }, 2000);
      
    } catch (err) {
      console.error('Failed to create lead:', err);
      // More specific error message if available
      const errorMessage = err.response?.data?.error || 'An unknown error occurred.';
      showNotification(`Failed to create lead: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const notificationClass = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto bg-slate-900 text-slate-300">
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md text-white shadow-lg ${notificationClass}`}>
          {notification.message}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Lead</h1>
        <button className="text-slate-400 hover:text-white flex items-center space-x-2" onClick={() => navigate('/leads')}>
          <ArrowLeft size={24} /> <span>Back to Leads</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-4 md:p-8 rounded-lg">
        {/* Lead Type */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Lead Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Buyer' ? 'bg-slate-700 border-slate-600' : ''}`}>
              <input
                type="radio"
                name="leadType"
                value="Buyer"
                checked={formData.leadType === 'Buyer'}
                onChange={handleChange}
                className="accent-slate-400"
                required
              />
              <div>
                <div className="font-semibold">Buyer</div>
                <div className="text-slate-400 text-sm">Looking to purchase property</div>
              </div>
            </label>
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Seller' ? 'bg-slate-700 border-slate-600' : ''}`}>
              <input
                type="radio"
                name="leadType"
                value="Seller"
                checked={formData.leadType === 'Seller'}
                onChange={handleChange}
                className="accent-slate-400"
                required
              />
              <div>
                <div className="font-semibold">Seller</div>
                <div className="text-slate-400 text-sm">Looking to sell property</div>
              </div>
            </label>
            <label className={`p-4 rounded-md border border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center space-x-2 transition-colors ${formData.leadType === 'Investor' ? 'bg-slate-700 border-slate-600' : ''}`}>
              <input
                type="radio"
                name="leadType"
                value="Investor"
                checked={formData.leadType === 'Investor'}
                onChange={handleChange}
                className="accent-slate-400"
                required
              />
              <div>
                <div className="font-semibold">Investor</div>
                <div className="text-slate-400 text-sm">Investment opportunities</div>
              </div>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" required />
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number *" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" required />
          </div>
        </div>

        {/* Property Preferences */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Property Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="">Select property type</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
            <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="">Select budget range</option>
              <option value="$100k - $250k">$100k - $250k</option>
              <option value="$250k - $500k">$250k - $500k</option>
              <option value="$500k - $1M">$500k - $1M</option>
              <option value="$1M+">$1M+</option>
            </select>
            <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="City, neighborhood, or zip" className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" />
            <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="">Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="">Bathrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <select name="timeline" value={formData.timeline} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="">Timeline</option>
              <option value="Immediate">Immediate</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        {/* Lead Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Lead Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select name="leadSource" value={formData.leadSource} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="Referral">Referral</option>
              <option value="SocialMedia">Social Media</option>
              <option value="Website">Website</option>
              <option value="Zillow">Zillow</option>
              <option value="Other">Other</option>
            </select>
            <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" >
              <option value="New">New</option>
              <option value="Nurturing">Nurturing</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500" rows="4"></textarea>
        </div>
        
        {/* Social Media Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Social Media</h2>
            <button
              type="button"
              onClick={handleAddSocialMedia}
              className="text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <PlusCircle size={20} />
              <span>Add More</span>
            </button>
          </div>
          {formData.socialMedia.map((social, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="flex-grow grid grid-cols-2 gap-4">
                <select
                  name="platform"
                  value={social.platform}
                  onChange={(e) => handleSocialMediaChange(index, e)}
                  className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">Select Platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Threads">Threads</option>
                </select>
                <input
                  type="text"
                  name="handle"
                  value={social.handle}
                  onChange={(e) => handleSocialMediaChange(index, e)}
                  placeholder="Handle (e.g., @johndoe)"
                  className="bg-slate-700 p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              {formData.socialMedia.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSocialMedia(index)}
                  className="p-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors">Save as Draft</button>
          <button type="submit" disabled={isLoading} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Creating...' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadPage;