import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaShieldAlt, FaPlusCircle, FaHeadset, FaSearch, FaChevronDown, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

// Hardcoded state and city data for the searchable dropdown
const STATES_AND_CITIES = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Illinois': ['Chicago', 'Springfield', 'Peoria', 'Rockford'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
  'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah'],
};

// Create a reverse mapping for city-to-state lookup
const CITIES_TO_STATES = {};
Object.keys(STATES_AND_CITIES).forEach(state => {
  STATES_AND_CITIES[state].forEach(city => {
    CITIES_TO_STATES[city] = state;
  });
});

const SignupPage = () => {
  const navigate = useNavigate();
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

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [validationErrors, setValidationErrors] = useState({});

  // OTP state
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState({ email: '', phone: '' });
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [otpErrors, setOtpErrors] = useState({ email: '', phone: '' });
  const [finalSubmitError, setFinalSubmitError] = useState('');

  // States for searchable text fields with suggestions
  const [citySearchInput, setCitySearchInput] = useState('');
  const [stateSearchInput, setStateSearchInput] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);

  // Check password strength and validation rules
  const checkPasswordValidation = (password) => {
    const rules = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
    };
    setPasswordValidation(rules);

    let strength = 0;
    if (rules.length) strength++;
    if (rules.lowercase && rules.uppercase) strength++;
    if (rules.number) strength++;
    if (rules.specialChar) strength++;

    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  };

  // Handle input changes, now with phone number length enforcement
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Limit phone number to 10 characters
    if (name === 'phone_number') {
      if (newValue.length > 10) {
        return; // Do not update state if the value is more than 10 characters
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordValidation(newValue));
    }

    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // New logic for typable city field with suggestions
  const handleCitySearchChange = (e) => {
    const { value } = e.target;
    setCitySearchInput(value);
    setFormData(prev => ({ ...prev, city: value, state: '' })); // Clear state when city input changes
    if (value.length > 0) {
      const filtered = Object.keys(CITIES_TO_STATES).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
    setValidationErrors((prev) => ({ ...prev, city: '', state: '' }));
  };

  const handleCitySelect = (city) => {
    const state = CITIES_TO_STATES[city];
    setFormData(prev => ({ ...prev, city, state }));
    setCitySearchInput(city);
    setStateSearchInput(state);
    setShowCitySuggestions(false);
  };

  // New logic for typable state field with suggestions (can be used for manual override)
  const handleStateSearchChange = (e) => {
    const { value } = e.target;
    setStateSearchInput(value);
    if (value.length > 0) {
      const filtered = Object.keys(STATES_AND_CITIES).filter(state =>
        state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStates(filtered); // Assuming a new state for filtered states is defined
      setShowStateSuggestions(true);
    } else {
      setFilteredStates([]);
      setShowStateSuggestions(false);
    }
    setValidationErrors((prev) => ({ ...prev, state: '' }));
  };

  const handleStateSelect = (state) => {
    setStateSearchInput(state);
    setFormData(prev => ({ ...prev, state }));
    setShowStateSuggestions(false);
  };

  // Email OTP timer
  useEffect(() => {
    if (emailTimer > 0) {
      const timerId = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [emailTimer]);

  // Phone OTP timer
  useEffect(() => {
    if (phoneTimer > 0) {
      const timerId = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [phoneTimer]);

  const handleSendOtp = async (type) => {
    setIsSendingOtp(true);
    setOtpErrors({ email: '', phone: '' });
    try {
      if (type === 'email') {
        await axios.post('/api/otp/send-otp', { identifier: formData.email , type: 'email'});
        toast.success('Email OTP sent.');
        setEmailTimer(30);
      } else if (type === 'phone') {
        await axios.post('/api/otp/send-otp', { identifier: formData.phone_number, type: 'phone_number' });
        toast.success('Phone OTP sent.');
        setPhoneTimer(30);
      }
    } catch (err) {
      console.error(`Failed to send ${type} OTP:`, err);
      // Set inline error instead of a toast
      setOtpErrors(prev => ({ ...prev, [type]: `${err.response.data.error}` }));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (type) => {
    setIsVerifyingOtp(true);
    setOtpErrors({ email: '', phone: '' });
    try {
      const payload = type === 'email' ? { identifier: formData.email, otp: otp.email } : { identifier: formData.phone_number, otp: otp.phone };
      await axios.post('/api/otp/verify-otp', payload);

      if (type === 'email') {
        setIsEmailOtpVerified(true);
        toast.success('Email OTP verified!');
      } else {
        setIsPhoneOtpVerified(true);
        toast.success('Phone OTP verified!');
      }
    } catch (err) {
      console.error(`OTP verification failed for ${type}:`, err);
      // Set inline error for the specific OTP field
      setOtpErrors(prev => ({ ...prev, [type]: `Invalid ${type} OTP. Please try again.` }));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOpenOtpModal = (e) => {
    e.preventDefault();

    let errors = {};
    const requiredFields = ['first_name', 'last_name', 'email', 'phone_number', 'company_name', 'address', 'city', 'state', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required.';
      }
    });

    if (formData.phone_number && formData.phone_number.length !== 10) {
      errors.phone_number = 'Phone number must be exactly 10 digits.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.password = 'Passwords do not match.';
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      errors.password = 'Please meet all password requirements.';
    }

    if (!formData.terms) {
      errors.terms = 'You must agree to the Terms of Service.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    handleSendOtp('email');
    // handleSendOtp('phone');
    // toast.success('OTPs are being sent to your email and phone.');
    toast.success('OTP is being sent to your email.');
    setShowOtpPopup(true);
  };

  const handleCloseOtpModal = () => {
    setShowOtpPopup(false);
    // Optionally reset OTP states if the user closes the modal
    setOtp({ email: '', phone: '' });
    setIsEmailOtpVerified(false);
    setIsPhoneOtpVerified(false);
    setOtpErrors({ email: '', phone: '' });
    setFinalSubmitError('');
    setEmailTimer(0);
    setPhoneTimer(0);
  };
  
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setFinalSubmitError(''); // Clear any previous error message

    // if (!isEmailOtpVerified || !isPhoneOtpVerified) {
    // setFinalSubmitError("Please verify both email and phone OTPs first.");
    //   return;
    // }
    if (!isEmailOtpVerified ) {
      setFinalSubmitError("Please verify email OTP first.");
      return;
    }
    
    // Main form submission logic
    setIsLoading(true);
    try {
        // Here, payload will contain everything from formData except the excluded fields[confirmPassword, terms,communications ].
        const { confirmPassword, terms, communications, ...payload } = formData;

        const response = await axios.post('/api/agents/signup', payload);

        console.log('Signup successful:', response.data);
        toast.success('Signup successful! Redirecting to login...', { autoClose: 2000 });
        setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
        console.error('Signup failed:', err);
        setFinalSubmitError(`Signup failed: ${err.response?.data?.error || 'An unknown error occurred.'}`);
    } finally {
        setIsLoading(false);
        // setShowOtpPopup(false); // Do not close modal on error, let the user try again
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-[#121212] text-white font-sans ${showOtpPopup ? 'filter backdrop-blur-sm' : ''}`}>
      {/* This is the change. We add a style prop to set the zIndex to a high value.
        This ensures the toasts appear on top of all other elements, including pop-ups.
      */}
      <ToastContainer style={{ zIndex: 9999 }} />
      <div className="flex flex-col items-center p-4 w-full h-full justify-center">
        <h1 className="text-4xl font-bold mb-10">
          <span className="text-white">AGENTS</span><span className="text-[#96a099]">UIT</span>
        </h1>
        
        <div className="bg-[#1e1e1e] p-8 md:p-12 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-semibold text-center mb-2">Create Your Account</h2>
          <p className="text-gray-400 text-center text-sm mb-6">Join Agentsuit and transform your lead management</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.first_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your first name" required/>
              {validationErrors.first_name && <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.last_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your last name" required/>
              {validationErrors.last_name && <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.email ? 'border-2 border-red-500' : ''}`} placeholder="Enter your email address" required/>
              {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.phone_number ? 'border-2 border-red-500' : ''}`} placeholder="Enter your phone number" maxLength="10" required/>
              {validationErrors.phone_number && <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.company_name ? 'border-2 border-red-500' : ''}`} placeholder="Enter your company name" required/>
              {validationErrors.company_name && <p className="text-red-500 text-sm mt-1">{validationErrors.company_name}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.address ? 'border-2 border-red-500' : ''}`} placeholder="Enter your address" required/>
              {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
            </div>

            {/* Change: City field comes first with typable suggestions */}
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={citySearchInput}
                onChange={handleCitySearchChange}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)} // Delay to allow click
                className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.city ? 'border-2 border-red-500' : ''}`}
                placeholder="Start typing your city..."
                autoComplete="off"
              />
              {showCitySuggestions && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#2c2c2c] rounded-md shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredCities.map((city) => (
                    <div key={city} onMouseDown={() => handleCitySelect(city)} className="p-2 cursor-pointer hover:bg-[#3c3c3c]">
                      {city}
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.city && <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>}
            </div>

            {/* Change: State field is now read-only and populated based on city selection */}
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={stateSearchInput}
                onChange={handleStateSearchChange}
                onFocus={() => setShowStateSuggestions(true)}
                onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
                className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.state ? 'border-2 border-red-500' : ''}`}
                placeholder="State will be auto-filled"
                readOnly={!!formData.city} // Make it read-only if a city is selected
                autoComplete="off"
                disabled
              />
              {showStateSuggestions && filteredStates.length > 0 && !formData.city && ( // Show only if a city is not selected
                <div className="absolute z-10 w-full mt-1 bg-[#2c2c2c] rounded-md shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredStates.map((state) => (
                    <div key={state} onMouseDown={() => handleStateSelect(state)} className="p-2 cursor-pointer hover:bg-[#3c3c3c]">
                      {state}
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.state && <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>}
            </div>
            
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10 ${validationErrors.password ? 'border-2 border-red-500' : ''}`}
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
              {formData.password && (
                <div className="mt-2 flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-600 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300
                        ${passwordStrength === 'Strong' ? 'bg-green-500 w-full' : passwordStrength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}
                      `}></div>
                    </div>
                    <span className={`ml-2 text-xs font-semibold
                      ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}
                    `}>
                      {passwordStrength}
                    </span>
                  </div>
                  <ul className="text-gray-400 text-xs">
                    <li className={`flex items-center ${passwordValidation.length ? 'text-green-500' : ''}`}>
                      {passwordValidation.length ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                      At least 8 characters long
                    </li>
                    <li className={`flex items-center ${passwordValidation.lowercase && passwordValidation.uppercase ? 'text-green-500' : ''}`}>
                      {passwordValidation.lowercase && passwordValidation.uppercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                      Includes uppercase and lowercase letters
                    </li>
                    <li className={`flex items-center ${passwordValidation.number ? 'text-green-500' : ''}`}>
                      {passwordValidation.number ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                      Includes a number
                    </li>
                    <li className={`flex items-center ${passwordValidation.specialChar ? 'text-green-500' : ''}`}>
                      {passwordValidation.specialChar ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                      Includes a special character
                    </li>
                  </ul>
                </div>
              )}
              {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10 ${validationErrors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                  placeholder="Confirm your password"
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
              {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-center mt-4 col-span-full">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className={`mr-2 accent-yellow-600 ${validationErrors.terms ? 'border-2 border-red-500' : ''}`} required />
              <label htmlFor="terms" className="text-gray-400 text-sm">
                I agree to Agentsuit's <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>
              </label>
            </div>
            {validationErrors.terms && <p className="text-red-500 text-sm col-span-full">{validationErrors.terms}</p>}

            <div className="flex items-center col-span-full">
              <input type="checkbox" id="communications" name="communications" checked={formData.communications} onChange={handleChange} className="mr-2 accent-yellow-600" />
              <label htmlFor="communications" className="text-gray-400 text-sm">
                Send me product updates and marketing communications
              </label>
            </div>

            <button
              type="button"
              onClick={handleOpenOtpModal}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors mt-4 col-span-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-700" />
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            Already have an account? <a href="#" className="text-white hover:underline" onClick={() => navigate('/login')}>Sign in</a>
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

      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm position-relative top-20">
          <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-xl w-full max-w-sm text-white relative" style={{position: "absolute", top: "5%"}}>
            <button onClick={handleCloseOtpModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-semibold text-center mb-4">Verify Your Account</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              {/* An OTP has been sent to your email and phone number. */}
              An OTP has been sent to your email.
            </p>

            {/* Email OTP Section */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm text-gray-400">Email OTP</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={otp.email}
                  onChange={(e) => setOtp({ ...otp, email: e.target.value })}
                  className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${isEmailOtpVerified ? 'bg-green-600' : ''}`}
                  placeholder="Enter Email OTP"
                  maxLength="6"
                  disabled={isEmailOtpVerified}
                />
                {isEmailOtpVerified ? (
                  <FaCheckCircle className="absolute right-3 text-green-500" size={20} />
                ) : (
                  <button
                    onClick={() => handleVerifyOtp('email')}
                    disabled={isVerifyingOtp}
                    className="ml-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify
                  </button>
                )}
              </div>
              {otpErrors.email && <p className="text-red-500 text-sm mt-1">{otpErrors.email}</p>}
              <div className="flex justify-between text-xs text-gray-400">
                <span>Resend OTP in {emailTimer}s</span>
                <button
                  onClick={() => handleSendOtp('email')}
                  disabled={emailTimer > 0 || isSendingOtp}
                  className={`text-yellow-600 hover:underline ${emailTimer > 0 || isSendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Resend
                </button>
              </div>
            </div>

            {/* Phone OTP Section */}
            {/* <div className="space-y-4 mb-6">
              <label className="block text-sm text-gray-400">Phone OTP</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={otp.phone}
                  onChange={(e) => setOtp({ ...otp, phone: e.target.value })}
                  className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${isPhoneOtpVerified ? 'bg-green-600' : ''}`}
                  placeholder="Enter Phone OTP"
                  maxLength="6"
                  disabled={isPhoneOtpVerified}
                />
                {isPhoneOtpVerified ? (
                  <FaCheckCircle className="absolute right-3 text-green-500" size={20} />
                ) : (
                  <button
                    onClick={() => handleVerifyOtp('phone')}
                    disabled={isVerifyingOtp}
                    className="ml-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify
                  </button>
                )}
              </div>
              {otpErrors.phone && <p className="text-red-500 text-sm mt-1">{otpErrors.phone}</p>}
              <div className="flex justify-between text-xs text-gray-400">
                <span>Resend OTP in {phoneTimer}s</span>
                <button
                  onClick={() => handleSendOtp('phone')}
                  disabled={phoneTimer > 0 || isSendingOtp}
                  className={`text-yellow-600 hover:underline ${phoneTimer > 0 || isSendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Resend
                </button>
              </div>
            </div> */}

            <button
              type="button"
              onClick={handleFinalSubmit}
              // disabled={!isEmailOtpVerified || !isPhoneOtpVerified || isLoading}
              disabled={!isEmailOtpVerified || isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed and Create Account
            </button>
            {finalSubmitError && <p className="text-red-500 text-sm text-center mt-2">{finalSubmitError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;