import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Clipboard, Zap, FileText, Send } from 'lucide-react';
import { AppID } from '../types';
import { useInstalledApps } from '../context/InstalledAppsContext';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppID) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const { installedApps } = useInstalledApps();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'global' | 'action' | 'file' | 'clipboard'>('global');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setMode('global');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const filteredApps = installedApps.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredApps.length - 1));
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && filteredApps.length > 0) {
        onOpenApp(filteredApps[selectedIndex].id as AppID);
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
            {/* Mode Tabs */}
            <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/10">
              {[
                { id: 'global', label: 'Global', icon: Search },
                { id: 'action', label: 'Actions', icon: Zap },
                { id: 'file', label: 'Files', icon: FileText },
                { id: 'clipboard', label: 'Clipboard', icon: Clipboard },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    mode === m.id ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:bg-white/10'
                  }`}
                >
                  <m.icon size={12} />
                  {m.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 px-3 text-[10px] text-white/20 font-mono">
                <Command size={10} /> 1-4
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 flex items-center gap-4">
              <div className="text-white/40">
                {mode === 'global' && <Search size={28} />}
                {mode === 'action' && <Zap size={28} className="text-yellow-400" />}
                {mode === 'file' && <FileText size={28} className="text-blue-400" />}
                {mode === 'clipboard' && <Clipboard size={28} className="text-green-400" />}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'action' ? 'Type a command (e.g., "SE" to send email)...' : 
                  mode === 'clipboard' ? 'Search clipboard history...' :
                  'Spotlight Search'
                }
                className="flex-1 bg-transparent border-none outline-none text-2xl text-white placeholder:text-white/20 font-medium tracking-tight"
              />
            </div>

            {/* Results */}
            {query && (
              <div className="p-2 border-t border-white/10 bg-black/20 max-h-[300px] overflow-y-auto">
                {filteredApps.map((app, index) => (
                    <div 
                        key={app.id}
                        onClick={() => { onOpenApp(app.id as AppID); onClose(); }}
                        className={`flex items-center gap-3 p-3 rounded-2xl border border-transparent group cursor-pointer ${
                          index === selectedIndex ? 'bg-blue-500/20 border-blue-500/30' : 'hover:bg-blue-500/20 hover:border-blue-500/30'
                        }`}
                    >
                        <img src={app.icon} className="w-10 h-10 rounded-xl object-contain" alt={app.name} referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/console.png'; }} />
                        <span className="text-sm font-bold">{app.name}</span>
                    </div>
                ))}
                {filteredApps.length === 0 && (
                  <div className="p-4 text-center text-white/40">No results found</div>
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
                <Zap size={10} />
                <span>Powered by Apple Intelligence</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
