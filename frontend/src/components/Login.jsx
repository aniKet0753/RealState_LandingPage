import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaShieldAlt, FaPlusCircle, FaHeadset } from 'react-icons/fa';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  // State to hold form data
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/agents/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      });

      // Save token to localStorage if "Remember me" is checked
      if (formData.rememberMe) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.agent.id);
      } else {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user_id', response.data.agent.id);
      }

      // Call the onLogin prop to update the parent's authentication state
      onLogin(true);

      console.log('Login successful:', response.data);
      toast.success('Login successful!', {
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
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(`Login failed:, ${err.response?.data?.error}`);
      toast.error(`Login failed: ${err.response?.data?.error || 'An unknown error occurred.'}`, {
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
        
        <div className="bg-[#1e1e1e] p-8 md:p-12 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-center mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center text-sm mb-6">Sign in to your Agentsuit account</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                placeholder="Email or Phone Number"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10"
                placeholder="Password"
                required
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
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 accent-yellow-600"
                />
                <label htmlFor="remember" className="text-gray-400">Remember me</label>
              </div>
              <a href="#" className="text-gray-400 hover:text-white">Forgot password?</a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-700" />
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            Don't have an account? <a href="#" className="text-white hover:underline" onClick={() => navigate('/signup')}>Sign up</a>
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

export default LoginPage;