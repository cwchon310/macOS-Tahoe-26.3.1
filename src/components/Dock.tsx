import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AppID, WindowState } from '../types';
import { useDockPosition } from '../context/DockPositionContext';
import { useInstalledApps } from '../context/InstalledAppsContext';
import { useSystem } from '../context/SystemContext';

interface DockProps {
  onOpenApp: (id: AppID) => void;
  activeApp: AppID;
  openApps: AppID[];
  windows: Record<AppID, WindowState>;
  renderAppContent: (id: AppID) => React.ReactNode;
}

interface DockItemProps {
  app: any;
  isOpen: boolean;
  isActive: boolean;
  onOpenApp: (id: AppID) => void;
  mouseX: any;
  previewContent: React.ReactNode;
}

const DockItem: React.FC<DockItemProps> = ({ app, isOpen, isActive, onOpenApp, mouseX, previewContent }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { setDockPosition } = useDockPosition();

  // Update position on mount and resize
  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setDockPosition(app.id, { x: rect.x, y: rect.y, width: rect.width, height: rect.height });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [app.id, setDockPosition]);

  const { currentTime, minimizeEffect, magnificationFactor } = useSystem();

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Magnification is enabled when magnificationFactor > 1
  const targetWidth = 48 * magnificationFactor;

  const widthSync = useTransform(distance, [-150, 0, 150], [48, targetWidth, 48]);
  const width = useSpring(widthSync, { 
    mass: 0.1, 
    stiffness: 150, 
    damping: 12,
    restDelta: 0.001
  });

  const isCalendar = app.id === 'calendar';
  const isLaunchpad = app.id === 'apps';

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onClick={() => onOpenApp(app.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer flex flex-col items-center justify-end origin-bottom"
      draggable
      onDragStart={(e: React.DragEvent) => {
        e.dataTransfer.setData('app', JSON.stringify(app));
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-end">
        {isCalendar ? (
          <motion.div 
            className="w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
            whileTap={{ scale: 0.8 }}
            animate={{ 
              y: isOpen && !isActive ? [0, -15, 0] : 0,
              scale: isActive ? 1.08 : 1,
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1/4 bg-red-500 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white uppercase tracking-tighter">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center pt-1">
              <span className="text-2xl font-bold text-gray-800 leading-none">
                {currentTime.getDate()}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.img
            src={isLaunchpad ? 'https://img.icons8.com/fluency/96/rocket.png' : app.icon}
            alt={app.name}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            whileTap={{ scale: 0.8 }}
            animate={{ 
              y: isOpen && !isActive ? [0, -15, 0] : 0,
              scale: isActive ? 1.08 : 1,
              filter: isActive 
                ? 'drop-shadow(0 0 12px rgba(255,255,255,0.3)) brightness(1.1)' 
                : isHovered 
                  ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4)) brightness(1.05)' 
                  : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2)) brightness(1)'
            }}
            transition={{
              y: {
                duration: 0.6,
                repeat: isOpen && !isActive ? 2 : 0,
                ease: "easeOut"
              },
              scale: { duration: 0.2 },
              filter: { duration: 0.2 }
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/console.png';
            }}
          />
        )}
        {/* Reflection */}
        <div className="absolute -bottom-[60%] left-0 w-full h-full opacity-10 pointer-events-none scale-y-[-0.6] blur-[2px] overflow-hidden">
          {isCalendar ? (
             <div className="w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-1/4 bg-red-500" />
                <span className="text-2xl font-bold text-gray-800">{currentTime.getDate()}</span>
             </div>
          ) : (
            <img 
              src={isLaunchpad ? 'https://img.icons8.com/fluency/96/rocket.png' : app.icon} 
              alt="" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-md text-[13px] font-medium text-white/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
        {app.name}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e1e1e]/90 border-r border-b border-white/10 rotate-45" />
      </div>

      {/* Status Indicator */}
      {isOpen && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
      )}
    </motion.div>
  );
};

export const Dock: React.FC<DockProps> = ({ onOpenApp, activeApp, openApps, windows, renderAppContent }) => {
  const mouseX = useMotionValue(Infinity);
  const { installedApps } = useInstalledApps();

  // Filter for pinned apps (just taking the first 15 for now as "pinned")
  // In a real app, we'd have a separate "pinnedApps" state
  const dockApps = React.useMemo(() => {
    // Ensure Finder is always first
    const coreApps = [
      { id: 'finder', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/MacOS_Finder_icon.png/600px-MacOS_Finder_icon.png', name: 'Finder' },
      { id: 'apps', icon: 'https://img.icons8.com/fluency/96/rocket.png', name: 'Launchpad' },
    ];
    
    // We want to show specific apps in the dock to match the image
    const pinnedAppIds = [
      'safari', 'phone', 'messages', 'mail', 'maps', 'photos', 'facetime', 
      'calendar', 'contacts', 'reminders', 'notes', 'freeform', 'tv', 
      'music', 'podcasts', 'appstore', 'settings'
    ];
    
    const otherApps = pinnedAppIds.map(id => {
      if (id === 'phone') {
        return { id: 'phone', icon: 'https://img.icons8.com/fluency/96/phone.png', name: 'Phone' };
      }
      return installedApps.find(app => app.id === id);
    }).filter(Boolean) as any[];
    
    return [...coreApps, ...otherApps];
  }, [installedApps]);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[10000]">
      <motion.div 
        className="px-3 pb-2 pt-3 rounded-[24px] flex items-end gap-2 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-[100px] relative overflow-visible h-[76px] liquid-glass-dark"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        {dockApps.map((app) => (
          <DockItem 
            key={app.id} 
            app={app} 
            isOpen={openApps.includes(app.id as AppID)} 
            isActive={activeApp === app.id} 
            onOpenApp={onOpenApp} 
            mouseX={mouseX} 
            previewContent={renderAppContent(app.id as AppID)}
          />
        ))}
        
        {/* Separator */}
        <div className="w-[1px] h-10 bg-white/20 mx-1 rounded-full mb-1.5" />
        
        {/* Downloads */}
        <DockItem 
          app={{ id: 'downloads', icon: 'https://img.icons8.com/fluency/96/mac-folder.png', name: 'Downloads' }} 
          isOpen={openApps.includes('downloads' as AppID)} 
          isActive={activeApp === 'downloads'} 
          onOpenApp={onOpenApp} 
          mouseX={mouseX} 
          previewContent={null}
        />

        {/* Trash */}
        <DockItem 
          app={{ id: 'trash', icon: 'https://img.icons8.com/fluency/96/trash.png', name: 'Trash' }} 
          isOpen={openApps.includes('trash' as AppID)} 
          isActive={activeApp === 'trash'} 
          onOpenApp={onOpenApp} 
          mouseX={mouseX} 
          previewContent={null}
        />
      </motion.div>
    </div>
  );
};
