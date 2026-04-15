import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Airplay, Battery } from 'lucide-react';

export const ControlCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-9 right-4 w-80 liquid-glass-dark rounded-[28px] window-shadow z-[9999] p-4 border border-white/10 grid grid-cols-2 gap-3"
          >
            {/* Top Left: Connectivity */}
            <div className="bg-white/5 backdrop-blur-[100px] rounded-[22px] p-3 flex flex-col gap-3 border border-white/10 shadow-inner">
              <div 
                className={`flex items-center gap-3 group cursor-pointer ${wifi ? '' : 'opacity-50'}`}
                onClick={() => setWifi(!wifi)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-active:scale-95 transition-transform ${wifi ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <Wifi size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">Wi-Fi</span>
                  <span className="text-[9px] text-white/50">{wifi ? 'Home-5G' : 'Off'}</span>
                </div>
              </div>
              <div 
                className={`flex items-center gap-3 group cursor-pointer ${bluetooth ? '' : 'opacity-50'}`}
                onClick={() => setBluetooth(!bluetooth)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-active:scale-95 transition-transform ${bluetooth ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <Bluetooth size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">Bluetooth</span>
                  <span className="text-[9px] text-white/50">{bluetooth ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-active:scale-95 transition-transform">
                  <Airplay size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">AirDrop</span>
                  <span className="text-[9px] text-white/50">Contacts Only</span>
                </div>
              </div>
            </div>

            {/* Top Right: Focus & Brightness */}
            <div className="flex flex-col gap-3">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 border border-white/5 shadow-inner cursor-default hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  <Moon size={14} className="text-white" />
                </div>
                <span className="text-[11px] font-bold">Focus</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 flex flex-col gap-2 border border-white/5 shadow-inner">
                <span className="text-[11px] font-bold">Display</span>
                <div className="h-6 bg-white/10 rounded-full relative overflow-hidden group">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={brightness} 
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-white/80 transition-colors" style={{ width: `${brightness}%` }} />
                  <Sun size={12} className="absolute left-2 top-1.5 text-black/60 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Sound */}
            <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-3 flex flex-col gap-2 border border-white/5 shadow-inner">
              <span className="text-[11px] font-bold">Sound</span>
              <div className="h-6 bg-white/10 rounded-full relative overflow-hidden group">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-white/80 transition-colors" style={{ width: `${volume}%` }} />
                <Volume2 size={12} className="absolute left-2 top-1.5 text-black/60 pointer-events-none" />
              </div>
            </div>

            {/* Music Player Mockup */}
            <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 border border-white/5 shadow-inner hover:bg-white/10 transition-colors cursor-default">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white/20 rounded-full border border-white/40" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold">Now Playing</span>
                <span className="text-[9px] text-white/40">Music App</span>
              </div>
              <div className="ml-auto flex gap-3 text-white/60">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white/40 rounded-full" />
                <div className="w-2 h-2 bg-white/40 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
