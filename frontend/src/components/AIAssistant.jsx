import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Send } from 'lucide-react';
import axios from '../api';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const AIAssistant = ({ isMobile }) => {
  const [chatHistory, setChatHistory] = useState([
    { from: 'ai', text: "Hi! Let's create a new lead. What is the lead's first name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Generate session ID once per component mount
  const [sessionId] = useState(() => uuidv4());

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    const newUserMessage = { from: 'user', text: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    setInputValue('');

    const messagesForGrok = chatHistory.map(msg => ({
      role: msg.from === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    messagesForGrok.push({ role: 'user', content: userMessage });

    try {
      const response = await axios.post('/api/ai-assistant', {
        messages: messagesForGrok,
        sessionId, // ✅ send session ID
      });

      const aiResponse = response.data.aiResponse;
      setChatHistory(prev => [...prev, { from: 'ai', text: aiResponse }]);

      if (aiResponse.includes('✅ Lead has been successfully created!')) {
        setChatHistory(prev => [...prev, { from: 'ai', text: "Ready to create another lead? What is the lead's First Name?" }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { from: 'ai', text: '❌ An error occurred. Please try again.' }]);
    }
  };

  return (
    <div className="bg-slate-800 rounded border border-slate-700 p-3 md:p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>AI Lead Assistant</h2>
        <button className="text-slate-400 hover:text-slate-300">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3 md:space-y-4 mb-2">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === 'ai' ? 'items-start' : 'justify-end'}`}>
            {msg.from === 'ai' && (
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white flex-shrink-0 mr-2">
                AI
              </div>
            )}
            <div className={`p-2 md:p-3 rounded border border-slate-600 ${msg.from === 'ai' ? 'bg-slate-700 text-slate-300' : 'bg-slate-600 text-white'}`}>
              <p className={`text-sm`} dangerouslySetInnerHTML={{ __html: msg.text }}></p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-700 text-white text-sm rounded py-2 px-3 border border-slate-600 focus:outline-none focus:border-slate-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="text-slate-400 hover:text-slate-300">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;