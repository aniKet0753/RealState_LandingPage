import React from 'react';
import { User, TrendingUp, ClipboardList, X } from 'lucide-react';
import AIAssistant from './AIAssistant';

const AIPanel = ({ isAIAssistantOpen, toggleAIAssistant, isMobile, isTablet }) => {
  return (
    <div className={`bg-slate-800 border-l border-slate-700 transition-all duration-300 ease-in-out z-50 ${
      isMobile || isTablet 
        ? `fixed top-0 right-0 h-full ${isAIAssistantOpen ? 'w-80' : 'w-0 overflow-hidden'}` 
        : `${isAIAssistantOpen ? 'w-80' : 'w-0 overflow-hidden'}`
    }`}>
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-white font-medium">AI Assistant</h3>
        <button onClick={toggleAIAssistant} className="text-slate-400 hover:text-slate-300">
          <X size={18} />
        </button>
      </div>
      <div className="p-4">
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <ClipboardList size={16} className="text-slate-400" />
            <span className="text-sm text-slate-300">Task Suggestion</span>
          </div>
          <div className="bg-slate-700 p-3 rounded border border-slate-600">
            <p className="text-slate-300 text-sm mb-2">Compose an email to Emma Rodriguez, requesting her to kindly share the most recent real estate market statistics with me.</p>
            {/* <button className="text-slate-300 text-xs px-2 py-1 bg-slate-600 rounded hover:bg-slate-500">
              Schedule Call
            </button> */}
          </div>
        </div>
      </div>
      <AIAssistant />
      
    </div>
    
  );
};

export default AIPanel;