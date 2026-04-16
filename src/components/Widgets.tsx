import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Calendar, Image as ImageIcon, Clock } from 'lucide-react';

export const Widgets: React.FC = () => {
  return (
    <div className="fixed left-6 top-16 flex flex-col gap-6 pointer-events-none">
      {/* Weather Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-40 h-40 liquid-glass rounded-[32px] p-4 flex flex-col justify-between pointer-events-auto shadow-2xl border border-white/20"
      >
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-white/60">Cupertino</span>
          <Cloud size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-4xl font-light">72°</span>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Mostly Cloudy</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold">
          <span>H:75°</span>
          <span>L:62°</span>
        </div>
      </motion.div>

      {/* Calendar Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-40 h-40 bg-white rounded-[32px] p-4 flex flex-col pointer-events-auto shadow-2xl border border-white/10 overflow-hidden"
      >
        <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em]">Thursday</span>
        <span className="text-6xl font-light text-black -mt-1">16</span>
        <div className="mt-auto flex flex-col">
          <span className="text-[10px] font-bold text-black/40 uppercase">Next Event</span>
          <span className="text-[11px] font-bold text-black truncate">Design Sync</span>
        </div>
      </motion.div>

      {/* Photos Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-40 h-40 liquid-glass rounded-[32px] overflow-hidden pointer-events-auto shadow-2xl border border-white/20 group"
      >
        <img 
          src="https://picsum.photos/seed/macos/400/400" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt="Featured" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Featured</span>
          <span className="text-[11px] font-bold text-white">Yosemite Valley</span>
        </div>
      </motion.div>
    </div>
  );
};
