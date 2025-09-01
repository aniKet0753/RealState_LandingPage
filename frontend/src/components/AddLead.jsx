import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaUsers, FaPlusCircle, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';

const AddLeadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const [formData, setFormData] = useState({
    user_id: localStorage.getItem('user_id') || sessionStorage.getItem('user_id') || null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    leadType: 'Buyer',
    propertyType: '',
    budgetRange: '',
    preferredLocation: '',
    bedrooms: '',
    bathrooms: '',
    timeline: '',
    leadSource: 'Referral',
    leadStatus: 'New',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert bedrooms and bathrooms to integers
    if (name === 'bedrooms' || name === 'bathrooms') {
      processedValue = value ? parseInt(value, 10) : null;
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/leads', {
        user_id: formData.user_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        type: formData.leadType,
        property_type: formData.propertyType,
        budget_range: formData.budgetRange,
        preferred_location: formData.preferredLocation,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        timeline: formData.timeline,
        source: formData.leadSource,
        status: formData.leadStatus,
        notes: formData.notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Lead created successfully:', response.data);
      toast.success('Lead created successfully!', { position: "top-right" });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Failed to create lead:', err);
      toast.error(`Failed to create lead: ${err.response?.data?.error || err.response?.data?.message || 'An unknown error occurred.'}`, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1a1a1a] text-white font-sans">
      <ToastContainer />
      
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 bg-[#1e1e1e] p-4 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="text-yellow-500 font-bold text-lg">AGENTSUIT</div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <FaHome className="mr-2" /> Dashboard
            </li>
            <li className="flex items-center p-2 rounded-md bg-gray-700">
              <FaUsers className="mr-2" /> Leads
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="p-4 bg-gray-800 rounded-md">
            <div className="font-semibold mb-2">AI Assistant</div>
            <p className="text-gray-400">Leverage AI to qualify leads and automate follow-ups</p>
            <button className="w-full bg-yellow-600 text-white py-2 rounded-md mt-2">Configure AI</button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden text-white mr-4"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-3xl font-bold">Add New Lead</h1>
          </div>
          <button className="hidden md:flex text-gray-400 hover:text-white items-center space-x-2" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft className="text-2xl" /> <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
        )}
        <div className={`fixed inset-y-0 left-0 w-64 bg-[#1e1e1e] p-4 flex-col justify-between z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="text-yellow-500 font-bold text-lg">AGENTSUIT</div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-white ml-auto"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <FaHome className="mr-2" /> Dashboard
              </li>
              <li className="flex items-center p-2 rounded-md bg-gray-700">
                <FaUsers className="mr-2" /> Leads
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="p-4 bg-gray-800 rounded-md">
              <div className="font-semibold mb-2">AI Assistant</div>
              <p className="text-gray-400">Leverage AI to qualify leads and automate follow-ups</p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded-md mt-2">Configure AI</button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e1e1e] p-4 md:p-8 rounded-lg">
          {/* Lead Type */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Lead Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`p-4 rounded-md border border-gray-700 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 ${formData.leadType === 'Buyer' ? 'bg-gray-800 border-yellow-600' : ''}`}>
                <input
                  type="radio"
                  name="leadType"
                  value="Buyer"
                  checked={formData.leadType === 'Buyer'}
                  onChange={handleChange}
                  className="accent-yellow-600"
                  required
                />
                <div>
                  <div className="font-semibold">Buyer</div>
                  <div className="text-gray-400 text-sm">Looking to purchase property</div>
                </div>
              </label>
              <label className={`p-4 rounded-md border border-gray-700 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 ${formData.leadType === 'Seller' ? 'bg-gray-800 border-yellow-600' : ''}`}>
                <input
                  type="radio"
                  name="leadType"
                  value="Seller"
                  checked={formData.leadType === 'Seller'}
                  onChange={handleChange}
                  className="accent-yellow-600"
                  required
                />
                <div>
                  <div className="font-semibold">Seller</div>
                  <div className="text-gray-400 text-sm">Looking to sell property</div>
                </div>
              </label>
              <label className={`p-4 rounded-md border border-gray-700 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 ${formData.leadType === 'Investor' ? 'bg-gray-800 border-yellow-600' : ''}`}>
                <input
                  type="radio"
                  name="leadType"
                  value="Investor"
                  checked={formData.leadType === 'Investor'}
                  onChange={handleChange}
                  className="accent-yellow-600"
                  required
                />
                <div>
                  <div className="font-semibold">Investor</div>
                  <div className="text-gray-400 text-sm">Investment opportunities</div>
                </div>
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number *" className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
            </div>
          </div>

          {/* Property Preferences */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Property Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="">Select property type</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Land">Land</option>
                <option value="Other">Other</option>
              </select>
              <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="">Select budget range</option>
                <option value="$100k - $250k">$100k - $250k</option>
                <option value="$250k - $500k">$250k - $500k</option>
                <option value="$500k - $1M">$500k - $1M</option>
                <option value="$1M+">$1M+</option>
              </select>
              <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="City, neighborhood, or zip" className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required/>
              <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="">Bedrooms</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
              <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="">Bathrooms</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <select name="timeline" value={formData.timeline} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
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
            <h2 className="text-xl font-semibold mb-4">Lead Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select name="leadSource" value={formData.leadSource} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="Referral">Referral</option>
                <option value="SocialMedia">Social Media</option>
                <option value="Website">Website</option>
                <option value="Zillow">Zillow</option>
                <option value="Other">Other</option>
              </select>
              <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className="bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" required>
                <option value="New">New</option>
                <option value="Nurturing">Nurturing</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Contacted">Contacted</option>
              </select>
            </div>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full bg-[#2c2c2c] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600" rows="4"></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors">Save as Draft</button>
            <button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadPage;