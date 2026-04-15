import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Shield, Search, Plus, LayoutGrid, Share, Copy, Sidebar, X, EyeOff } from 'lucide-react';

interface Tab {
  id: string;
  url: string;
  title: string;
  isPrivate: boolean;
}

export const Safari: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: 'https://www.apple.com/macos/macos-sequoia/', title: 'macOS Sequoia', isPrivate: false }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [inputUrl, setInputUrl] = useState('apple.com/macos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    // Sync input URL with current URL for display purposes
    try {
      const urlObj = new URL(activeTab.url);
      setInputUrl(urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : ''));
    } catch {
      setInputUrl(activeTab.url);
    }
  }, [activeTab.url]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
      }
    }
    updateTabUrl(activeTabId, target);
  };

  const updateTabUrl = (id: string, newUrl: string) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, url: newUrl, title: newUrl } : t));
  };

  const navigateTo = (newUrl: string) => {
    updateTabUrl(activeTabId, newUrl);
  };

  const createNewTab = () => {
    const newTab: Tab = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://www.google.com/search?igu=1',
      title: 'New Tab',
      isPrivate: isPrivateMode
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      // Create a new tab if all are closed
      const newTab: Tab = {
        id: Math.random().toString(36).substr(2, 9),
        url: 'https://www.google.com/search?igu=1',
        title: 'New Tab',
        isPrivate: isPrivateMode
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    } else {
      setTabs(newTabs);
      if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
    }
  };

  const togglePrivateMode = () => {
    const newMode = !isPrivateMode;
    setIsPrivateMode(newMode);
    
    // Check if we have any tabs in the new mode
    const modeTabs = tabs.filter(t => t.isPrivate === newMode);
    if (modeTabs.length === 0) {
      // Create a new tab for this mode
      const newTab: Tab = {
        id: Math.random().toString(36).substr(2, 9),
        url: 'https://www.google.com/search?igu=1',
        title: 'New Tab',
        isPrivate: newMode
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    } else {
      // Switch to the last active tab in this mode
      setActiveTabId(modeTabs[modeTabs.length - 1].id);
    }
  };

  const visibleTabs = tabs.filter(t => t.isPrivate === isPrivateMode);

  return (
    <div className={`flex flex-col h-full text-white overflow-hidden rounded-b-xl transition-colors duration-300 ${isPrivateMode ? 'bg-[#121212]' : 'bg-[#1e1e1e]'}`}>
      
      {/* Tab Bar */}
      <div className={`h-11 flex items-center px-2 gap-1 pt-1 shrink-0 ${isPrivateMode ? 'bg-[#1a1a1a]' : 'bg-[#252525]'}`}>
        <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar items-center h-full">
          {visibleTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group relative flex items-center justify-between min-w-[140px] max-w-[220px] h-8 px-3 rounded-md cursor-pointer transition-all text-[12px] font-medium ${
                activeTabId === tab.id 
                  ? (isPrivateMode ? 'bg-[#3d3d3d] text-white shadow-lg' : 'bg-[#454545] text-white shadow-lg') 
                  : (isPrivateMode ? 'bg-transparent text-white/50 hover:bg-white/5' : 'bg-transparent text-white/50 hover:bg-white/5')
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {tab.isPrivate ? (
                  <EyeOff size={12} className="shrink-0 text-purple-400" />
                ) : (
                  <img src={`https://www.google.com/s2/favicons?domain=${tab.url}`} className="w-3.5 h-3.5 shrink-0 opacity-80" alt="" />
                )}
                <span className="truncate">{tab.title}</span>
              </div>
              <div 
                onClick={(e) => closeTab(e, tab.id)}
                className={`w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <X size={10} />
              </div>
            </div>
          ))}
          <div 
            onClick={createNewTab}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-white/70 hover:text-white shrink-0 ml-1"
          >
            <Plus size={18} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`h-[52px] border-b flex items-center pl-4 pr-4 gap-4 shrink-0 transition-all ${isPrivateMode ? 'bg-[#2d2d2d] border-black/40' : 'bg-[#2d2d2d]/90 backdrop-blur-xl border-black/20'}`}>
        <div className="flex items-center gap-4 text-white/50">
          <Sidebar 
            size={18} 
            strokeWidth={2} 
            className={`cursor-pointer transition-colors ${isSidebarOpen ? 'text-blue-400' : 'hover:text-white'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="flex gap-4">
            <ChevronLeft size={18} strokeWidth={2.5} className="cursor-pointer hover:text-white transition-colors" />
            <ChevronRight size={18} strokeWidth={2.5} className="cursor-pointer hover:text-white transition-colors opacity-50" />
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <form 
            onSubmit={handleSearch}
            className={`w-full border rounded-lg flex items-center px-3 py-1.5 gap-2 shadow-inner focus-within:ring-2 focus-within:ring-blue-500/50 transition-all group ${
              isPrivateMode 
                ? 'bg-black/40 border-white/5 focus-within:bg-black/60' 
                : 'bg-black/20 border-white/10 focus-within:bg-black/30'
            }`}
          >
            {isPrivateMode ? (
              <EyeOff size={12} className="text-purple-400/70 group-focus-within:text-purple-400 transition-colors" />
            ) : (
              <Shield size={12} className="text-white/30 group-focus-within:text-white/50 transition-colors" />
            )}
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className={`flex-1 text-[13px] outline-none bg-transparent text-center font-medium placeholder:text-white/30 selection:bg-blue-500/50 ${isPrivateMode ? 'text-purple-100' : 'text-white/90'}`}
              placeholder={isPrivateMode ? "Search or enter website name (Private)" : "Search or enter website name"}
            />
            <RotateCw size={12} className="text-white/30 cursor-pointer hover:text-white transition-colors" />
          </form>
        </div>
        
        <div className="flex gap-5 text-white/50 mr-2 items-center">
          <div 
            onClick={togglePrivateMode}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs font-medium border ${
              isPrivateMode 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <EyeOff size={14} />
            <span>Private</span>
          </div>
          <Share size={16} strokeWidth={2} className="cursor-pointer hover:text-white transition-colors" />
          <Copy size={16} strokeWidth={2} className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className={`h-8 border-b flex items-center justify-center gap-6 text-[12px] font-medium shrink-0 ${
        isPrivateMode ? 'bg-[#2d2d2d] border-black/40 text-white/40' : 'bg-[#2d2d2d]/90 backdrop-blur-xl border-black/20 text-white/60'
      }`}>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={() => navigateTo('https://www.apple.com/macos/macos-sequoia/')}>
          <img src="https://www.apple.com/favicon.ico" className="w-3.5 h-3.5 opacity-80 invert" alt="" />
          <span>macOS</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={() => navigateTo('https://www.apple.com')}>
          <img src="https://www.apple.com/favicon.ico" className="w-3.5 h-3.5 opacity-80 invert" alt="" />
          <span>Apple</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={() => navigateTo('https://www.google.com/search?igu=1')}>
          <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5 opacity-80" alt="" />
          <span>Google</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={() => navigateTo('https://github.com')}>
          <img src="https://github.com/favicon.ico" className="w-3.5 h-3.5 opacity-80 invert" alt="" />
          <span>GitHub</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className={`w-64 border-r flex flex-col pt-4 shrink-0 shadow-2xl z-10 ${
            isPrivateMode ? 'bg-[#252525] border-black/40' : 'bg-[#2d2d2d]/95 backdrop-blur-xl border-black/20'
          }`}>
            <div className="px-4 mb-4">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Favorites</h3>
              <div className="space-y-1">
                {[
                  { name: 'macOS', url: 'https://www.apple.com/macos/macos-sequoia/' },
                  { name: 'Apple', url: 'https://www.apple.com' },
                  { name: 'Google', url: 'https://www.google.com/search?igu=1' },
                  { name: 'GitHub', url: 'https://github.com' }
                ].map(item => (
                  <div 
                    key={item.name} 
                    onClick={() => navigateTo(item.url)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-medium text-white/80 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <img src={`https://www.${item.name === 'macOS' ? 'apple' : item.name.toLowerCase()}.com/favicon.ico`} className="w-4 h-4 opacity-80" alt="" onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/safari.png'; }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            
            {isPrivateMode && (
              <div className="px-4 mt-auto mb-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-xs text-purple-200/70">
                  <div className="flex items-center gap-2 mb-1 text-purple-300 font-medium">
                    <EyeOff size={14} />
                    Private Browsing
                  </div>
                  Safari won't remember the pages you visit, your search history, or your AutoFill information.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browser Content */}
        <div className={`flex-1 relative ${isPrivateMode ? 'bg-[#121212]' : 'bg-white'}`}>
          {isPrivateMode && activeTab.url === 'https://www.google.com/search?igu=1' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#121212] text-white">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
                <EyeOff size={40} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Private Browsing Enabled</h2>
              <p className="text-white/50 max-w-md text-sm">
                Safari won't remember the pages you visit, your search history, or your AutoFill information after you close this tab.
              </p>
            </div>
          ) : (
            <iframe
              key={activeTab.id}
              src={activeTab.url}
              className={`absolute inset-0 w-full h-full border-none ${isPrivateMode ? 'bg-[#121212] opacity-90' : 'bg-white'}`}
              title="Safari Browser"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
};
