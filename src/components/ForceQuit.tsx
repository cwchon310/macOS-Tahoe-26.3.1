import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { WindowState, AppID } from '../types';

interface ForceQuitProps {
  isOpen: boolean;
  onClose: () => void;
  windows: Record<AppID, WindowState>;
  onForceQuit: (id: string) => void;
}

export const ForceQuit: React.FC<ForceQuitProps> = ({ isOpen, onClose, windows, onForceQuit }) => {
  const [selectedWindowId, setSelectedWindowId] = React.useState<string | null>(null);

  const uniqueApps = React.useMemo(() => {
    const apps: Record<string, { id: string; appId: AppID; name: string }> = {};
    Object.values(windows).forEach((w: WindowState) => {
      if (w.isOpen && !apps[w.id]) {
        apps[w.id] = { id: w.id, appId: w.id, name: w.title };
      }
    });
    return Object.values(apps);
  }, [windows]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[380px] liquid-glass-dark rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-white/5">
              <span className="text-xs font-bold text-white/60">Force Quit Applications</span>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <p className="text-[13px] text-white/80 leading-tight">
                If an application doesn't respond, you can force it to quit. Select the application and click Force Quit.
              </p>
              
              <div className="bg-black/20 border border-white/5 rounded-lg h-48 overflow-y-auto custom-scrollbar">
                {uniqueApps.length > 0 ? (
                  uniqueApps.map(app => (
                    <div 
                      key={app.id}
                      onClick={() => setSelectedWindowId(app.id)}
                      className={`px-3 py-1.5 text-[13px] cursor-default flex items-center gap-2 transition-colors ${selectedWindowId === app.id ? 'bg-blue-600 text-white' : 'text-white/90 hover:bg-white/5'}`}
                    >
                      <span className="truncate">{app.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 text-[13px]">
                    No applications running
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-2">
                <button 
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedWindowId}
                  onClick={() => {
                    if (selectedWindowId) {
                      onForceQuit(selectedWindowId);
                      setSelectedWindowId(null);
                    }
                  }}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${selectedWindowId ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                >
                  Force Quit
                </button>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-white/5 border-t border-white/5">
              <p className="text-[11px] text-white/40 italic">
                You can also press Command-Option-Esc to open this window.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
