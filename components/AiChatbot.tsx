import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Truck, Bot, Loader2, Sparkles } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Systems Online. I am the Shakti Logistics AI. Requesting input...",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithGemini(input);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col items-end pointer-events-none font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900/90 backdrop-blur-xl w-[92vw] md:w-96 h-[60vh] md:h-[500px] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-indigo-500/30 flex flex-col overflow-hidden mb-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 flex justify-between items-center border-b border-indigo-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-wide">SHAKTI AI CORE</h3>
                <p className="text-[10px] text-indigo-300 flex items-center gap-1 font-mono uppercase">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></span> Connected
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1 rounded-full transition-colors text-slate-300 relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border backdrop-blur-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-100 rounded-br-none shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-800/40 border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex gap-2">
                    {msg.sender === 'bot' && <Sparkles className="w-3 h-3 text-cyan-400 mt-1 shrink-0" />}
                    {msg.text}
                  </div>
                  <p className={`text-[9px] mt-1 text-right font-mono opacity-50`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/40 p-3 rounded-2xl rounded-bl-none border border-slate-700 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-mono animate-pulse">PROCESSING DATA...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter query..."
                className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-base text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(79,70,229,0.4)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center px-1">
              <p className="text-[9px] text-slate-600 font-mono uppercase">Status: Online</p>
              <p className="text-[9px] text-slate-600 font-mono">V2.5 FLASH</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all transform hover:scale-105 pointer-events-auto flex items-center justify-center border border-indigo-400/30"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-20 animate-ping"></div>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
