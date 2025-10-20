import React, { useState, useRef } from 'react';
import { Upload, FileCheck, Sparkles, ArrowLeft, Zap, Star, X, AlertCircle } from 'lucide-react';
import axios from "../api"
/////////////////////////////////
export default function PremiumPDFUpload({ onUploadComplete }) {
  const [step, setStep] = useState('choice'); // choice, upload, processing, success, error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      setStep('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setStep('error');
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setError(null);
    setStep('processing');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://localhost:5001/api/landing-pages/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      setProgress(100);
      setUploadedFile(file);
    const extracted = data?.data || data || {};

      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          if (typeof onUploadComplete === 'function') {
// ✅ Always send a { data: ... } object for LandingPage
          onUploadComplete({ data: extracted });          }
        }, 2000);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to process PDF. Please try again.');
      setStep('error');
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const resetUpload = () => {
    setStep('upload');
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Step 1: Choice Screen
  if (step === 'choice') {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">


            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mt-">
              Create Your Property Landing Page
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a property listing PDF and let AI automatically extract all details, then create a stunning landing page.
            </p>
          </div>

          {/* Action Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r bg-blue-600 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

            <div
              onClick={() => setStep('upload')}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12 cursor-pointer hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Create Landing Page from PDF</h2>
                  <p className="text-gray-400">Upload any property listing PDF to get started</p>
                </div>

                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  Upload PDF
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
      
        </div>
      </div>
    );
  }

  // Step 2: Upload Screen
  if (step === 'upload') {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => setStep('choice')}
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {/* Upload Area */}
          <div className="relative">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-3xl p-16 transition-all duration-300 ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                  : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
              />

              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    isDragging
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-110'
                      : 'bg-gradient-to-br from-blue-500/20 to-blue-500/20'
                  }`}
                >
                  <Upload className="w-12 h-12 text-blue-400" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isDragging ? 'Drop your PDF here' : 'Upload Your Property PDF'}
                  </h3>
                  <p className="text-gray-400">or click to browse files on your computer</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Processing...' : 'Choose File'}
                </button>

                {/* File Info */}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 10 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Processing Screen
  if (step === 'processing') {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated Loader */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse' }} />

              <div className="absolute inset-0 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Processing Your PDF</h2>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{progress}% complete</p>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Extracting text from PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${progress > 70 ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <span>Preparing landing page data</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Success Screen
  if (step === 'success') {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full bg-gradient-to-br from-slate-950 via-green-950/20 to-black flex items-center justify-center p-4 overflow-auto">
        {/* Confetti-like background animation */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full animate-pulse opacity-50" />
              <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <FileCheck className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Success!
            </h2>
            <p className="text-gray-400 text-lg">
              Your PDF has been processed successfully
            </p>
            <p className="text-sm text-gray-500">
              File: {uploadedFile?.name}
            </p>
          </div>

          {/* Loading indicator */}
          <div className="text-sm text-green-400 font-medium">
            Loading your landing page...
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Error Screen
  if (step === 'error') {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full bg-gradient-to-br from-slate-950 via-red-950/20 to-black flex items-center justify-center p-4 overflow-auto">
        <div className="relative z-10 text-center space-y-8 max-w-md">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">File is Not Valid!</h2>
            <p className="text-gray-400">{error}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => setStep('choice')}
              className="flex-1 px-6 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg transition-all duration-300"
            >
              Start Over
            </button>
            <button
              onClick={resetUpload}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}