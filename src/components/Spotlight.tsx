import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Clipboard, Zap, FileText, Send, Video, Loader2, Sparkles } from 'lucide-react';
import { AppID } from '../types';
import { useInstalledApps } from '../context/InstalledAppsContext';
import { GoogleGenAI } from "@google/genai";

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppID) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const { installedApps } = useInstalledApps();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'global' | 'action' | 'file' | 'clipboard'>('global');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setMode('global');
      setSelectedIndex(0);
      setAiResponse(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
    setAiResponse(null);

    // AI Search Trigger (Debounced)
    if (query.length > 3) {
      const timer = setTimeout(() => handleAiSearch(query), 1000);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleAiSearch = async (q: string) => {
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: q,
        config: {
          systemInstruction: "You are Spotlight, the macOS search assistant. Provide extremely concise, helpful answers. If the user asks for a fact, give it. If they ask to do something, explain how briefly.",
        },
      });
      setAiResponse(response.text || "No insights found.");
    } catch (error) {
      console.error("Spotlight AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const systemActions = [
    { id: 'restart', name: 'Restart Mac', icon: 'https://img.icons8.com/fluency/96/restart.png', category: 'utilities' },
    { id: 'sleep', name: 'Sleep', icon: 'https://img.icons8.com/fluency/96/moon.png', category: 'utilities' },
    { id: 'empty-trash', name: 'Empty Trash', icon: 'https://img.icons8.com/fluency/96/trash.png', category: 'utilities' },
    { id: 'lock', name: 'Lock Screen', icon: 'https://img.icons8.com/fluency/96/lock.png', category: 'utilities' },
  ];

  const smartActions = [
    { id: 'summarize', name: 'Summarize Notes', icon: 'https://img.icons8.com/fluency/96/notes.png', category: 'productivity' },
    { id: 'genmoji', name: 'Create Genmoji', icon: 'https://img.icons8.com/fluency/96/happy.png', category: 'social' },
    { id: 'writing-tools', name: 'Writing Tools', icon: 'https://img.icons8.com/fluency/96/edit.png', category: 'productivity' },
    { id: 'image-playground', name: 'Image Playground', icon: 'https://img.icons8.com/fluency/96/image.png', category: 'entertainment' },
    { id: 'translate', name: 'Translate to Spanish', icon: 'https://img.icons8.com/fluency/96/google-translate.png', category: 'social' },
    { id: 'shortcut-email', name: 'Send Email to Adriana', icon: 'https://img.icons8.com/fluency/96/mail.png', category: 'social' },
  ];

  const filteredItems = React.useMemo(() => {
    const items = [
      ...installedApps.map(app => ({ ...app, type: 'app' })),
      ...systemActions.map(action => ({ ...action, type: 'system' })),
      ...smartActions.map(action => ({ ...action, type: 'action' }))
    ];

    if (!query) return items.filter(item => mode === 'global' || item.category === mode);

    const q = query.toLowerCase();
    return items
      .map(item => {
        const name = item.name.toLowerCase();
        let score = 0;
        if (name === q) score = 100;
        else if (name.startsWith(q)) score = 80;
        else if (name.includes(q)) score = 40;
        
        // Boost apps
        if (item.type === 'app') score += 10;
        
        return { ...item, score };
      })
      .filter(item => item.score > 0 && (mode === 'global' || item.category === mode))
      .sort((a, b) => b.score - a.score);
  }, [query, mode, installedApps]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && filteredItems.length > 0) {
        const selected = filteredItems[selectedIndex];
        if (selected.type === 'app') {
          onOpenApp(selected.id as AppID);
        } else if (selected.type === 'system') {
          console.log('Executing system action:', selected.id);
          // In a real app, trigger system events here
        } else {
          console.log('Executing smart action:', selected.name);
        }
        onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[10001] bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: -10, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[680px] liquid-glass-dark rounded-[28px] window-shadow z-[10002] overflow-hidden border border-white/20"
            onKeyDown={handleKeyDown}
          >
            {/* Categories / Mode Tabs */}
            <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/10 overflow-x-auto no-scrollbar">
              {[
                { id: 'global', label: 'All', icon: Search },
                { id: 'utilities', label: 'Utilities', icon: Zap },
                { id: 'social', label: 'Social', icon: Send },
                { id: 'productivity', label: 'Productivity', icon: FileText },
                { id: 'entertainment', label: 'Entertainment', icon: Video },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                    mode === m.id ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:bg-white/10'
                  }`}
                >
                  <m.icon size={12} />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 flex items-center gap-4">
              <div className="text-white/40">
                <Search size={28} className="text-blue-400" />
              </div>
              <div className="flex-1 flex flex-col">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Spotlight Search"
                  className="bg-transparent border-none outline-none text-2xl text-white placeholder:text-white/20 font-medium tracking-tight"
                />
                {!query && (
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Suggestions:</span>
                    <span className="text-[10px] font-bold text-blue-400/60 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setQuery('Summarize')}>Summarize Notes</span>
                    <span className="text-[10px] font-bold text-blue-400/60 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setQuery('Genmoji')}>Create Genmoji</span>
                    <span className="text-[10px] font-bold text-blue-400/60 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setQuery('Empty Trash')}>Empty Trash</span>
                  </div>
                )}
              </div>
              {isAiLoading && <Loader2 size={20} className="text-blue-400 animate-spin" />}
            </div>

            {/* AI Response Area */}
            <AnimatePresence>
              {aiResponse && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 border-b border-white/10"
                >
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
                    <Sparkles size={18} className="text-blue-400 shrink-0 mt-1" />
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      {aiResponse}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {query && (
              <div className="p-2 border-t border-white/10 bg-black/20 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredItems.map((item, index) => (
                    <div 
                        key={item.id}
                        onClick={() => { 
                          if (item.type === 'app') {
                            onOpenApp(item.id as AppID);
                          }
                          onClose(); 
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border border-transparent group cursor-pointer transition-all ${
                          index === selectedIndex ? 'bg-blue-500/20 border-blue-500/30' : 'hover:bg-blue-500/20 hover:border-blue-500/30'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                          <img src={item.icon} className="w-10 h-10 rounded-xl object-contain" alt={item.name} referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/console.png'; }} />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{item.name}</span>
                            <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                              {item.type === 'action' ? 'Smart Action' : item.type === 'system' ? 'System Action' : 'Application'}
                            </span>
                          </div>
                        </div>
                        {index === selectedIndex && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white/60">
                            <span>{item.type === 'app' ? 'Open' : 'Execute'}</span>
                            <Command size={10} />
                          </div>
                        )}
                    </div>
                ))}
                {filteredItems.length === 0 && !isAiLoading && (
                  <div className="p-8 text-center flex flex-col items-center gap-2">
                    <Search size={32} className="text-white/10" />
                    <span className="text-white/40 text-sm font-medium">No results found for "{query}"</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 flex items-center justify-between text-[10px] text-white/30 font-medium">
              <div className="flex gap-4">
                <span>↑↓ to navigate</span>
                <span>Return to open</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles size={10} className="text-blue-400" />
                <span>Enhanced by Apple Intelligence</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
