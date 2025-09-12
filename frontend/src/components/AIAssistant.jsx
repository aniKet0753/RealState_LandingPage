import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy } from 'lucide-react'; // Import a copy icon from lucide-react
import axios from '../api';
import { v4 as uuidv4 } from 'uuid';

const AIAssistant = () => {
  const [chatHistory, setChatHistory] = useState([
    { from: 'ai', text: "Hi there! I’m your AI assistant. How can I help you today?\nYou can start by telling me what you’d like to do or ask any questions." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId] = useState(uuidv4());
  const [leadData, setLeadData] = useState({});
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const chatContainerRef = useRef(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleSend = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setChatHistory(prev => [...prev, { from: 'user', text: userMessage }]);
    setInputValue('');

    try {
      const response = await axios.post('/api/ai-assistant', {
        userInput: userMessage,
        sessionId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });

      const { aiResponse, leadData: updatedLeadData, awaitingConfirmation: confirm } = response.data;

      setLeadData(updatedLeadData || leadData);
      setAwaitingConfirmation(confirm || false);

      setChatHistory(prev => [...prev, { from: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { from: 'ai', text: '❌ Error communicating with assistant' }]);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 2000); // Clear copied state after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="flex flex-col h-full p-3 bg-black rounded border border-slate-700">
      <div
        ref={chatContainerRef}
        className="overflow-y-auto space-y-3 mb-2"
        style={{ height: '400px' }} // fixed height
      >
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === 'ai' ? 'items-start' : 'justify-end'}`}>
            <div className={`relative p-2 rounded ${msg.from === 'ai' ? 'bg-[#1e1e1e] text-slate-300' : 'bg-slate-600 text-white'}`}>

              <p className="text-sm whitespace-pre-line pr-7 mt-5">{msg.text}</p>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(msg.text, idx)}
                className="absolute top-1 right-1 text-slate-400 hover:text-slate-200 p-1"
                aria-label="Copy message"
                title="Copy message"
                type="button"
              >
                {copiedMessageIndex === idx ? (
                  <span className="z-[100] text-green-400 text-xs">Copied!</span>
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your message..."
          // className="flex-1 px-3 py-2 rounded bg-[#1e1e1e] text-white border border-slate-600"
          className="flex-1 px-3 py-2 rounded bg-[#1e1e1e] text-white border border-slate-600 text-base w-full min-w-0"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>
          <Send size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;