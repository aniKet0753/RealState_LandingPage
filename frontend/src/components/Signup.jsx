import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaShieldAlt, FaPlusCircle, FaHeadset, FaSearch, FaChevronDown, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

// Hardcoded list of cities and states
const US_CITIES_STATES = [
  { city: 'New York', state: 'New York' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Houston', state: 'Texas' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Philadelphia', state: 'Pennsylvania' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'San Diego', state: 'California' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'San Jose', state: 'California' },
  { city: 'Austin', state: 'Texas' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Fort Worth', state: 'Texas' },
  { city: 'Columbus', state: 'Ohio' },
  { city: 'Charlotte', state: 'North Carolina' },
  { city: 'Indianapolis', state: 'Indiana' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Seattle', state: 'Washington' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Washington', state: 'District of Columbia' },
  { city: 'Boston', state: 'Massachusetts' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Las Vegas', state: 'Nevada' },
  { city: 'Portland', state: 'Oregon' },
  { city: 'Detroit', state: 'Michigan' },
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Louisville', state: 'Kentucky' },
  { city: 'Baltimore', state: 'Maryland' },
  { city: 'Milwaukee', state: 'Wisconsin' },
  { city: 'Oklahoma City', state: 'Oklahoma' },
  { city: 'Tucson', state: 'Arizona' },
  { city: 'Fresno', state: 'California' },
  { city: 'Sacramento', state: 'California' },
  { city: 'Kansas City', state: 'Missouri' },
  { city: 'Long Beach', state: 'California' },
  { city: 'Mesa', state: 'Arizona' },
  { city: 'Virginia Beach', state: 'Virginia' },
  { city: 'Omaha', state: 'Nebraska' },
  { city: 'Raleigh', state: 'North Carolina' },
  { city: 'Colorado Springs', state: 'Colorado' },
  { city: 'Oakland', state: 'California' },
  { city: 'Minneapolis', state: 'Minnesota' },
  { city: 'Tulsa', state: 'Oklahoma' },
  { city: 'Arlington', state: 'Texas' },
  { city: 'Wichita', state: 'Kansas' },
  { city: 'New Orleans', state: 'Louisiana' },
  { city: 'Cleveland', state: 'Ohio' },
  { city: 'Honolulu', state: 'Hawaii' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Bakersfield', state: 'California' },
  { city: 'Aurora', state: 'Colorado' },
  { city: 'Anaheim', state: 'California' },
  { city: 'Santa Ana', state: 'California' },
  { city: 'Corpus Christi', state: 'Texas' },
  { city: 'Riverside', state: 'California' },
  { city: 'Lexington', state: 'Kentucky' },
  { city: 'Stockton', state: 'California' },
  { city: 'Henderson', state: 'Nevada' },
  { city: 'Saint Paul', state: 'Minnesota' },
  { city: 'St. Louis', state: 'Missouri' },
  { city: 'Cincinnati', state: 'Ohio' },
  { city: 'Pittsburgh', state: 'Pennsylvania' },
  { city: 'Greensboro', state: 'North Carolina' },
  { city: 'Anchorage', state: 'Alaska' },
  { city: 'Plano', state: 'Texas' },
  { city: 'Lincoln', state: 'Nebraska' },
  { city: 'Orlando', state: 'Florida' },
  { city: 'Irvine', state: 'California' },
  { city: 'Newark', state: 'New Jersey' },
  { city: 'Toledo', state: 'Ohio' },
  { city: 'Durham', state: 'North Carolina' },
  { city: 'Chula Vista', state: 'California' },
  { city: 'Fort Wayne', state: 'Indiana' },
  { city: 'Jersey City', state: 'New Jersey' },
  { city: 'Chandler', state: 'Arizona' },
  { city: 'Madison', state: 'Wisconsin' },
  { city: 'Lubbock', state: 'Texas' },
  { city: 'Scottsdale', state: 'Arizona' },
  { city: 'Reno', state: 'Nevada' },
  { city: 'Buffalo', state: 'New York' },
  { city: 'Gilbert', state: 'Arizona' },
  { city: 'Glendale', state: 'California' },
  { city: 'North Las Vegas', state: 'Nevada' },
  { city: 'Winston-Salem', state: 'North Carolina' },
  { city: 'Chesapeake', state: 'Virginia' },
  { city: 'Norfolk', state: 'Virginia' },
  { city: 'Fremont', state: 'California' },
  { city: 'Garland', state: 'Texas' },
  { city: 'Irving', state: 'Texas' },
  { city: 'Hialeah', state: 'Florida' },
  { city: 'Richmond', state: 'Virginia' },
  { city: 'Boise', state: 'Idaho' },
  { city: 'Spokane', state: 'Washington' },
  { city: 'Des Moines', state: 'Iowa' },
  { city: 'Modesto', state: 'California' },
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Tacoma', state: 'Washington' },
  { city: 'Fontana', state: 'California' },
  { city: 'Oxnard', state: 'California' },
  { city: 'Moreno Valley', state: 'California' },
  { city: 'Glendale', state: 'Arizona' },
  { city: 'Yonkers', state: 'New York' },
  { city: 'Huntington Beach', state: 'California' },
  { city: 'Montgomery', state: 'Alabama' },
  { city: 'Amarillo', state: 'Texas' },
  { city: 'Akron', state: 'Ohio' },
  { city: 'Little Rock', state: 'Arkansas' },
  { city: 'Augusta', state: 'Georgia' },
  { city: 'Grand Rapids', state: 'Michigan' },
  { city: 'Shreveport', state: 'Louisiana' },
  { city: 'Columbia', state: 'South Carolina' },
  { city: 'Overland Park', state: 'Kansas' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Tempe', state: 'Arizona' },
  { city: 'Waterbury', state: 'Connecticut' },
  { city: 'Manchester', state: 'New Hampshire' },
  { city: 'Huntsville', state: 'Alabama' },
  { city: 'Salt Lake City', state: 'Utah' },
  { city: 'Newport News', state: 'Virginia' },
  { city: 'Cape Coral', state: 'Florida' },
  { city: 'Peoria', state: 'Arizona' },
  { city: 'Sioux Falls', state: 'South Dakota' },
  { city: 'Springfield', state: 'Missouri' },
  { city: 'Eugene', state: 'Oregon' },
  { city: 'Harrisburg', state: 'Pennsylvania' },
  { city: 'Charleston', state: 'South Carolina' },
  { city: 'Gainesville', state: 'Florida' },
  { city: 'Chattanooga', state: 'Tennessee' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Cheyenne', state: 'Wyoming' },
  { city: 'Billings', state: 'Montana' },
  { city: 'Rapid City', state: 'South Dakota' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Pierre', state: 'South Dakota' },
  { city: 'Frankfort', state: 'Kentucky' },
  { city: 'Montpelier', state: 'Vermont' },
  { city: 'Concord', state: 'New Hampshire' },
  { city: 'Jefferson City', state: 'Missouri' },
  { city: 'Lansing', state: 'Michigan' },
  { city: 'Trenton', state: 'New Jersey' },
  { city: 'Providence', state: 'Rhode Island' },
  { city: 'Montpelier', state: 'Vermont' },
  { city: 'Charleston', state: 'West Virginia' },
  { city: 'Madison', state: 'Wisconsin' },
 
]

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
  const [emailCode, setEmailCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
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
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
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

  const handleCitySearchChange = (e) => {
    const { value } = e.target;
    setCitySearchInput(value);
    
    if (value.length > 1) {
      const filtered = US_CITIES_STATES.filter(location =>
        location.city.toLowerCase().includes(value.toLowerCase()) || 
        location.state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowLocationSuggestions(false);
    }
    setValidationErrors((prev) => ({ ...prev, city: '', state: '' }));
  };

  const handleCitySelect = (city, state) => {
    setFormData(prev => ({ ...prev, city, state }));
    setCitySearchInput(city);
    setShowLocationSuggestions(false);
  };

  // Email verification code timer
  useEffect(() => {
    if (emailTimer > 0) {
      const timerId = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [emailTimer]);

  // Phone verification code timer
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
        toast.success('Email verification code sent.');
        setEmailTimer(30);
      } else if (type === 'phone') {
        await axios.post('/api/otp/send-otp', { identifier: formData.phone_number, type: 'phone_number' });
        toast.success('Phone verification code sent.');
        setPhoneTimer(30);
      }
    } catch (err) {
      console.error(`Failed to send ${type} verification code:`, err);
      // Set inline error instead of a toast
      setOtpErrors(prev => ({ ...prev, [type]: `${err.response.data.error}` }));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (type, codeArray = null) => {
    setIsVerifyingOtp(true);
    setOtpErrors({ email: '', phone: '' });

    try {
        const code = codeArray || (type === 'email' ? emailCode : null);

        if (code.some(digit => digit === '')) {
            setOtpErrors(prev => ({ ...prev, [type]: 'Please enter all 6 digits.' }));
            return;
        }

        const verificationCode = code.join('');
        console.log('Verifying code:', verificationCode);

        const payload = { 
            identifier: type === 'email' ? formData.email : formData.phone_number, 
            otp: verificationCode 
        };
        await axios.post('/api/otp/verify-otp', payload);

        if (type === 'email') {
            setIsEmailOtpVerified(true);
            toast.success('Email verification code verified!');
        } else {
            setIsPhoneOtpVerified(true);
            toast.success('Phone verification code verified!');
        }

    } catch (err) {
        console.error(`Verification failed for ${type}:`, err);
        setOtpErrors(prev => ({ ...prev, [type]: `Invalid verification code. Please try again.` }));
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
    setShowOtpPopup(true);
  };

  const handleCloseOtpModal = () => {
    setShowOtpPopup(false);
    setEmailCode(['', '', '', '', '', '']);
    setIsEmailOtpVerified(false);
    setOtpErrors({ email: '', phone: '' });
    setFinalSubmitError('');
    setEmailTimer(0);
    setPhoneTimer(0);
  };
  
  const handleFinalSubmit = async (e) => {
  e.preventDefault();
  setFinalSubmitError('');

  if (!isEmailOtpVerified) {
    setFinalSubmitError("Please verify email verification code first.");
    return;
  }

  setIsLoading(true);

  try {
    const { confirmPassword, terms, communications, ...payload } = formData;

    const response = await axios.post('/api/agents/signup', payload);

    toast.success('Successfully registered your account!', { autoClose: 3000 });

    setTimeout(() => navigate('/login'), 4000);

  } catch (err) {
    console.error('Registration failed:', err);
    setFinalSubmitError(`Registration failed: ${err.response?.data?.error || 'An unknown error occurred.'}`);
  } finally {
    setIsLoading(false);
  }
};

  const handleCodeChange = (e, index) => {
    const { value } = e.target;
    const newCode = [...emailCode];
    newCode[index] = value.slice(-1);
    setEmailCode(newCode);

    if (value && index < 5) {
        inputRefs.current[index + 1].focus();
    }

    // Verify whenever all 6 digits are complete, regardless of which box was last edited
    if (newCode.every(digit => digit)) {
        handleVerifyOtp('email', newCode);
    }
  };


  const handleCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !emailCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-[#121212] text-white font-sans ${showOtpPopup ? 'filter backdrop-blur-sm' : ''}`}>
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

            <div className="relative">
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={citySearchInput}
                  onChange={handleCitySearchChange}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.city ? 'border-2 border-red-500' : ''}`}
                  placeholder=""
                  autoComplete="off"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaChevronDown className="w-4 h-4" />
                </span>
              </div>
              {showLocationSuggestions && filteredLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#2c2c2c] rounded-md shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredLocations.map((item, index) => (
                    <div 
                      key={index} 
                      onMouseDown={() => handleCitySelect(item.city, item.state)} 
                      className="p-2 cursor-pointer hover:bg-[#3c3c3c]"
                    >
                      {item.city}, {item.state}
                    </div>
                  ))}
                </div>
              )}
              {validationErrors.city && <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                className={`w-full bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${validationErrors.state ? 'border-2 border-red-500' : ''}`}
                placeholder=""
                readOnly
                disabled
              />
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
              A verification code has been sent to your email.
            </p>

            <div className="space-y-4 mb-6">
              <label className="block text-sm text-gray-400">Email Verification Code</label>
              <div className="flex justify-between space-x-2">
                {Array(6).fill(null).map((_, index) => (
                  <input
                    key={index}
                    type="tel"
                    maxLength="1"
                    value={emailCode[index]}
                    onChange={(e) => handleCodeChange(e, index)}
                    onKeyDown={(e) => handleCodeKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`w-1/6 text-center bg-[#2c2c2c] text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-600 ${isEmailOtpVerified ? 'bg-green-600' : ''}`}
                    disabled={isEmailOtpVerified || isVerifyingOtp}
                  />
                ))}
              </div>
              {otpErrors.email && <p className="text-red-500 text-sm mt-1">{otpErrors.email}</p>}
              <div className="flex justify-between text-xs text-gray-400">
                <span>Resend verification code in {emailTimer}s</span>
                <button
                  onClick={() => handleSendOtp('email')}
                  disabled={emailTimer > 0 || isSendingOtp}
                  className={`text-yellow-600 hover:underline ${emailTimer > 0 || isSendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Resend
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
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