import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppID } from '../types';

export interface AppData {
  id: string;
  name: string;
  icon: string;
  url?: string; // For web apps
  type?: 'app' | 'link';
}

interface InstalledAppsState {
  installedApps: AppData[];
  installApp: (app: AppData) => void;
  uninstallApp: (id: string) => void;
  isInstalled: (id: string) => boolean;
}

const InstalledAppsContext = createContext<InstalledAppsState | undefined>(undefined);

const DEFAULT_APPS: AppData[] = [
  { id: 'calculator', name: 'Calculator', icon: 'https://img.icons8.com/fluency/96/calculator.png' },
  { id: 'safari', name: 'Safari', icon: 'https://img.icons8.com/fluency/96/safari.png' },
  { id: 'messages', name: 'Messages', icon: 'https://img.icons8.com/fluency/96/mac-os-messages.png' },
  { id: 'photos', name: 'Photos', icon: 'https://img.icons8.com/fluency/96/apple-photos.png' },
  { id: 'facetime', name: 'FaceTime', icon: 'https://img.icons8.com/fluency/96/facetime.png' },
  { id: 'phone', name: 'Phone', icon: 'https://img.icons8.com/fluency/96/phone.png' },
  { id: 'calendar', name: 'Calendar', icon: 'https://img.icons8.com/fluency/96/calendar.png' },
  { id: 'contacts', name: 'Contacts', icon: 'https://img.icons8.com/fluency/96/contacts.png' },
  { id: 'reminders', name: 'Reminders', icon: 'https://img.icons8.com/fluency/96/apple-reminders.png' },
  { id: 'notes', name: 'Notes', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/MacOS_Notes_icon.png/600px-MacOS_Notes_icon.png' },
  { id: 'tv', name: 'TV', icon: 'https://img.icons8.com/fluency/96/apple-tv.png' },
  { id: 'music', name: 'Music', icon: 'https://img.icons8.com/fluency/96/apple-music.png' },
  { id: 'keynote', name: 'Keynote', icon: 'https://img.icons8.com/fluency/96/keynote.png' },
  { id: 'numbers', name: 'Numbers', icon: 'https://img.icons8.com/fluency/96/numbers.png' },
  { id: 'pages', name: 'Pages', icon: 'https://img.icons8.com/fluency/96/pages.png' },
  { id: 'appstore', name: 'App Store', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/App_Store_%28macOS%29.svg/600px-App_Store_%28macOS%29.svg.png' },
  { id: 'settings', name: 'System Settings', icon: 'https://img.icons8.com/fluency/96/mac-os-settings.png' },
  { id: 'mail', name: 'Mail', icon: 'https://img.icons8.com/fluency/96/mac-os-mail.png' },
  { id: 'podcasts', name: 'Podcasts', icon: 'https://img.icons8.com/fluency/96/apple-podcasts.png' },
  { id: 'chrome', name: 'Google Chrome', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/600px-Google_Chrome_icon_%28February_2022%29.svg.png' },
  { id: 'books', name: 'Books', icon: 'https://img.icons8.com/fluency/96/apple-books.png' },
  { id: 'maps', name: 'Maps', icon: 'https://img.icons8.com/fluency/96/apple-map.png' },
  { id: 'findmy', name: 'Find My', icon: 'https://img.icons8.com/fluency/96/find-my.png' },
  { id: 'home', name: 'Home', icon: 'https://img.icons8.com/fluency/96/apple-home.png' },
  { id: 'stocks', name: 'Stocks', icon: 'https://img.icons8.com/fluency/96/stocks.png' },
  { id: 'weather', name: 'Weather', icon: 'https://img.icons8.com/fluency/96/apple-weather.png' },
  { id: 'clock', name: 'Clock', icon: 'https://img.icons8.com/fluency/96/clock.png' },
  { id: 'shortcuts', name: 'Shortcuts', icon: 'https://img.icons8.com/fluency/96/shortcuts.png' },
  { id: 'freeform', name: 'Freeform', icon: 'https://img.icons8.com/fluency/96/freeform.png' },
  { id: 'imovie', name: 'iMovie', icon: 'https://img.icons8.com/fluency/96/imovie.png' },
  { id: 'garageband', name: 'GarageBand', icon: 'https://img.icons8.com/fluency/96/garageband.png' },
  { id: 'missioncontrol', name: 'Mission Control', icon: 'https://img.icons8.com/color/96/mac-os-mission-control.png' },
  { id: 'apps', name: 'Launchpad', icon: 'https://img.icons8.com/fluency/96/rocket.png' },
  { id: 'terminal', name: 'Terminal', icon: 'https://img.icons8.com/fluency/96/console.png' },
  { id: 'wechat', name: 'WeChat', icon: 'https://img.icons8.com/fluency/96/wechat.png' },
];

export const InstalledAppsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [installedApps, setInstalledApps] = useState<AppData[]>(() => {
    const saved = localStorage.getItem('installedApps');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new default apps are added
      const missingDefaults = DEFAULT_APPS.filter(da => !parsed.some((pa: AppData) => pa.id === da.id));
      return [...parsed, ...missingDefaults];
    }
    return DEFAULT_APPS;
  });

  useEffect(() => {
    localStorage.setItem('installedApps', JSON.stringify(installedApps));
  }, [installedApps]);

  const installApp = React.useCallback((app: AppData) => {
    setInstalledApps(prev => {
      if (prev.some(a => a.id === app.id)) return prev;
      return [...prev, app];
    });
  }, []);

  const uninstallApp = React.useCallback((id: string) => {
    setInstalledApps(prev => prev.filter(a => a.id !== id));
  }, []);

  const isInstalled = React.useCallback((id: string) => {
    return installedApps.some(a => a.id === id);
  }, [installedApps]);

  return (
    <InstalledAppsContext.Provider value={{ installedApps, installApp, uninstallApp, isInstalled }}>
      {children}
    </InstalledAppsContext.Provider>
  );
};

export const useInstalledApps = () => {
  const context = useContext(InstalledAppsContext);
  if (context === undefined) {
    throw new Error('useInstalledApps must be used within a InstalledAppsProvider');
  }
  return context;
};
