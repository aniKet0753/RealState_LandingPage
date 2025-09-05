import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import axios from '../api';

const AddBulkLeadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/leads/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });
      console.log('Bulk upload successful:', response.data);
      setMessage(response.data.message || 'File uploaded successfully!');
      setIsSuccess(true);
    } catch (error) {
      console.error('Bulk upload failed:', error.response?.data?.error || error.message);
      
      let errorMessage = 'An unexpected error occurred.';
      const backendError = error.response?.data?.error;

      // Check for specific backend errors and format the message
      if (backendError) {
        if (backendError.includes('duplicate') && backendError.includes('email')) {
          errorMessage = 'Duplicate email found. Please ensure all emails are unique.';
        } else if (backendError.includes('phone_number')) {
            if(backendError.includes('duplicate'))
            errorMessage = 'Duplicate phone number found. Please ensure all phone numbers are unique.';
            else
            errorMessage = 'Invalid one/more phone number. Please ensure all phone number are valid';
        } else if (backendError.includes('invalid input syntax for type integer')) {
          errorMessage = 'Invalid data type for an integer field. Please check your "bedrooms" or "bathrooms" columns.';
        } else if (backendError.includes('unique constraint')) {
          errorMessage = 'A unique constraint was violated. Please check for duplicate email or phone number values.';
        } else {
          // Fallback to the generic backend error message
          errorMessage = backendError;
        }
      }
      
      setMessage(`Upload failed: ${errorMessage}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto bg-slate-900 text-slate-300">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add Bulk Leads</h1>
        <button className="text-slate-400 hover:text-white flex items-center space-x-2" onClick={() => navigate('/leads')}>
          <ArrowLeft size={24} /> <span>Back to Leads</span>
        </button>
      </div>
      
      <div className="bg-slate-800 p-4 md:p-8 rounded-lg flex flex-col items-center justify-center text-center">
        <div className="mb-6 max-w-lg">
          <p className="text-lg text-white font-semibold mb-2">Upload a Spreadsheet</p>
          <p className="text-sm text-slate-400">
            To add multiple leads at once, please upload a CSV or XLSX file. Ensure the file follows the required format.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-xl">
          <div className="relative w-full">
            <input
              type="file"
              id="spreadsheet-upload"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-slate-700 p-4 rounded-md text-white border border-slate-600 flex items-center justify-center space-x-2 cursor-pointer transition-colors hover:bg-slate-600">
              <Upload size={20} />
              <span>{selectedFile ? selectedFile.name : 'Choose a file'}</span>
            </div>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {loading ? 'Uploading...' : 'Upload Spreadsheet'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 text-sm ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-sm text-slate-400">
          <p>
            Don't have a template? 
            <a href="#" className="text-yellow-400 hover:underline ml-1 flex items-center space-x-1" onClick={(e) => e.preventDefault()}>
              <Download size={14} /> 
              <span>Download Template</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddBulkLeadPage;
