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
          className="w-40 h-40 liquid-glass rounded-[28px] p-4 flex flex-col shadow-2xl pointer-events-auto cursor-default"
        >
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-red-500 font-bold text-sm tracking-widest">{formatMonth(currentTime)}</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-[10px] font-bold text-white/40">{day}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center text-[11px] font-semibold">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isToday = day === formatDay(currentTime);
              return (
                <div key={i} className="relative flex items-center justify-center h-4 w-4 mx-auto">
                  {isToday && <div className="absolute inset-0 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                  <span className={`relative z-10 ${isToday ? 'text-white' : 'text-white/80'}`}>{day}</span>
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
          className="w-40 h-40 bg-gradient-to-br from-blue-400/80 to-blue-600/80 backdrop-blur-[100px] rounded-[28px] border border-white/20 p-4 flex flex-col shadow-2xl pointer-events-auto cursor-default relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-20" />
          <div className="relative z-10">
            <div className="text-white text-sm font-bold">Vilnius</div>
            <div className="text-white text-5xl font-light mt-1">47°</div>
            
            <div className="mt-8">
              <div className="text-white/90 text-[11px] font-bold">Mostly Sunny</div>
              <div className="text-white/70 text-[10px] font-medium">H:49° L:27°</div>
            </div>
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
        className="w-[336px] h-40 liquid-glass rounded-[28px] flex flex-col items-center justify-center shadow-2xl pointer-events-auto cursor-default p-8 text-center"
      >
        <div className="w-12 h-12 mb-3 opacity-60">
          <img src="https://img.icons8.com/fluency/96/photos.png" alt="Photos" className="w-full h-full object-contain" />
        </div>
        <span className="text-white/60 text-[11px] font-medium leading-tight">
          Photos will appear here when they are finished processing
        </span>
      </motion.div>

      {/* Clock and Reminders */}
      <div className="flex gap-4">
        {/* Clock Widget */}
        <motion.div 
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-40 h-40 liquid-glass rounded-[28px] p-4 flex flex-col items-center justify-center shadow-2xl pointer-events-auto cursor-default"
        >
          <div className="relative w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center">
            <div className="absolute w-1 h-1 bg-white rounded-full z-10" />
            <div 
              className="absolute w-0.5 h-8 bg-white origin-bottom bottom-1/2 rounded-full" 
              style={{ transform: `rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() / 2}deg)` }} 
            />
            <div 
              className="absolute w-0.5 h-10 bg-white/80 origin-bottom bottom-1/2 rounded-full" 
              style={{ transform: `rotate(${currentTime.getMinutes() * 6}deg)` }} 
            />
            <div 
              className="absolute w-px h-11 bg-red-500 origin-bottom bottom-1/2 rounded-full" 
              style={{ transform: `rotate(${currentTime.getSeconds() * 6}deg)` }} 
            />
            {/* Clock numbers */}
            {[12, 3, 6, 9].map((num, i) => (
              <span key={num} className={`absolute text-[10px] font-bold text-white/40 ${i === 0 ? 'top-1' : i === 1 ? 'right-2' : i === 2 ? 'bottom-1' : 'left-2'}`}>{num}</span>
            ))}
          </div>
          <div className="mt-2 text-[11px] font-bold text-white/60">Vilnius</div>
        </motion.div>

        {/* Reminders Widget */}
        <motion.div 
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-40 h-40 liquid-glass rounded-[28px] p-4 flex flex-col shadow-2xl pointer-events-auto cursor-default"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-[12px] font-bold text-white/90">Reminders</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-white/30 rounded-full" />
              <div className="h-1.5 w-20 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-white/30 rounded-full" />
              <div className="h-1.5 w-16 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-white/30 rounded-full" />
              <div className="h-1.5 w-24 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="mt-auto text-[10px] font-bold text-white/30">3 REMINDERS</div>
        </motion.div>
      </div>

    </div>
  );
};
