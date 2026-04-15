import { useState, useCallback } from 'react';
import { AppID, WindowState } from '../types';

const INITIAL_WINDOWS: Record<AppID, WindowState> = {
  finder: { id: 'finder', title: 'Finder', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 100, y: 100, width: 800, height: 500 },
  safari: { id: 'safari', title: 'Safari', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 150, y: 150, width: 1000, height: 700 },
  chrome: { id: 'chrome', title: 'Google Chrome', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 150, y: 150, width: 1000, height: 700 },
  settings: { id: 'settings', title: 'System Settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 200, y: 200, width: 800, height: 600 },
  terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 250, y: 250, width: 600, height: 400 },
  notes: { id: 'notes', title: 'Notes', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10, x: 300, y: 300, width: 800, height: 600 },
  calculator: { id: 'calculator', title: 'Calculator', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 350, y: 350, width: 232, height: 320 },
  photos: { id: 'photos', title: 'Photos', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 400, y: 400, width: 800, height: 600 },
  appstore: { id: 'appstore', title: 'App Store', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 450, y: 450, width: 900, height: 650 },
  wechat: { id: 'wechat', title: 'WeChat', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 500, y: 100, width: 850, height: 600 },
  mail: { id: 'mail', title: 'Mail', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 120, y: 120, width: 900, height: 600 },
  calendar: { id: 'calendar', title: 'Calendar', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 140, y: 140, width: 800, height: 600 },
  messages: { id: 'messages', title: 'Messages', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 160, y: 160, width: 800, height: 600 },
  facetime: { id: 'facetime', title: 'FaceTime', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 180, y: 180, width: 800, height: 600 },
  music: { id: 'music', title: 'Music', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 200, y: 200, width: 900, height: 650 },
  podcasts: { id: 'podcasts', title: 'Podcasts', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 220, y: 220, width: 900, height: 650 },
  tv: { id: 'tv', title: 'TV', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 240, y: 240, width: 900, height: 650 },
  books: { id: 'books', title: 'Books', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 260, y: 260, width: 800, height: 600 },
  reminders: { id: 'reminders', title: 'Reminders', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 280, y: 280, width: 500, height: 600 },
  maps: { id: 'maps', title: 'Maps', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 300, y: 300, width: 1000, height: 700 },
  findmy: { id: 'findmy', title: 'Find My', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 320, y: 320, width: 800, height: 600 },
  home: { id: 'home', title: 'Home', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 340, y: 340, width: 800, height: 600 },
  stocks: { id: 'stocks', title: 'Stocks', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 360, y: 360, width: 800, height: 600 },
  weather: { id: 'weather', title: 'Weather', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 380, y: 380, width: 800, height: 600 },
  clock: { id: 'clock', title: 'Clock', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 400, y: 400, width: 800, height: 600 },
  shortcuts: { id: 'shortcuts', title: 'Shortcuts', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 420, y: 420, width: 800, height: 600 },
  freeform: { id: 'freeform', title: 'Freeform', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 440, y: 440, width: 1000, height: 700 },
  imovie: { id: 'imovie', title: 'iMovie', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 460, y: 460, width: 1000, height: 700 },
  garageband: { id: 'garageband', title: 'GarageBand', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 480, y: 480, width: 1000, height: 700 },
  keynote: { id: 'keynote', title: 'Keynote', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 500, y: 500, width: 1000, height: 700 },
  numbers: { id: 'numbers', title: 'Numbers', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 520, y: 520, width: 1000, height: 700 },
  pages: { id: 'pages', title: 'Pages', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 540, y: 540, width: 1000, height: 700 },
  apps: { id: 'apps', title: 'Applications', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 100, y: 100, width: 900, height: 650 },
  textedit: { id: 'textedit', title: 'TextEdit', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 120, y: 120, width: 600, height: 500 },
  preview: { id: 'preview', title: 'Preview', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 140, y: 140, width: 800, height: 600 },
  quicktime: { id: 'quicktime', title: 'QuickTime Player', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 160, y: 160, width: 800, height: 500 },
};

export function useWindowManagement() {
  const [windows, setWindows] = useState<Record<AppID, WindowState>>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<AppID>('notes');
  const [maxZIndex, setMaxZIndex] = useState(10);

  const focusWindow = useCallback((id: AppID) => {
    setMaxZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: maxZIndex + 1, isMinimized: false, isOpen: true }
    }));
    setActiveApp(id);
  }, [maxZIndex]);

  const openApp = useCallback((id: AppID, props?: any) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, props: props || prev[id].props }
    }));
    focusWindow(id);
  }, [focusWindow]);

  const closeApp = useCallback((id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  }, []);

  const minimizeApp = useCallback((id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  }, []);

  const minimizeAllApps = useCallback(() => {
    setWindows(prev => {
      const newWindows = { ...prev };
      Object.keys(newWindows).forEach(id => {
        newWindows[id as AppID] = { ...newWindows[id as AppID], isMinimized: true };
      });
      return newWindows;
    });
  }, []);

  const toggleMaximize = useCallback((id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized }
    }));
  }, []);

  const toggleShade = useCallback((id: AppID) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isShaded: !prev[id].isShaded }
    }));
  }, []);

  const updateWindowPosition = useCallback((id: AppID, x: number, y: number) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], x, y }
    }));
  }, []);

  const updateWindowSize = useCallback((id: AppID, width: number, height: number) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], width, height }
    }));
  }, []);

  const updateWindowGeometry = useCallback((id: AppID, x: number, y: number, width: number, height: number) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], x, y, width, height }
    }));
  }, []);

  return {
    windows,
    activeApp,
    focusWindow,
    openApp,
    closeApp,
    minimizeApp,
    minimizeAllApps,
    toggleMaximize,
    toggleShade,
    updateWindowPosition,
    updateWindowSize,
    updateWindowGeometry,
  };
}
