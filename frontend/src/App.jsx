import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login.jsx';
import SignupPage from './components/Signup.jsx';
import DashboardPage from './components/Dashboard.jsx';
import AddLeadPage from './components/AddLead.jsx';

// const isAuthenticated = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
// Helper component for private routes
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
        !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    );

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage onLogin={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DashboardPage />
              </ProtectedRoute>
          } />
          <Route path="/add-lead" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AddLeadPage />
              </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;