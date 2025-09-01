import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear the authentication tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Redirect the user to the login page
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-white bg-[#1a1a1a]">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 bg-[#1e1e1e] p-4 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="text-yellow-500 font-bold text-lg">AGENTSUIT</div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center p-2 rounded-md bg-gray-700">
              <span className="mr-2">🏠</span> Dashboard
            </li>
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <span className="mr-2">👥</span> Leads
            </li>
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <span className="mr-2">🤝</span> Deals
            </li>
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <span className="mr-2">📅</span> Appointments
            </li>
          </ul>
          <div className="mt-8 text-sm text-gray-400">Analytics</div>
          <ul className="space-y-2 mt-2">
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <span className="mr-2">📈</span> Performance
            </li>
            <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <span className="mr-2">📊</span> Reports
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="p-4 bg-gray-800 rounded-md">
            <div className="font-semibold mb-2">AI Assistant</div>
            <p className="text-gray-400">Leverage AI to qualify leads and automate follow-ups</p>
            <button className="w-full bg-yellow-600 text-white py-2 rounded-md mt-2">Configure AI</button>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
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
            <h1 className="text-3xl font-bold md:mb-0">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-yellow-600 px-4 py-2 rounded-md flex items-center space-x-2" onClick={() => navigate('/add-lead')}>
              <span>+</span> <span>NEW LEAD</span>
            </button>
          </div>
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
              <li className="flex items-center p-2 rounded-md bg-gray-700">
                <span className="mr-2">🏠</span> Dashboard
              </li>
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <span className="mr-2">👥</span> Leads
              </li>
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <span className="mr-2">🤝</span> Deals
              </li>
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <span className="mr-2">📅</span> Appointments
              </li>
            </ul>
            <div className="mt-8 text-sm text-gray-400">Analytics</div>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <span className="mr-2">📈</span> Performance
              </li>
              <li className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <span className="mr-2">📊</span> Reports
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="p-4 bg-gray-800 rounded-md">
              <div className="font-semibold mb-2">AI Assistant</div>
              <p className="text-gray-400">Leverage AI to qualify leads and automate follow-ups</p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded-md mt-2">Configure AI</button>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <div className="text-sm text-gray-400">Total Leads</div>
            <div className="text-2xl font-bold mt-1">247</div>
          </div>
          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <div className="text-sm text-gray-400">New This Week</div>
            <div className="text-2xl font-bold mt-1">32</div>
          </div>
          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <div className="text-sm text-gray-400">Qualified Leads</div>
            <div className="text-2xl font-bold mt-1">86</div>
          </div>
          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <div className="text-sm text-gray-400">Conversion Rate</div>
            <div className="text-2xl font-bold mt-1">24.8%</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#1e1e1e] p-4 md:p-6 rounded-lg mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Lead Overview</h2>
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2 text-sm font-medium text-gray-400">Name</th>
                <th className="p-2 text-sm font-medium text-gray-400 hidden sm:table-cell">Email</th>
                <th className="p-2 text-sm font-medium text-gray-400 hidden lg:table-cell">Phone</th>
                <th className="p-2 text-sm font-medium text-gray-400">Status</th>
                <th className="p-2 text-sm font-medium text-gray-400 hidden md:table-cell">Source</th>
                <th className="p-2 text-sm font-medium text-gray-400 hidden md:table-cell">Last Contact</th>
                <th className="p-2 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-2 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">SJ</div> Sarah Johnson
                </td>
                <td className="p-2 text-gray-400 hidden sm:table-cell">sarah.j@example.com</td>
                <td className="p-2 text-gray-400 hidden lg:table-cell">(555) 123-4567</td>
                <td className="p-2">
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">Qualified</span>
                </td>
                <td className="p-2 text-gray-400 hidden md:table-cell">Website</td>
                <td className="p-2 text-gray-400 hidden md:table-cell">Aug 12, 2025</td>
                <td className="p-2">...</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Assistant and Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="h-64 bg-[#2c2c2c] rounded-md p-4 overflow-y-auto">
              <div className="bg-gray-700 p-3 rounded-lg mb-2 text-sm">
                <span className="font-semibold">Good morning!</span> Here are today's insights:
              </div>
            </div>
            <div className="mt-4 flex">
              <input type="text" placeholder="Ask your AI assistant..." className="flex-1 bg-gray-700 p-3 rounded-md focus:outline-none" />
              <button className="ml-2 bg-yellow-600 px-4 py-2 rounded-md">Send</button>
            </div>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Today's Tasks</h2>
              <button className="bg-yellow-600 px-3 py-1 rounded-md text-sm">+ Add Task</button>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between p-3 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3 accent-yellow-600" />
                  <span>Call Sarah Johnson about offer details</span>
                </div>
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">High</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3 accent-yellow-600" />
                  <span>Prepare listing presentation</span>
                </div>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Medium</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg bg-gray-700">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3 accent-yellow-600" />
                  <span>Submit paperwork for closing</span>
                </div>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Done</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;