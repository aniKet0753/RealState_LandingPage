import React from 'react';
import { Search, Menu, MessageCircle, Plus, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, toggleAIAssistant, isMobile, isTablet }) => {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-slate-900 border-b border-slate-700 relative z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-slate-400 mr-3 md:mr-4 hover:text-slate-300">
          <Menu size={isMobile ? 18 : 20} />
        </button>
        <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>AgentSuit</div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search - Hidden on mobile, shown on tablet+ */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className={`bg-slate-800 text-white text-sm rounded py-2 pl-10 pr-4 border border-slate-600 focus:outline-none focus:border-slate-500 ${
              isTablet ? 'w-48' : 'w-80'
            }`}
          />
        </div>
        
        {/* Mobile search button */}
        <button className="md:hidden text-slate-400 hover:text-slate-300">
          <Search size={18} />
        </button>
        
        <button 
          onClick={toggleAIAssistant}
          className={`bg-slate-700 text-white text-sm rounded flex items-center space-x-1 md:space-x-2 hover:bg-slate-600 ${
            isMobile ? 'px-2 py-1' : 'px-4 py-2'
          }`}
        >
          <MessageCircle size={14} />
          {!isMobile && <span>AI ASSISTANT</span>}
        </button>
        
        <Link to='/add-lead'>
          <button className={`bg-slate-600 text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-1 md:space-x-2 ${
            isMobile ? 'px-2 py-1' : 'px-4 py-2'
          }`}>
            <Plus size={14} />
            {!isMobile && <span>NEW LEAD</span>}
          </button>
        </Link>
        
        <Bell size={isMobile ? 18 : 20} className="text-slate-400" />
        <div className={`bg-slate-600 rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}></div>
      </div>
    </div>
  );
};

export default Navbar;