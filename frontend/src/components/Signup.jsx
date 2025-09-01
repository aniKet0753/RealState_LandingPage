import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaShieldAlt, FaPlusCircle, FaHeadset } from 'react-icons/fa';

const SignupPage = () => {
  const navigate = useNavigate();
  // State to hold form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    terms: false,
    communications: false,
  });
  // State for loading and password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/agents/signup', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        company_name: formData.company_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        password: formData.password,
      });

      console.log('Signup successful:', response.data);
      toast.success('Signup successful! Redirecting to login...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate after a short delay to allow the toast to be seen
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error(`Signup failed: ${err.response?.data?.error || 'An unknown error occurred.'}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#121212] text-white font-sans">
      <ToastContainer />
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <h1 className="text-4xl font-bold mb-10">
          <span className="text-white">AGENTS</span><span className="text-[#96a099]">UIT</span>
        </h1>
        
        <div className="bg-[#1e1e1e] p-8 md:p-12 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-semibold text-center mb-2">Create Your Account</h2>
          <p className="text-gray-400 text-center text-sm mb-6">Join Agentsuit and transform your lead management</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your first name" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your last name" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your email address" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your phone number" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your company name" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your address" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your city" required/>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600" placeholder="Enter your state" required/>
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10"
                  placeholder="Create a strong password"
                required/>
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with numbers and symbols</p>
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10"
                  placeholder="Create a strong password"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center mt-4 col-span-full">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className="mr-2 accent-yellow-600" />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                I agree to Agentsuit's <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>
              </label>
            </div>
            <div className="flex items-center col-span-full">
              <input type="checkbox" id="communications" name="communications" checked={formData.communications} onChange={handleChange} className="mr-2 accent-yellow-600" />
              <label htmlFor="communications" className="text-gray-400 text-sm">
                Send me product updates and marketing communications
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors mt-4 col-span-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-700" />
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            Don't have an account? <a href="#" className="text-white hover:underline" onClick={() => navigate('/login')}>Sign in</a>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-10">
          <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
            <FaShieldAlt className="w-10 h-10 mb-2 text-gray-400" />
            <span className="text-sm font-semibold text-white">Secure</span>
            <span className="text-xs text-gray-400 text-center">Bank-level security</span>
          </div>
          <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
            <FaPlusCircle className="w-10 h-10 mb-2 text-gray-400" />
            <span className="text-sm font-semibold text-white">24/7 Access</span>
            <span className="text-xs text-gray-400 text-center">Always available</span>
          </div>
          <div className="flex flex-col items-center bg-[#1e1e1e] border border-gray-700 p-4 rounded-lg w-32">
            <FaHeadset className="w-10 h-10 mb-2 text-gray-400" />
            <span className="text-sm font-semibold text-white">Support</span>
            <span className="text-xs text-gray-400 text-center">Expert assistance</span>
          </div>
        </div>

      </div>
      
      <div className="w-full text-center text-gray-500 text-xs py-4">
        © 2025 Kuber Ventures LLC. All rights reserved.
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Terms of Service</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Help Center</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Contact Support</a>
      </div>
    </div>
  );
};

export default SignupPage;
