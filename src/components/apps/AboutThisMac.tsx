import React from 'react';
import { Apple } from 'lucide-react';
import metadata from '../../../metadata.json';

export const AboutThisMac: React.FC = () => {
  return (
    <div className="h-full bg-[#1e1e1e]/95 text-white overflow-hidden rounded-b-xl backdrop-blur-2xl flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-700 to-black flex items-center justify-center shadow-2xl border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />
          <Apple size={80} className="text-white relative z-10" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-1">macOS Tahoe</h1>
        <p className="text-[13px] text-white/50 mb-8 font-medium">Version 26.3.1</p>
        
        <div className="w-full max-w-[320px] space-y-3 text-[13px]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white/50 font-medium">MacBook Pro</span>
            <span className="text-white font-medium">16-inch, 2026</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white/50 font-medium">Chip</span>
            <span className="text-white font-medium">Apple M5 Max</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white/50 font-medium">Memory</span>
            <span className="text-white font-medium">128 GB</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white/50 font-medium">Startup Disk</span>
            <span className="text-white font-medium">Macintosh HD</span>
          </div>
          <div className="flex justify-between items-center pb-3">
            <span className="text-white/50 font-medium">Serial Number</span>
            <span className="text-white font-medium">C02XX0XXXXXX</span>
          </div>
        </div>
      </div>
      
      <div className="h-14 border-t border-white/10 flex items-center justify-center gap-4 bg-black/20 shrink-0">
        <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-[13px] font-medium transition-colors">
          More Info...
        </button>
      </div>
    </div>
  );
};
