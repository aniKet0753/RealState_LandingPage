import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const leads = [
    { name: 'Sarah Johnson', title: 'Buyer', email: 'sarah.j@example.com', phone: '(555) 123-4567', status: 'Qualified', source: 'Website', lastContact: 'Aug 12, 2025', avatar: 'SJ' },
    { name: 'Michael Chen', title: 'Seller', email: 'm.chen@example.com', phone: '(555) 987-6543', status: 'Nurturing', source: 'Referral', lastContact: 'Aug 10, 2025', avatar: 'MC' },
    { name: 'Alex Rodriguez', title: 'Investor', email: 'arod@example.com', phone: '(555) 234-5678', status: 'New', source: 'Social Media', lastContact: 'Aug 8, 2025', avatar: 'AR' },
    { name: 'Emily Taylor', title: 'Buyer', email: 'e.taylor@example.com', phone: '(555) 876-5432', status: 'Cold', source: 'Zillow', lastContact: 'Aug 5, 2025', avatar: 'ET' },
  ];
  
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900 p-3 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
        <h1 className={`font-medium text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Lead Management</h1>
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto">
          <button className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
            isMobile ? 'px-2 py-1' : 'px-3 py-2'
          }`}>
            <Filter size={14} />
            <span>Filter</span>
          </button>
          <button className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
            isMobile ? 'px-2 py-1' : 'px-3 py-2'
          }`}>
            <Download size={14} />
            <span>Export</span>
          </button>
          
          <Link to='/add-lead'>
            <button className={`bg-slate-600 text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-2 whitespace-nowrap ${
              isMobile ? 'px-2 py-1' : 'px-4 py-2'
            }`}>
              <Plus size={14} />
              <span>Add Lead</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Lead Overview */}
      <div className="bg-slate-800 rounded border border-slate-700 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
          <h2 className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Lead Overview</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className={`bg-slate-900 text-white text-sm rounded py-2 pl-9 pr-3 border border-slate-600 focus:outline-none focus:border-slate-500 ${
                isMobile ? 'w-full' : 'w-60'
              }`}
            />
          </div>
        </div>
        
        {/* Mobile Cards View */}
        {isMobile ? (
          <div className="space-y-3">
            {leads.map((lead, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm text-white">
                      {lead.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{lead.name}</div>
                      <div className="text-slate-400 text-xs">{lead.title}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-600">
                    {lead.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>{lead.email}</div>
                  <div>{lead.phone}</div>
                  <div className="flex justify-between">
                    <span>Source: {lead.source}</span>
                    <span>{lead.lastContact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop/Tablet Table View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-700">
                  <th className="pb-3 pr-4">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                  </th>
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  {!isTablet && <th className="pb-3 pr-4">Phone</th>}
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  {!isTablet && <th className="pb-3 pr-4">Source</th>}
                  {!isTablet && <th className="pb-3 pr-4">Last Contact</th>}
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 pr-4">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                          {lead.avatar}
                        </div>
                        <div>
                          <div className="text-white text-sm">{lead.name}</div>
                          <div className="text-slate-500 text-xs">{lead.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-sm">{lead.email}</td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.phone}</td>}
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-700">
                        {lead.status}
                      </span>
                    </td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.source}</td>}
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.lastContact}</td>}
                    <td className="py-3">
                      <button className="text-slate-400 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 text-sm text-slate-500 space-y-2 md:space-y-0">
          <div>Showing 1 to 4 of 247 results</div>
          <div className="flex items-center justify-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-600 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadPage;
