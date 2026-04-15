import React from 'react';
import { motion } from 'motion/react';
import { useSystem } from '../context/SystemContext';

export const Widgets: React.FC = () => {
  const { currentTime } = useSystem();

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const formatDay = (date: Date) => {
    return date.getDate();
  };

  return (
    <div className="absolute top-12 left-4 flex flex-col gap-4 z-0 pointer-events-none">
      
      {/* Top Row: Calendar and Weather */}
      <div className="flex gap-4">
        
        {/* Calendar Widget */}
        <motion.div 
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-40 h-40 bg-black/40 backdrop-blur-2xl rounded-[28px] border border-white/10 p-4 flex flex-col shadow-2xl pointer-events-auto cursor-default"
        >
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-red-500 font-bold text-sm tracking-widest">{formatMonth(currentTime)}</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-[10px] font-bold text-white/50">{day}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center text-[11px] font-semibold">
            {/* Mock calendar for the month */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isToday = day === formatDay(currentTime);
              return (
                <div key={i} className="relative flex items-center justify-center h-4 w-4 mx-auto">
                  {isToday && <div className="absolute inset-0 bg-red-500 rounded-full" />}
                  <span className={`relative z-10 ${isToday ? 'text-white' : 'text-white/90'}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Weather Widget */}
        <motion.div 
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 backdrop-blur-2xl rounded-[28px] border border-white/10 p-4 flex flex-col shadow-2xl pointer-events-auto cursor-default relative overflow-hidden"
        >
          <div className="text-white text-sm font-bold">Vilnius</div>
          <div className="text-white text-5xl font-light mt-1">47°</div>
          
          <div className="mt-auto">
            <div className="text-white/90 text-[11px] font-bold">Mostly Sunny</div>
            <div className="text-white/70 text-[10px] font-medium">H:49° L:27°</div>
          </div>
        </motion.div>

      </div>

      {/* Photos Widget */}
      <motion.div 
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-[336px] h-40 bg-white/10 backdrop-blur-3xl rounded-[28px] border border-white/10 flex flex-col items-center justify-center shadow-2xl pointer-events-auto cursor-default p-8 text-center"
      >
        <div className="w-12 h-12 mb-3 opacity-60">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-white/60 text-[11px] font-medium leading-tight">
          Photos will appear here when they are finished processing
        </span>
      </motion.div>

    </div>
  );
};
