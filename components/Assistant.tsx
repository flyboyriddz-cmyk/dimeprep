import React, { useState, useRef, useEffect } from 'react';
import { generateStylingAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Terminal, X, Minimize2, MessageSquare } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      text: 'SYSTEM_READY. AWAITING INPUT.',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Create a context string with available products and variants
      const inventoryContext = PRODUCTS.map(p => {
        let text = `- ${p.name} ($${p.price}) [${p.category}] (Total Stock: ${p.stock})`;
        if (p.variants) {
           text += '\n  Variants: ' + p.variants.map(v => `${v.name} (Stock: ${v.stock})`).join(', ');
        }
        return text;
      }).join('\n');
      
      const fullContext = `CURRENT INVENTORY STATUS:\n${inventoryContext}\n\nINSTRUCTION: Recommend items from this list based on the user's request. If stock is low (<5), mention urgency.`;

      const responseText = await generateStylingAdvice(userMsg.text, fullContext);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[90vw] sm:w-96 h-[500px] bg-snes-blue border-4 border-white z-50 flex flex-col shadow-retro rounded-lg overflow-hidden font-retro text-xl">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b-4 border-white bg-snes-blue text-white select-none">
        <span className="uppercase tracking-widest flex items-center gap-2 font-pixel text-[10px]">
          <MessageSquare className="w-4 h-4" /> PROTOCOL_AI
        </span>
        <button onClick={onClose} className="hover:text-snes-yellow text-white transition-colors">
            <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#004ba0] custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 border-2 shadow-sm rounded ${msg.role === 'user' ? 'border-white bg-white text-snes-dark' : 'border-white bg-snes-blue text-white'}`}>
              <div className="opacity-75 text-[14px] mb-1 uppercase font-pixel">
                {msg.role === 'user' ? 'USR' : 'SYS'}
              </div>
              <p className="leading-tight">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <span className="bg-white text-snes-blue px-2 py-1 font-pixel text-[8px] animate-pulse rounded">THINKING...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t-4 border-white bg-white">
        <div className="flex items-center gap-2">
          <span className="text-snes-purple font-pixel text-lg">{'>'}</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-snes-dark placeholder-gray-400 font-retro text-xl"
            placeholder="ENTER COMMAND..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="text-snes-blue hover:text-snes-purple transition-colors uppercase disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};