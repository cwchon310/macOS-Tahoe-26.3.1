import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WallpaperConfig {
  type: 'static' | 'dynamic' | 'timeOfDay';
  url?: string;
  lightUrl?: string;
  darkUrl?: string;
  morningUrl?: string;
  afternoonUrl?: string;
  eveningUrl?: string;
  nightUrl?: string;
}

interface SystemState {
  wallpaper: string; // The computed current wallpaper URL
  wallpaperConfig: WallpaperConfig;
  setWallpaperConfig: (config: WallpaperConfig) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  brightness: number;
  setBrightness: (level: number) => void;
  volume: number;
  setVolume: (level: number) => void;
  isWifiOn: boolean;
  toggleWifi: () => void;
  isBluetoothOn: boolean;
  toggleBluetooth: () => void;
  currentTime: Date;
  minimizeEffect: 'genie' | 'scale';
  setMinimizeEffect: (effect: 'genie' | 'scale') => void;
}

const SystemContext = createContext<SystemState | undefined>(undefined);

const DEFAULT_WALLPAPER: WallpaperConfig = {
  type: 'static',
  url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2560&q=80', // Surfer at sunset
};

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperConfig>(() => {
    const saved = localStorage.getItem('wallpaperConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_WALLPAPER;
      }
    }
    // Fallback for old string-based wallpaper
    const oldWallpaper = localStorage.getItem('wallpaper');
    if (oldWallpaper && oldWallpaper.startsWith('http')) {
      return { type: 'static', url: oldWallpaper };
    }
    return DEFAULT_WALLPAPER;
  });

  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for this theme
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [minimizeEffect, setMinimizeEffect] = useState<'genie' | 'scale'>(() => {
    return (localStorage.getItem('minimizeEffect') as 'genie' | 'scale') || 'genie';
  });

  useEffect(() => {
    localStorage.setItem('wallpaperConfig', JSON.stringify(wallpaperConfig));
  }, [wallpaperConfig]);

  useEffect(() => {
    localStorage.setItem('minimizeEffect', minimizeEffect);
  }, [minimizeEffect]);

  const [currentTime, setCurrentTime] = useState(new Date("2026-03-08T00:47:02-08:00"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleWifi = () => setIsWifiOn(prev => !prev);
  const toggleBluetooth = () => setIsBluetoothOn(prev => !prev);

  let currentWallpaper = '';
  if (wallpaperConfig.type === 'dynamic') {
    currentWallpaper = isDarkMode ? (wallpaperConfig.darkUrl || '') : (wallpaperConfig.lightUrl || '');
  } else if (wallpaperConfig.type === 'timeOfDay') {
    // The time is provided in -08:00 timezone
    const hour = (currentTime.getUTCHours() - 8 + 24) % 24;
    if (hour >= 6 && hour < 12) {
      currentWallpaper = wallpaperConfig.morningUrl || '';
    } else if (hour >= 12 && hour < 17) {
      currentWallpaper = wallpaperConfig.afternoonUrl || '';
    } else if (hour >= 17 && hour < 20) {
      currentWallpaper = wallpaperConfig.eveningUrl || '';
    } else {
      currentWallpaper = wallpaperConfig.nightUrl || '';
    }
  } else {
    currentWallpaper = wallpaperConfig.url || '';
  }

  return (
    <SystemContext.Provider value={{
      wallpaper: currentWallpaper,
      wallpaperConfig,
      setWallpaperConfig,
      isDarkMode,
      toggleDarkMode,
      brightness,
      setBrightness,
      volume,
      setVolume,
      isWifiOn,
      toggleWifi,
      isBluetoothOn,
      toggleBluetooth,
      currentTime,
      minimizeEffect,
      setMinimizeEffect
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
