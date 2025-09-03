import React from 'react';
import { TrendingUp, User, Briefcase, Calendar, ClipboardList, CircleUser, Settings, HelpCircle, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <TrendingUp size={18} />, link: '/dashboard' },
  { name: 'Leads', icon: <User size={18} />, link: '/leads' },
  { name: 'Deals', icon: <Briefcase size={18} />, link: '/deals' },
  { name: 'Appointments', icon: <Calendar size={18} />, link: '/appointments' },
  { 
    name: 'Analytics',
    subItems: [
      { name: 'Performance', icon: <TrendingUp size={18} />, link: '/analytics/performance' },
      { name: 'Reports', icon: <ClipboardList size={18} />, link: '/analytics/reports' },
    ]
  },
];

const settingsItems = [
  { name: 'Preferences', icon: <HelpCircle size={18} />, link: '/settings/preferences' },
  { name: 'Account', icon: <CircleUser size={18} />, link: '/settings/account' },
  { name: 'AI Settings', icon: <Settings size={18} />, link: '/settings/ai' },
];

const Sidebar = ({ isSidebarOpen, closePanels, isMobile, isTablet, toggleSidebar }) => {
  const location = useLocation(); // Get current route

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`flex flex-col bg-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out z-50 ${
        isMobile || isTablet
          ? `fixed top-0 left-0 h-full ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`
          : `${isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}`
      }`}
    >
      {(isMobile || isTablet) && (
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="text-lg font-bold text-white">AgentSuit</div>
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="text-sm text-slate-500 mb-2">MAIN MENU</div>
      </div>

      <nav className="flex-1 px-2 pb-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <>
                  <div className="text-sm text-slate-500 px-3 py-2 mt-4 uppercase tracking-wider">{item.name}</div>
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      to={subItem.link}
                      key={subIndex}
                      className={`flex items-center space-x-3 px-3 py-2 rounded text-sm ${
                        isActive(subItem.link) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                      onClick={closePanels}
                    >
                      <span>{subItem.icon}</span>
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={item.link}
                  className={`flex items-center space-x-3 px-3 py-2 rounded text-sm ${
                    isActive(item.link) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                  onClick={closePanels}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 my-4"></div>
        <div className="text-sm text-slate-500 px-3 py-2 uppercase tracking-wider">Settings</div>

        <div className="space-y-1">
          {settingsItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center space-x-3 px-3 py-2 rounded text-sm ${
                isActive(item.link) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
              onClick={closePanels}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 mx-3">
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-white text-sm font-medium mb-2">AI Assistant</div>
            <div className="text-slate-400 text-xs">Leverage AI to qualify leads and automate follow-ups.</div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;