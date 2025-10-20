// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import AIPanel from './AIPanel';

// const Layout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const isMobileSize = window.innerWidth < 768;
//       const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1024;
      
//       setIsMobile(isMobileSize);
//       setIsTablet(isTabletSize);
      
//       if (window.innerWidth >= 1024) {
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleAIAssistant = () => {
//     setIsAIAssistantOpen(!isAIAssistantOpen);
//   };

//   const closePanels = () => {
//     if (isMobile || isTablet) {
//       setIsSidebarOpen(false);
//       setIsAIAssistantOpen(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-slate-900 text-slate-300">
//       <Navbar 
//         toggleSidebar={toggleSidebar} 
//         toggleAIAssistant={toggleAIAssistant}
//         isMobile={isMobile}
//         isTablet={isTablet}
//       />
      
//       <div className="flex flex-1 overflow-hidden relative">
//         {(isSidebarOpen || isAIAssistantOpen) && (isMobile || isTablet) && (
//           <div 
//             className="fixed inset-0 bg-white/20 z-40"
//             onClick={closePanels}
//           ></div>
//         )}
        
//         <Sidebar 
//           isSidebarOpen={isSidebarOpen} 
//           closePanels={closePanels}
//           isMobile={isMobile}
//           isTablet={isTablet}
//           toggleSidebar={toggleSidebar}
//         />
        
//         {/* The Outlet component renders the child route's element */}
//         <Outlet 
//           context={{ isMobile, isTablet, closePanels }}
//         />
        
//         <AIPanel 
//           isAIAssistantOpen={isAIAssistantOpen} 
//           toggleAIAssistant={toggleAIAssistant}
//           isMobile={isMobile}
//           isTablet={isTablet}
//         />
//       </div>
//     </div>
//   );
// };

// export default Layout;
