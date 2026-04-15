import React, { useState, useEffect } from 'react';
import { Search, Download, Star, ChevronRight, Loader2, Check, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInstalledApps } from '../../context/InstalledAppsContext';
import { AppID } from '../../types';

interface AppData {
  trackId: number;
  trackName: string;
  primaryGenreName: string;
  formattedPrice: string;
  averageUserRating: number;
  artworkUrl512: string;
  description: string;
  bundleId?: string;
}

export const AppStore: React.FC = () => {
  const { isInstalled, installApp } = useInstalledApps();
  const [selectedTab, setSelectedTab] = useState('Discover');
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('mac');
  const [installing, setInstalling] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmingApp, setConfirmingApp] = useState<AppData | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${searchQuery || 'mac'}&entity=macSoftware&limit=20`);
        const data = await response.json();
        setApps(data.results);
      } catch (error) {
        console.error("Failed to fetch apps", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchApps();
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Apps' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Games', label: 'Games' },
    { id: 'Utilities', label: 'Utilities' },
    { id: 'Social Networking', label: 'Social' },
    { id: 'Education', label: 'Education' },
    { id: 'Photo & Video', label: 'Photo & Video' },
  ];

  const filteredApps = apps.filter(app => 
    selectedCategory === 'All' || app.primaryGenreName === selectedCategory
  );

  const handleInstallClick = (app: AppData) => {
    if (isInstalled(app.trackId.toString())) return;
    setConfirmingApp(app);
  };

  const confirmInstall = () => {
    if (!confirmingApp) return;
    
    const app = confirmingApp;
    setConfirmingApp(null);
    setInstalling(app.trackId);
    
    // Simulate download delay
    setTimeout(() => {
      installApp({
        id: app.trackId.toString(),
        name: app.trackName,
        icon: app.artworkUrl512,
        type: 'app'
      });
      setInstalling(null);
    }, 2000);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e]/95 text-white overflow-hidden rounded-b-xl backdrop-blur-2xl">
      {/* Sidebar */}
      <motion.div 
        initial={{ width: 224, opacity: 1 }}
        animate={{ 
          width: isSidebarOpen ? 224 : 0, 
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/5 border-r border-black/20 flex flex-col gap-1 shrink-0 overflow-hidden whitespace-nowrap h-full"
      >
        <div className="p-4 pt-8 flex flex-col gap-1 h-full w-56">
          <div className="px-3 mb-4 text-xs font-bold text-white/40 uppercase tracking-wider">Discover</div>
          {['Discover', 'Arcade', 'Create', 'Work', 'Play', 'Develop'].map(tab => (
            <div 
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-default ${
                selectedTab === tab ? 'bg-blue-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10'
              }`}
            >
              {tab}
            </div>
          ))}
          
          <div className="px-3 mt-6 mb-2 text-xs font-bold text-white/40 uppercase tracking-wider">Categories</div>
          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-default ${
                selectedCategory === cat.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-default transition-all group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold shadow-lg group-hover:scale-105 transition-transform">JD</div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold">John Doe</span>
                <span className="text-[10px] text-white/40">Apple ID</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] relative min-w-0">
        <div className="h-[52px] border-b border-white/5 flex items-center px-8 justify-between shrink-0 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
            >
              <PanelLeft size={18} className={isSidebarOpen ? "text-blue-500" : ""} />
            </button>
            <h2 className="text-[18px] font-bold text-white tracking-tight">{selectedTab}</h2>
            {selectedCategory !== 'All' && (
              <span className="text-[13px] text-white/40 font-medium px-2 py-0.5 bg-white/5 rounded-md">
                {selectedCategory}
              </span>
            )}
          </div>
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-2 text-white/40 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-[13px] outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all w-64 placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className="text-sm text-white/40 font-medium">Loading Store...</span>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
            >
              {filteredApps.map(app => {
                const installed = isInstalled(app.trackId.toString());
                const isInstalling = installing === app.trackId;

                return (
                  <motion.div 
                    key={app.trackId}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/5 rounded-2xl p-4 flex flex-col gap-4 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-2xl transition-all cursor-default group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-[14px] bg-gray-800 shadow-lg overflow-hidden shrink-0 group-hover:shadow-2xl transition-shadow">
                        <img src={app.artworkUrl512} alt={app.trackName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="font-bold text-[14px] truncate leading-tight mb-1">{app.trackName}</h4>
                        <p className="text-[11px] text-white/40 truncate font-medium">{app.primaryGenreName}</p>
                        <div className="flex items-center gap-0.5 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < Math.floor(app.averageUserRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                          ))}
                          <span className="text-[10px] text-white/20 ml-1 font-medium">({app.averageUserRating?.toFixed(1) || '0.0'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-white/40 font-medium">
                        {app.formattedPrice === 'Free' ? 'Get' : app.formattedPrice}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstallClick(app);
                        }}
                        disabled={installed || isInstalling}
                        className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 min-w-[70px] flex items-center justify-center shadow-lg ${
                          installed 
                            ? 'bg-white/10 text-white/40 cursor-default' 
                            : 'bg-white/10 hover:bg-blue-500 text-blue-400 hover:text-white hover:shadow-blue-500/25'
                        }`}
                      >
                        {isInstalling ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : installed ? (
                          'OPEN'
                        ) : (
                          'GET'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmingApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setConfirmingApp(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-80 shadow-2xl flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={confirmingApp.artworkUrl512} 
                  alt={confirmingApp.trackName} 
                  className="w-20 h-20 rounded-[18px] mb-4 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-lg font-bold mb-1">{confirmingApp.trackName}</h3>
                <p className="text-sm text-white/60 mb-6">
                  Do you want to install "{confirmingApp.trackName}"?
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setConfirmingApp(null)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmInstall}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Install
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
