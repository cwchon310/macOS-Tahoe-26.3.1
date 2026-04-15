import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Search, Apple, Command } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useNotifications } from '../context/NotificationContext';

interface MenuBarProps {
  activeApp: string;
  onToggleControlCenter: () => void;
  isControlCenterOpen: boolean;
  onToggleSiri: () => void;
  isSiriOpen: boolean;
  onOpenAbout: () => void;
  onSleep?: () => void;
  onRestart?: () => void;
  onShutDown?: () => void;
  onLogOut?: () => void;
}

const MENUS: Record<string, string[]> = {
  finder: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  safari: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  terminal: ['Shell', 'Edit', 'View', 'Window', 'Help'],
  settings: ['File', 'Edit', 'View', 'Window', 'Help'],
  apps: ['File', 'Edit', 'View', 'Window', 'Help'],
  default: ['File', 'Edit', 'View', 'Window', 'Help'],
};

const APP_NAMES: Record<string, string> = {
  finder: 'Finder',
  safari: 'Safari',
  terminal: 'Terminal',
  settings: 'System Settings',
  apps: 'Launchpad',
  calculator: 'Calculator',
  notes: 'Notes',
  appstore: 'App Store',
  wechat: 'WeChat',
};

const MenuBarComponent: React.FC<MenuBarProps> = ({ 
  activeApp, 
  onToggleControlCenter, 
  isControlCenterOpen, 
  onToggleSiri,
  isSiriOpen,
  onOpenAbout,
  onSleep,
  onRestart,
  onShutDown,
  onLogOut
}) => {
  const { currentTime } = useSystem();
  const { toggleNotificationCenter, isNotificationCenterOpen } = useNotifications();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showAppleMenu, setShowAppleMenu] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekDay} ${month} ${day}`;
  };

  const currentMenus = MENUS[activeApp] || MENUS.default;

  return (
    <div className="h-7 w-full bg-black/20 backdrop-blur-[60px] flex items-center justify-between px-4 text-[13px] font-medium text-white select-none z-[9999] border-b border-white/10 shadow-sm relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div 
            className={`px-2 py-0.5 rounded transition-colors cursor-default flex items-center justify-center ${showAppleMenu ? 'bg-white/20' : 'hover:bg-white/20'}`}
            onClick={() => setShowAppleMenu(!showAppleMenu)}
          >
            <Apple size={16} fill="currentColor" className="text-white" />
          </div>
          {showAppleMenu && (
            <div className="absolute top-7 left-0 w-56 bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-lg p-1 text-[13px] text-white/90 shadow-2xl z-[10000]">
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default" onClick={() => { onOpenAbout(); setShowAppleMenu(false); }}>About This Mac</div>
              <div className="border-t border-white/10 my-1" />
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default">System Settings...</div>
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default">App Store...</div>
              <div className="border-t border-white/10 my-1" />
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default">Recent Items</div>
              <div className="border-t border-white/10 my-1" />
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default">Force Quit...</div>
              <div className="border-t border-white/10 my-1" />
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default" onClick={() => { onSleep?.(); setShowAppleMenu(false); }}>Sleep</div>
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default" onClick={() => { onRestart?.(); setShowAppleMenu(false); }}>Restart...</div>
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default" onClick={() => { onShutDown?.(); setShowAppleMenu(false); }}>Shut Down...</div>
              <div className="border-t border-white/10 my-1" />
              <div className="px-3 py-1.5 hover:bg-blue-500 rounded cursor-default" onClick={() => { onLogOut?.(); setShowAppleMenu(false); }}>
                {user ? `Log Out ${user.name}...` : 'Log Out John Doe...'}
              </div>
            </div>
          )}
        </div>
        <span className="font-bold cursor-default tracking-tight drop-shadow-sm px-2 py-0.5 hover:bg-white/20 rounded transition-colors">{APP_NAMES[activeApp] || 'Finder'}</span>
        <div className="hidden md:flex gap-0.5 opacity-90">
          {currentMenus.map(item => (
            <span key={item} className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors cursor-default">{item}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5 opacity-90">
          <div className="px-2 py-0.5 hover:bg-white/20 rounded transition-colors cursor-default flex items-center justify-center">
            <Wifi size={15} className={`transition-opacity ${isOnline ? 'text-white' : 'text-white/30'}`} />
          </div>
          <div className="px-2 py-0.5 hover:bg-white/20 rounded transition-colors cursor-default flex items-center justify-center">
            <Search size={15} />
          </div>
          <div 
            className={`px-2 py-0.5 rounded transition-colors cursor-default flex items-center justify-center ${isSiriOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}
            onClick={onToggleSiri}
          >
            <div className="w-4 h-4 rounded-full relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 opacity-80" />
               <div className="absolute inset-0 blur-[1px] bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500" />
            </div>
          </div>
          <div 
            className={`px-2 py-0.5 rounded transition-colors cursor-default flex items-center justify-center ${isControlCenterOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}
            onClick={onToggleControlCenter}
          >
             <div className="w-4 h-4 relative">
               <div className="absolute top-0.5 left-0 w-4 h-1.5 border border-white/80 rounded-full">
                 <div className="absolute top-0 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
               </div>
               <div className="absolute bottom-0.5 left-0 w-4 h-1.5 border border-white/80 rounded-full">
                 <div className="absolute top-0 right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
               </div>
             </div>
          </div>
        </div>
        <div 
          className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-default ${isNotificationCenterOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}
          onClick={toggleNotificationCenter}
        >
          <span className="tabular-nums text-[12px]">{formatDate(currentTime)}</span>
          <span className="tabular-nums text-[12px]">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export const MenuBar = React.memo(MenuBarComponent);
