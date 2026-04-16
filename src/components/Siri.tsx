import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Mic, MicOff } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const Siri: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setIsTyping(true);
    setResponse('');

    try {
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are Apple Intelligence, an advanced AI assistant integrated into macOS. You are helpful, concise, and capable. You are running on a web-based macOS clone.",
        }
      });

      const result = await model;
      setResponse(result.text || "I'm sorry, I couldn't process that.");
    } catch (error) {
      setResponse("I'm having trouble connecting right now.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full Screen Glowing Border */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[10000]"
            style={{
              boxShadow: 'inset 0 0 100px 10px rgba(168, 85, 247, 0.4), inset 0 0 40px 5px rgba(59, 130, 246, 0.4), inset 0 0 200px 20px rgba(236, 72, 153, 0.2)',
              border: '4px solid transparent',
            }}
          >
            <motion.div 
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 rounded-lg border-[4px] border-transparent" 
              style={{
                background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.8), rgba(236, 72, 153, 0.8), rgba(168, 85, 247, 0.8)) border-box',
                backgroundSize: '300% 300%',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }} 
            />
          </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
              className="fixed top-24 left-1/2 w-[600px] max-w-[90vw] z-[10001] flex flex-col gap-4"
            >
              {/* Response Area */}
              <AnimatePresence>
                {(response || isTyping) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="liquid-glass-dark rounded-3xl p-6 text-white/90 shadow-2xl leading-relaxed border border-white/20"
                  >
                  {isTyping ? (
                    <div className="flex gap-2 items-center justify-center py-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none text-[15px]">
                      {response}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

              {/* Input Area */}
              <form 
                onSubmit={handleAsk} 
                className="liquid-glass-dark rounded-full p-2 flex items-center gap-3 shadow-2xl relative overflow-hidden group border border-white/20"
              >
              {/* Animated Gradient Background for Input */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-50 group-focus-within:opacity-100 transition-opacity blur-xl" />
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center shrink-0 relative z-10 shadow-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type to Apple Intelligence..."
                className="flex-1 bg-transparent border-none outline-none text-[16px] text-white placeholder:text-white/40 relative z-10"
              />

              <button 
                type="button" 
                onClick={startListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'hover:bg-white/10 text-white/60 hover:text-white'}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button 
                type="button" 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 relative z-10 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
