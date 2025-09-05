import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from '../api';
import { v4 as uuidv4 } from 'uuid';

const AIAssistant = () => {
  const [chatHistory, setChatHistory] = useState([
    { from: 'ai', text: "Hi! Let's create a new lead. What is the lead's first name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId] = useState(uuidv4());
  const [leadData, setLeadData] = useState({});
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const chatContainerRef = useRef(null);

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
      },
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
        }
    );

      const { aiResponse, leadData: updatedLeadData, awaitingConfirmation: confirm } = response.data;

      setLeadData(updatedLeadData || leadData);
      setAwaitingConfirmation(confirm || false);

      setChatHistory(prev => [...prev, { from: 'ai', text: aiResponse }]);

    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { from: 'ai', text: '❌ Error communicating with assistant' }]);
    }
  };

  return (
    <div className="flex flex-col h-full p-3 bg-slate-800 rounded border border-slate-700">
      <div
          ref={chatContainerRef}
          className="overflow-y-auto space-y-3 mb-2"
          style={{ height: '400px' }} // fixed height
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'ai' ? 'items-start' : 'justify-end'}`}>
              <div className={`p-2 rounded ${msg.from === 'ai' ? 'bg-slate-700 text-slate-300' : 'bg-slate-600 text-white'}`}>
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
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
          className="flex-1 px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
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
