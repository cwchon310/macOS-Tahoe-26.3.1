import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { ContextMenu } from './components/ContextMenu';
import { useWindowManagement } from './hooks/useWindowManagement';
import { Safari } from './components/apps/Safari';
import { Finder } from './components/apps/Finder';
import { Terminal } from './components/apps/Terminal';
import { Calculator } from './components/apps/Calculator';
import { Settings } from './components/apps/Settings';
import { Notes } from './components/apps/Notes';
import { TextEdit } from './components/apps/TextEdit';
import { Phone } from './components/apps/Phone';
import { Mail } from './components/apps/Mail';
import { Widgets } from './components/Widgets';
import { Siri } from './components/Siri';
import { ControlCenter } from './components/ControlCenter';
import { Spotlight } from './components/Spotlight';
import { Apps, ALL_APPS } from './components/apps/Apps';
import { AppStore } from './components/apps/AppStore';
import { WeChat } from './components/apps/WeChat';
import { AboutThisMac } from './components/apps/AboutThisMac';
import { DockPositionProvider } from './context/DockPositionContext';
import { SystemProvider, useSystem } from './context/SystemContext';
import { InstalledAppsProvider, useInstalledApps } from './context/InstalledAppsContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { NotificationCenter } from './components/NotificationCenter';
import { AppID, WindowState } from './types';
import { BootSequence } from './components/BootSequence';
import { LoginScreen } from './components/LoginScreen';
import { FileIcon } from './components/FileIcon';

