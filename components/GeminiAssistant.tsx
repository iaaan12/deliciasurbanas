import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { MENU_ITEMS } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Delicias Urbanas. ¿Te ayudo a elegir algo rico para comer hoy en Salta?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Initialize AI client lazily to prevent crashes on initial load if env vars are missing
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const menuContext = MENU_ITEMS.map(i => `${i.name}: $${i.price} - ${i.description}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sos un asistente amable de 'Delicias Urbanas', un local de comidas al paso en Salta, Argentina.
        Tu objetivo es ayudar a los clientes a elegir qué comer, sugerir combos y ser muy cordial.
        Contexto del menú actual con precios actualizados:
        ${menuContext}
        
        Instrucciones:
        - Hablá en español de Argentina, usá un tono amigable y profesional.
        - Estamos en Av. San Martín 532, Salta.
        - Mencioná ofertas si te preguntan, como el pollo entero a $15.000 o los sándwiches desde $1.500.
        - Sé breve y servicial.
        
        Pregunta del cliente: ${userMessage}`,
      });

      const assistantText = response.text || "Lo siento, tuve un pequeño problema para pensar. ¿Me repetís?";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ups, parece que el asador se quedó sin leña (error de conexión). ¡Preguntame de nuevo!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[380px] bg-[#18181b] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-orange-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold">Chat Delicias Urbanas</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-700 p-1 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-orange-500 text-white rounded-tr-none' 
                  : 'bg-[#0f1113] text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#0f1113] p-3 rounded-2xl rounded-tl-none text-slate-400 border border-white/5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="¿Qué hay de rico hoy?"
              className="flex-1 bg-[#0f1113] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-slate-600"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-orange-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-600 text-white p-4 rounded-full shadow-xl hover:bg-orange-700 transition-all hover:scale-110 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};