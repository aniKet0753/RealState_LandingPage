import React from 'react';
import { User, TrendingUp, ClipboardList, X } from 'lucide-react';
import AIAssistant from './AIAssistant';

const AIPanel = ({ isAIAssistantOpen, toggleAIAssistant, isMobile, isTablet }) => {
  return (
    <>
      {/* Backdrop for small screens */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity md:hidden
          ${isAIAssistantOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleAIAssistant}
        aria-hidden="true"
      />

      <div
        className={`bg-black border-l border-slate-700 transition-all duration-300 ease-in-out z-50
          ${isMobile || isTablet
            ? `fixed top-0 right-0 h-full w-80 transform ${isAIAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`
            : `${isAIAssistantOpen ? 'w-80' : 'w-0 overflow-hidden'} fixed top-0 right-0 h-screen`
          }`}
        role="complementary"
        aria-label="AI Assistant panel"
      >
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-white font-medium">AI Assistant</h3>
          <button onClick={toggleAIAssistant} className="p-2 text-slate-400 hover:text-slate-300" aria-label="Close AI panel">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content region */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-56px)]">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <ClipboardList size={16} className="text-slate-400" />
              <span className="text-sm text-slate-300">Task Suggestion</span>
            </div>
            <div className="bg-[#1e1e1e] p-3 rounded border border-slate-600">
              <p className="text-slate-300 text-sm mb-2">
                Compose an email to Emma Rodriguez, requesting her to kindly share the most recent real estate market statistics with me.
              </p>
            </div>
          </div>

          {/* Keep your assistant below; it will scroll with the content */}
          <AIAssistant />
        </div>
      </div>
    </>
  );
};

export default AIPanel;