const Desktop = () => {
  const { wallpaper, isDarkMode } = useSystem();
  const { installedApps } = useInstalledApps();

  React.useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isDarkMode]);
  const [bootState, setBootState] = useState<'booting' | 'login' | 'desktop'>('booting');
  const [isSiriOpen, setIsSiriOpen] = React.useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = React.useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = React.useState(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);
  const [isAboutShaded, setIsAboutShaded] = React.useState(false);
  const [aboutPos, setAboutPos] = React.useState({ x: 100, y: 100 });
  const [isMissionControlActive, setIsMissionControlActive] = React.useState(false);

  const [desktopItems, setDesktopItems] = React.useState<any[]>([
    {
      id: 'config-plist',
      name: 'config.plist',
      type: 'file',
      fileType: 'plist',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ACPI</key>
    <dict>
        <key>Add</key>
        <array/>
        <key>Quirks</key>
        <dict>
            <key>ResetLogoStatus</key>
            <true/>
        </dict>
    </dict>
</dict>
</plist>`,
      x: 20,
      y: 20
    },
    {
      id: 'readme',
      name: 'README.md',
      type: 'file',
      fileType: 'md',
      content: '# macOS Tahoe\nWelcome to the future of macOS.',
      x: 20,
      y: 100
    }
  ]);

  const [selectedDesktopItem, setSelectedDesktopItem] = React.useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number; targetId: string | null }>({
    isOpen: false,
    x: 0,
    y: 0,
    targetId: null
  });

  const { addNotification } = useNotifications();

  React.useEffect(() => {
    // Add some initial notifications for demo
    setTimeout(() => {
      addNotification({
        title: "Welcome to macOS",
        message: "Explore the new features of your Mac, including the new Notification Center!",
        appName: "System",
      });
    }, 2000);

    setTimeout(() => {
      addNotification({
        title: "Software Update",
        message: "macOS Tahoe Beta 2 is now available for your Mac.",
        appName: "App Store",
        appIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/App_Store_%28macOS%29.svg/600px-App_Store_%28macOS%29.svg.png",
      });
    }, 5000);
  }, [addNotification]);

  const deleteDesktopItem = (id: string) => {
    setDesktopItems(prev => prev.filter(item => item.id !== id));
  };

  const createNewFolder = () => {
    let folderName = 'untitled folder';
    let counter = 2;
    while (desktopItems.some(item => item.name === folderName)) {
      folderName = `untitled folder ${counter}`;
      counter++;
    }

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: folderName,
      icon: 'https://img.icons8.com/fluency/96/mac-folder.png',
      type: 'folder',
      target: '',
      x: window.innerWidth - contextMenu.x,
      y: contextMenu.y
    };
    setDesktopItems(prev => [...prev, newItem]);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, targetId: id });
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, targetId: 'desktop' });
    }
  };

  const {
    windows,
    activeApp,
    focusWindow,
    openApp,
    closeApp,
    minimizeApp,
    minimizeAllApps,
    toggleMaximize,
    toggleShade,
    updateWindowSize,
    updateWindowGeometry,
  } = useWindowManagement();

  const handleOpenApp = React.useCallback((id: AppID) => {
    if (id === 'missioncontrol') {
      setIsMissionControlActive(prev => !prev);
      return;
    }
    openApp(id);
  }, [openApp]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setIsSiriOpen(prev => !prev);
      }
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
      if (e.metaKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        handleOpenApp('apps');
      }
      if (e.metaKey && e.code === 'KeyM') {
        e.preventDefault();
        if (e.altKey) {
          minimizeAllApps();
        } else if (activeApp) {
          minimizeApp(activeApp);
        }
      }
      if ((e.ctrlKey && e.key === 'ArrowUp') || e.key === 'F3') {
        e.preventDefault();
        setIsMissionControlActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDesktopItem, isSpotlightOpen, handleOpenApp, activeApp, minimizeApp, minimizeAllApps]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Handle App Shortcut
    const appData = e.dataTransfer.getData('app');
    if (appData) {
      const app = JSON.parse(appData);
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: app.name,
        icon: app.icon,
        type: 'app',
        target: app.id,
        x: window.innerWidth - e.clientX,
        y: e.clientY
      };
      setDesktopItems(prev => [...prev, newItem]);
      return;
    }

    // Handle File Drop
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      const newItems = files.map((file, index) => {
        let icon = 'https://img.icons8.com/fluency/96/document.png';
        if (file.type.startsWith('image/')) {
          icon = URL.createObjectURL(file);
        }
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          icon: icon,
          type: 'file',
          target: '',
          x: window.innerWidth - e.clientX + (index * 20),
          y: e.clientY + (index * 20)
        };
      });
      setDesktopItems(prev => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderAppContent = React.useCallback((id: AppID, props?: any) => {
    switch (id) {
      case 'safari': return <Safari />;
      case 'phone': return <Phone />;
      case 'mail': return <Mail />;
      case 'chrome': return <Safari />; // Use Safari component for Chrome
      case 'finder': return <Finder onOpenApp={handleOpenApp} />;
      case 'terminal': return <Terminal />;
      case 'calculator': return <Calculator />;
      case 'settings': return <Settings />;
      case 'notes': return <Notes />;
      case 'messages': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">Messages coming soon...</div>;
      case 'maps': return <div className="flex-1 bg-white relative"><iframe src="https://www.google.com/maps/embed" className="absolute inset-0 w-full h-full border-none" /></div>;
      case 'photos': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">Photos coming soon...</div>;
      case 'facetime': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">FaceTime coming soon...</div>;
      case 'calendar': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">Calendar coming soon...</div>;
      case 'music': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">Music coming soon...</div>;
      case 'tv': return <div className="flex-1 liquid-glass flex items-center justify-center text-white/40">TV coming soon...</div>;
      case 'textedit': return <TextEdit initialContent={props?.content} fileName={props?.name} />;
      case 'appstore': return <AppStore />;
      case 'wechat': return <WeChat />;
      case 'apps': return <Apps onOpenApp={handleOpenApp} />;
      case 'trash': return <Finder initialPath="/Trash" />;
      default: {
        const appInfo = installedApps.find(a => a.id === id) || ALL_APPS.find(a => a.id === id);
        if (appInfo?.url) {
          return (
            <div className="flex-1 bg-white relative">
              <iframe
                src={appInfo.url}
                className="absolute inset-0 w-full h-full border-none bg-white"
                title={appInfo.name}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40 text-sm">
            {appInfo?.icon && <img src={appInfo.icon} className="w-24 h-24 drop-shadow-2xl" alt={id} referrerPolicy="no-referrer" />}
            <span>{appInfo?.name || (id ? id.charAt(0).toUpperCase() + id.slice(1) : 'App')} is coming soon...</span>
          </div>
        );
      }
    }
  }, [handleOpenApp, installedApps]);

  const openAppIds = React.useMemo(() => 
    (Object.values(windows) as WindowState[])
      .filter(w => w.isOpen)
      .map(w => w.id),
    [windows]
  );

  const missionControlLayout = React.useMemo(() => {
    const layout: Record<string, { x: number, y: number, scale: number }> = {};
    if (!isMissionControlActive) return layout;

    const openWindows = (Object.values(windows) as WindowState[]).filter(w => w.isOpen && !w.isMinimized && w.id !== 'apps');
    if (isAboutOpen) {
      openWindows.push({
        id: 'about',
        title: 'About This Mac',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        isShaded: isAboutShaded,
        zIndex: 10000,
        x: aboutPos.x,
        y: aboutPos.y,
        width: 400,
        height: 350
      } as WindowState);
    }

    const padding = 40;
    const screenW = window.innerWidth - padding * 2;
    const screenH = window.innerHeight - 100 - padding * 2; // Leave space for dock
    const N = openWindows.length;
    if (N === 0) return layout;

    const cols = Math.ceil(Math.sqrt(N));
    const rows = Math.ceil(N / cols);
    const cellW = screenW / cols;
    const cellH = screenH / rows;

    openWindows.forEach((w, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cellX = padding + col * cellW;
      const cellY = padding + row * cellH;
      
      const actualWidth = w.isMaximized ? window.innerWidth : w.width;
      const actualHeight = w.isShaded ? 52 : (w.isMaximized ? window.innerHeight - 112 : w.height);
      const actualX = w.isMaximized ? 0 : w.x;
      const actualY = w.isMaximized ? 28 : w.y;

      const scale = Math.min((cellW - 20) / actualWidth, (cellH - 20) / actualHeight, 0.8);
      const targetX = cellX + (cellW - actualWidth * scale) / 2;
      const targetY = cellY + (cellH - actualHeight * scale) / 2;
      
      layout[w.id] = {
        x: targetX - actualX + (actualWidth * (scale - 1)) / 2,
        y: targetY - actualY + (actualHeight * (scale - 1)) / 2,
        scale
      };
    });

    return layout;
  }, [windows, isMissionControlActive, isAboutOpen, isAboutShaded, aboutPos]);

  const renderedWindows = React.useMemo(() => {
    const openWindows = (Object.values(windows) as WindowState[]).filter(w => w.isOpen && w.id !== 'apps');

    return openWindows.map((window) => {
      return (
        <Window
          key={window.id}
          windowState={window}
          isActive={activeApp === window.id}
          isMissionControl={isMissionControlActive}
          missionControlTransform={missionControlLayout[window.id]}
          onFocus={() => {
            if (isMissionControlActive) setIsMissionControlActive(false);
            focusWindow(window.id);
          }}
          onClose={() => closeApp(window.id)}
          onMinimize={() => minimizeApp(window.id)}
          onMaximize={() => toggleMaximize(window.id)}
          onShade={() => toggleShade(window.id)}
          onGeometryChange={(x, y, width, height) => updateWindowGeometry(window.id, x, y, width, height)}
        >
          {renderAppContent(window.id, window.props)}
        </Window>
      );
    });
  }, [windows, activeApp, focusWindow, closeApp, minimizeApp, toggleMaximize, toggleShade, updateWindowGeometry, renderAppContent, isMissionControlActive, missionControlLayout]);

  if (bootState === 'booting') {
    return <BootSequence onComplete={() => setBootState('login')} />;
  }

  if (bootState === 'login') {
    return (
      <LoginScreen 
        onLogin={() => setBootState('desktop')} 
        onRestart={() => setBootState('booting')}
        onSleep={() => setBootState('login')}
        onShutDown={() => setBootState('booting')} // Should ideally be a black screen, but booting is fine for now
        wallpaper={wallpaper} 
      />
    );
  }

  return (
    <DockPositionProvider>
      <div 
        className="h-screen w-screen overflow-hidden relative bg-cover bg-center transition-all duration-1000" 
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          backgroundColor: '#000'
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        {/* Liquid Glass Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 opacity-30" />
          <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(255,255,255,0.1)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0.02),transparent,rgba(255,255,255,0.02))]" />
        </div>

        <MenuBar 
          activeApp={activeApp} 
          onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)} 
          isControlCenterOpen={isControlCenterOpen}
          onToggleSiri={() => setIsSiriOpen(!isSiriOpen)}
          isSiriOpen={isSiriOpen}
          onOpenAbout={() => setIsAboutOpen(true)}
          onSleep={() => setBootState('login')}
          onRestart={() => setBootState('booting')}
          onShutDown={() => setBootState('booting')}
          onLogOut={() => setBootState('login')}
        />

        {/* Mission Control Overlay */}
        <AnimatePresence>
          {isMissionControlActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9998]"
              onClick={() => setIsMissionControlActive(false)}
            />
          )}
        </AnimatePresence>
        
        <main 
          className="absolute inset-0 pt-7 pb-20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            setSelectedDesktopItem(null);
            if (isMissionControlActive) setIsMissionControlActive(false);
          }}
          onContextMenu={handleDesktopContextMenu}
        >
          <Widgets />
          {isAboutOpen && (
            <Window
              windowState={{ id: 'about', title: 'About This Mac', isOpen: true, isMinimized: false, isMaximized: false, isShaded: isAboutShaded, zIndex: 10000, x: aboutPos.x, y: aboutPos.y, width: 400, height: 350 }}
              isActive={true}
              isMissionControl={isMissionControlActive}
              missionControlTransform={missionControlLayout['about']}
              onFocus={() => {
                if (isMissionControlActive) setIsMissionControlActive(false);
              }}
              onClose={() => setIsAboutOpen(false)}
              onMinimize={() => {}}
              onMaximize={() => {}}
              onShade={() => setIsAboutShaded(prev => !prev)}
              onGeometryChange={(x, y) => setAboutPos({ x, y })}
            >
              <AboutThisMac />
            </Window>
          )}
          {/* Desktop Icons */}
          <div className="absolute inset-0 p-4 pointer-events-none">
            {desktopItems.map((item, i) => (
              <motion.div
                key={item.id}
                drag
                dragMomentum={false}
                className="absolute flex flex-col items-center gap-1 group cursor-default pointer-events-auto"
                style={{ top: item.y || 20 + (i * 100), right: item.x || 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDesktopItem(item.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (item.type === 'app') {
                    handleOpenApp(item.target as AppID);
                  } else if (item.content || item.fileType === 'plist' || item.fileType === 'script') {
                    handleOpenApp('textedit', { content: item.content, name: item.name });
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
              >
                <div className={`p-1 rounded-lg transition-colors ${selectedDesktopItem === item.id ? 'bg-black/20' : ''}`}>
                  {item.type === 'app' || (item.type === 'file' && item.icon?.startsWith('blob:')) ? (
                    <img 
                      src={item.icon} 
                      className={`w-16 h-16 drop-shadow-2xl transition-transform object-cover rounded-lg ${selectedDesktopItem === item.id ? 'brightness-75' : ''}`} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FileIcon name={item.name} className="w-16 h-20 shadow-lg" />
                  )}
                </div>
                <span className={`text-[12px] font-semibold text-white drop-shadow-lg px-2 py-0.5 rounded transition-colors text-center max-w-[80px] break-words line-clamp-2 ${selectedDesktopItem === item.id ? 'bg-blue-600/90' : 'group-hover:bg-blue-600/80'}`}>
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>

          {contextMenu.isOpen && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
              items={contextMenu.targetId === 'desktop' ? [
                { label: 'New Folder', onClick: createNewFolder },
                { label: '', divider: true },
                { label: 'Get Info', onClick: () => {} },
                { label: 'Change Wallpaper...', onClick: () => handleOpenApp('settings') },
                { label: '', divider: true },
                { label: 'Use Stacks', onClick: () => {} },
                { label: 'Sort By', onClick: () => {} },
                { label: 'Show View Options', onClick: () => {} },
              ] : [
                { label: 'Open', onClick: () => {
                  const item = desktopItems.find(i => i.id === contextMenu.targetId);
                  if (item?.type === 'app') {
                    handleOpenApp(item.target as AppID);
                  } else if (item?.content || item?.fileType === 'plist' || item?.fileType === 'script') {
                    handleOpenApp('textedit', { content: item.content, name: item.name });
                  }
                }},
                { label: 'Delete', onClick: () => contextMenu.targetId && deleteDesktopItem(contextMenu.targetId), danger: true }
              ]}
            />
          )}
          
          {/* Windows */}
          <AnimatePresence>
            {renderedWindows}
          </AnimatePresence>

          {/* Launchpad (Apps) Overlay */}
          <AnimatePresence>
            {windows['apps']?.isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-3xl"
              >
                <Apps onOpenApp={(id) => { handleOpenApp(id); closeApp('apps'); }} onClose={() => closeApp('apps')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Control UI */}
          <AnimatePresence>
            {isMissionControlActive && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-0 left-0 right-0 h-40 z-[10000] flex flex-col items-center pt-8 pointer-events-none"
              >
                <div className="flex gap-4 pointer-events-auto">
                  {[1, 2].map((i) => (
                    <div 
                      key={i}
                      className={`w-48 h-28 rounded-xl border-2 transition-all cursor-pointer overflow-hidden shadow-2xl ${
                        i === 1 ? 'border-white/60 scale-105' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={wallpaper} className="w-full h-full object-cover" alt={`Desktop ${i}`} />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Desktop {i}</span>
                      </div>
                    </div>
                  ))}
                  <div className="w-48 h-28 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer">
                    <span className="text-white/40 text-2xl">+</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Widgets />
          <Siri isOpen={isSiriOpen} onClose={() => setIsSiriOpen(false)} />
          <ControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
          <Spotlight isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} onOpenApp={handleOpenApp} />
          <NotificationCenter />
        </main>

        <Dock 
          onOpenApp={handleOpenApp} 
          activeApp={activeApp}
          openApps={openAppIds}
          windows={windows}
          renderAppContent={renderAppContent}
        />
      </div>
    </DockPositionProvider>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <InstalledAppsProvider>
        <NotificationProvider>
          <Desktop />
        </NotificationProvider>
      </InstalledAppsProvider>
    </SystemProvider>
  );
}
