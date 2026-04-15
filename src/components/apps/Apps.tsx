import React, { useState } from 'react';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppID } from '../../types';
import { useInstalledApps, AppData } from '../../context/InstalledAppsContext';
import { useSystem } from '../../context/SystemContext';

interface AppItem extends AppData {
  isFolder?: boolean;
  children?: AppItem[];
}

export const ALL_APPS: AppItem[] = []; // Deprecated, use context

export const Apps: React.FC<{ onOpenApp: (id: AppID) => void; onClose?: () => void }> = ({ onOpenApp, onClose }) => {
  const { installedApps } = useInstalledApps();
  const { wallpaper } = useSystem();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFolder, setActiveFolder] = useState<AppItem | null>(null);

  // Pagination logic
  const APPS_PER_PAGE = 35; // Increased for better density
  const pages = React.useMemo(() => {
    const pgs = [];
    for (let i = 0; i < installedApps.length; i += APPS_PER_PAGE) {
      pgs.push(installedApps.slice(i, i + APPS_PER_PAGE));
    }
    return pgs;
  }, [installedApps]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredApps = installedApps.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAppClick = (app: AppItem) => {
    if (app.isFolder) {
      setActiveFolder(app);
    } else {
      onOpenApp(app.id as AppID);
    }
  };

  const renderGrid = (apps: AppItem[]) => (
    <div className="grid grid-cols-5 md:grid-cols-7 gap-x-8 gap-y-12 max-w-6xl mx-auto content-start">
      {apps.map((app) => (
        <motion.div
          key={app.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAppClick(app)}
          className="flex flex-col items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
            {app.isFolder ? (
              <div className="w-full h-full bg-white/20 rounded-[22px] border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-all p-3">
                <div className="grid grid-cols-3 gap-1.5 w-full h-full">
                  {app.children?.slice(0, 9).map((child, i) => (
                    <img key={i} src={child.icon} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>
            ) : app.id === 'calendar' ? (
              <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/4 bg-red-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center pt-2">
                  <span className="text-4xl font-bold text-gray-800 leading-none">
                    {new Date().getDate()}
                  </span>
                </div>
              </div>
            ) : (
              <img 
                src={app.icon} 
                alt={app.name} 
                className="w-full h-full object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/console.png';
                }}
              />
            )}
          </div>
          <span className="text-[13px] font-medium text-center line-clamp-1 text-white drop-shadow-md tracking-wide">
            {app.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full text-white overflow-hidden relative" onClick={onClose}>
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 filter blur-xl scale-110 opacity-60"
        style={{ backgroundImage: `url(${wallpaper})` }}
      />
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Search Bar */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 z-50" onClick={e => e.stopPropagation()}>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[13px] outline-none focus:border-white/30 focus:bg-black/40 transition-all placeholder:text-white/50 text-white shadow-lg backdrop-blur-md"
            autoFocus
          />
          <Search size={14} className="absolute left-3 top-2 text-white/50 group-focus-within:text-white transition-colors" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative pt-32 px-16 z-10" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {query ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto"
            >
              {renderGrid(filteredApps)}
            </motion.div>
          ) : activeFolder ? (
            <motion.div 
              key="folder"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xl"
              onClick={() => setActiveFolder(null)}
            >
              <div 
                className="w-full max-w-5xl p-16 bg-white/5 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-light mx-auto text-white/90">{activeFolder.name}</h2>
                </div>
                {renderGrid(activeFolder.children || [])}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`page-${currentPage}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full flex flex-col justify-between pb-16"
            >
              <div className="flex-1 flex items-start justify-center pt-8">
                {renderGrid(pages[currentPage] || [])}
              </div>
              
              {/* Pagination Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                      currentPage === i ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {!query && !activeFolder && pages.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(0, p - 1)); }}
            className={`absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors z-20 ${currentPage === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(pages.length - 1, p + 1)); }}
            className={`absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors z-20 ${currentPage === pages.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
};

