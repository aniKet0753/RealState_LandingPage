import React, { useState, useEffect, useRef } from 'react';
import axios from '../api'; // Import Axios
import { Search, Plus, Filter, Download, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: 10,
        });

        if (statusFilter) queryParams.append('status', statusFilter);
        if (sourceFilter) queryParams.append('source', sourceFilter);
        if (searchTerm) queryParams.append('search', searchTerm);

        const response = await axios.get(`/api/leads?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });

        setLeads(response.data.leads);
        setTotalLeads(response.data.totalLeads);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [currentPage, statusFilter, sourceFilter, searchTerm]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]})- ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') setStatusFilter(value);
    else if (filterType === 'source') setSourceFilter(value);

    setCurrentPage(1);
    setIsFilterDropdownOpen(false); // close after select
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setSourceFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded border border-slate-600 ${
            i === currentPage ? 'bg-slate-600 text-white' : 'hover:bg-slate-700 text-slate-500'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900 p-3 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
        <h1 className={`font-medium text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Leads</h1>
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => {
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
              }}
              className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
                isMobile ? 'px-2 py-1' : 'px-3 py-2'
              } ${(statusFilter || sourceFilter) ? 'bg-slate-700 border-slate-500' : ''}`}
            >
              <Filter size={14} />
              <span>Filter</span>
              {(statusFilter || sourceFilter) && (
                <span className="bg-slate-600 text-xs px-1 rounded-full">
                  {[statusFilter, sourceFilter].filter(Boolean).length}
                </span>
              )}
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border-2 border-grey-500 rounded shadow-lg z-50" style={{
                  position: 'fixed',
                  top: 'auto',
                  right: '4%',
                  transform: 'translateX(-50%)',
                }}>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white text-sm font-medium">Filters</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-slate-400 text-xs hover:text-white"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white text-sm font-medium mb-2">Status</h4>
                    <div className="space-y-1">
                      {['New', 'Nurturing', 'Qualified', 'Lost', 'Contacted'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange('status', status)}
                          className={`w-full text-left text-sm px-2 py-1 rounded flex justify-between items-center ${
                            statusFilter === status ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{status}</span>
                          {statusFilter === status && <span>✅</span>}
                        </button>
                      ))}

                    </div>
                  </div>

                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">Source</h4>
                    <div className="space-y-1">
                      {['Referral', 'SocialMedia', 'Website', 'Zillow', 'Other'].map((source) => (
                        <button
                          key={source}
                          onClick={() => handleFilterChange('source', source)}
                          className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-slate-700 ${
                            sourceFilter === source ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
              isMobile ? 'px-2 py-1' : 'px-3 py-2'
            }`}
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          <Link to="/add-lead">
            <button
              className={`bg-slate-600 text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-2 whitespace-nowrap ${
                isMobile ? 'px-2 py-1' : 'px-4 py-2'
              }`}
            >
              <Plus size={14} />
              <span>Add Lead</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Active Filters */}
      {(statusFilter || sourceFilter || searchTerm) && (
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-slate-400 text-sm">Active Filters:</span>
          {statusFilter && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Status: {statusFilter}</span>
              <button onClick={() => handleFilterChange('status', '')}><X size={10} /></button>
            </span>
          )}
          {sourceFilter && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Source: {sourceFilter}</span>
              <button onClick={() => handleFilterChange('source', '')}><X size={10} /></button>
            </span>
          )}
          {searchTerm && (
            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <span>Search: {searchTerm}</span>
              <button onClick={() => setSearchTerm('')}><X size={10} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-slate-500 text-xs hover:underline">Clear All</button>
        </div>
      )}

      {/* Lead Overview */}
      <div className="bg-slate-800 rounded border border-slate-700 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
          <h2 className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Lead Overview</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`bg-slate-900 text-white text-sm rounded py-2 pl-9 pr-3 border border-slate-600 focus:outline-none focus:border-slate-500 ${
                isMobile ? 'w-full' : 'w-60'
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No leads found.</div>
        ) : isMobile ? (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-700 p-3 rounded border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm text-white">
                      {lead.first_name[0]}
                      {lead.last_name[0]}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-slate-400 text-xs">{lead.type}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-600">
                    {lead.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>{lead.email}</div>
                  <div>{formatPhoneNumber(lead.phone_number)}</div>
                  <div className="flex justify-between">
                    <span>Source: {lead.source}</span>
                    <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                    <td className="py-3 pr-4">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                          {lead.first_name[0]}
                          {lead.last_name[0]}
                        </div>
                        <div>
                          <div className="text-white text-sm">
                            {lead.first_name} {lead.last_name}
                          </div>
                          <div className="text-slate-500 text-xs">{lead.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-sm">{lead.email}</td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{formatPhoneNumber(lead.phone_number)}</td>}
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-700">
                        {lead.status}
                      </span>
                    </td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.source}</td>}
                    {!isTablet && (
                      <td className="py-3 pr-4 text-slate-400 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    )}
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
          <div>
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalLeads)} of {totalLeads} results
          </div>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadPage;