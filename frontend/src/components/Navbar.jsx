// import React, { useState, useEffect, useRef } from 'react';
// import { Search, Menu, MessageCircle, ChevronDown, Bell } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ toggleSidebar, toggleAIAssistant, isMobile, isTablet }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleToggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="flex items-center justify-between p-3 md:p-4 bg-black border-b border-slate-700 relative z-30">
//       <div className="flex items-center">
//         <button onClick={toggleSidebar} className="text-slate-400 mr-3 md:mr-4 hover:text-slate-300">
//           <Menu size={isMobile ? 18 : 20} />
//         </button>
//         <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>AgentSuit</div>
//       </div>
      
//       <div className="flex items-center space-x-2 md:space-x-4">
//         {/* Search - Hidden on mobile, shown on tablet+ */}
//         <div className="relative hidden md:block">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
//           <input 
//             type="text" 
//             placeholder="Search" 
//             className={`bg-[#222222] text-white text-sm rounded py-2 pl-10 pr-4 border border-slate-600 focus:outline-none focus:border-slate-500 ${
//               isTablet ? 'w-48' : 'w-80'
//             }`}
//           />
//         </div>
        
//         {/* Mobile search button */}
//         <button className="md:hidden text-slate-400 hover:text-slate-300">
//           <Search size={18} />
//         </button>
        
//         <button 
//           onClick={toggleAIAssistant}
//           className={`bg-[#222222] text-white text-sm rounded flex items-center space-x-1 md:space-x-2 hover:bg-[#222222] ${
//             isMobile ? 'px-2 py-1' : 'px-4 py-2'
//           }`}
//         >
//           <MessageCircle size={14} />
//           {!isMobile && <span>AI ASSISTANT</span>}
//         </button>
        
//         {/* New Lead Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={handleToggleDropdown}
//             className={`bg-[#222222] border border-[#FFAA09] text-white text-sm rounded font-medium hover:bg-[#22222] flex items-center space-x-1 md:space-x-2 ${
//               isMobile ? 'px-2 py-1' : 'px-4 py-2'
//             }`}
//           >
//             <ChevronDown size={14} />
//             {!isMobile && <span>NEW LEAD</span>}
//           </button>
          
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-md shadow-lg z-50 py-1">
//               <Link 
//                 to="/add-lead" 
//                 onClick={() => setIsDropdownOpen(false)}
//                 className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
//               >
//                 Add Single Lead
//               </Link>
//               <Link 
//                 to="/add-bulk-lead" 
//                 onClick={() => setIsDropdownOpen(false)}
//                 className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
//               >
//                 Bulk Upload
//               </Link>
//             </div>
//           )}
//         </div>
        
//         <Bell size={isMobile ? 18 : 20} className="text-slate-400" />
//         <div className={`bg-slate-600 rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}></div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;