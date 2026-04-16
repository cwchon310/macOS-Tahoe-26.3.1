import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Airplay, Battery, Zap } from 'lucide-react';

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
            className="fixed top-9 right-4 w-80 liquid-glass-dark rounded-[32px] window-shadow z-[9999] p-4 border border-white/10 grid grid-cols-2 gap-3"
          >
            {/* Top Left: Connectivity */}
            <div className="bg-white/5 backdrop-blur-[100px] rounded-[24px] p-3 flex flex-col gap-3 border border-white/10 shadow-inner">
              <div 
                className={`flex items-center gap-3 group cursor-pointer ${wifi ? '' : 'opacity-50'}`}
                onClick={() => setWifi(!wifi)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-active:scale-95 transition-all ${wifi ? 'bg-blue-500' : 'bg-white/10'}`}>
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
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-active:scale-95 transition-all ${bluetooth ? 'bg-blue-500' : 'bg-white/10'}`}>
                  <Bluetooth size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">Bluetooth</span>
                  <span className="text-[9px] text-white/50">{bluetooth ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>

            {/* Top Right: Focus & Battery */}
            <div className="flex flex-col gap-3">
              <div className="bg-white/5 backdrop-blur-xl rounded-[24px] p-3 flex items-center gap-3 border border-white/10 shadow-inner cursor-default hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  <Moon size={14} className="text-white" />
                </div>
                <span className="text-[11px] font-bold">Focus</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-[24px] p-3 flex items-center gap-3 border border-white/10 shadow-inner cursor-default hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  <Battery size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">Battery</span>
                  <span className="text-[9px] text-white/50">84%</span>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-[24px] p-4 flex flex-col gap-4 border border-white/10 shadow-inner">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-bold opacity-60">Display</span>
                  <Sun size={10} className="text-white/40" />
                </div>
                <div className="h-7 bg-white/10 rounded-full relative overflow-hidden group">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={brightness} 
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-y-0 left-0 bg-white/80 group-hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ width: `${brightness}%` }} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-bold opacity-60">Sound</span>
                  <Volume2 size={10} className="text-white/40" />
                </div>
                <div className="h-7 bg-white/10 rounded-full relative overflow-hidden group">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-y-0 left-0 bg-white/80 group-hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ width: `${volume}%` }} />
                </div>
              </div>
            </div>

            {/* Third-party App Control Mock */}
            <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-[24px] p-3 flex items-center gap-3 border border-white/10 shadow-inner hover:bg-white/10 transition-colors cursor-default">
              <div className="w-10 h-10 rounded-xl bg-orange-500 shadow-lg flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold">Smart Home</span>
                <span className="text-[9px] text-white/40">Living Room Lights</span>
              </div>
              <div className="ml-auto w-12 h-6 bg-blue-500 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
