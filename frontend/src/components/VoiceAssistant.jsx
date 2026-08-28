import React, { useState } from 'react';
import axios from 'axios';
import { Mic, MicOff, Volume2, X } from 'lucide-react';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('en');

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // In a real app, integrate Web Speech API recognition here
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setQuery('Which crop will give me the most profit?');
        fetchResponse('Which crop will give me the most profit?');
      }, 2000);
    }
  };

  const fetchResponse = async (q) => {
    try {
      const res = await axios.post('http://localhost:5000/api/llm/voice', {
        query: q,
        language,
        contextData: {} // we would pass real data here
      });
      setResponse(res.data.text);
      
      // Real app: use window.speechSynthesis or backend TTS
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition"
        >
          <Mic className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Volume2 className="w-5 h-5" /> Agri Voice Assistant
            </h3>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          
          <div className="p-4 bg-gray-50 flex justify-end">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs border-gray-300 rounded px-2 py-1 outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <div className="p-4 flex-1 h-64 overflow-y-auto space-y-4">
            {query && (
              <div className="flex justify-end">
                <div className="bg-gray-100 p-3 rounded-lg rounded-tr-none text-sm text-gray-800 max-w-[85%]">
                  {query}
                </div>
              </div>
            )}
            
            {response && (
              <div className="flex justify-start">
                <div className="bg-primary-50 border border-primary-100 p-3 rounded-lg rounded-tl-none text-sm text-primary-900 max-w-[90%]">
                  {response}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-center">
            <button 
              onClick={handleMicClick}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
