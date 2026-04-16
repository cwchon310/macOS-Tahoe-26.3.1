import React, { useState } from 'react';
import { User, Monitor, Wifi, Bluetooth, Speaker, Battery, Shield, Info, ChevronRight, Apple, Lock, Mail, Smartphone, Search, LayoutGrid, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../../context/SystemContext';

const MacIcon = ({ color, children }: { color: string, children: React.ReactNode }) => (
  <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.2)] border border-white/10 group-hover:scale-105 transition-transform`}>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div 
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${checked ? 'bg-blue-500' : 'bg-white/20'}`}
  >
    <motion.div 
      className="w-5 h-5 bg-white rounded-full shadow-md"
      animate={{ x: checked ? 20 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </div>
);

const Slider = ({ value, onChange, icon }: { value: number, onChange: (val: number) => void, icon?: React.ReactNode }) => (
  <div className="group relative h-8 flex items-center w-full">
    <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden h-1.5 my-auto">
      <div className="h-full bg-white/90 absolute left-0 top-0" style={{ width: `${value}%` }} />
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    {icon && (
      <div className="absolute -left-6 text-white/50 pointer-events-none flex items-center h-full">
        {icon}
      </div>
    )}
  </div>
);

const SETTINGS_MENU = [
  { id: 'apple-id', icon: <MacIcon color="bg-gradient-to-br from-blue-400 to-purple-500"><User size={16} className="text-white" /></MacIcon>, label: 'Sign in with your Apple Account', isHeader: true },
  { id: 'wifi', icon: <MacIcon color="bg-blue-500"><Wifi size={16} className="text-white" /></MacIcon>, label: 'Wi-Fi' },
  { id: 'bluetooth', icon: <MacIcon color="bg-blue-600"><Bluetooth size={16} className="text-white" /></MacIcon>, label: 'Bluetooth' },
  { id: 'network', icon: <MacIcon color="bg-blue-400"><Smartphone size={16} className="text-white" /></MacIcon>, label: 'Network' },
  { id: 'energy', icon: <MacIcon color="bg-green-500"><Battery size={16} className="text-white" /></MacIcon>, label: 'Energy' },
  { id: 'general', icon: <MacIcon color="bg-blue-500"><LayoutGrid size={16} className="text-white" /></MacIcon>, label: 'General' },
  { id: 'accessibility', icon: <MacIcon color="bg-blue-500"><User size={16} className="text-white" /></MacIcon>, label: 'Accessibility' },
  { id: 'appearance', icon: <MacIcon color="bg-pink-500"><Monitor size={16} className="text-white" /></MacIcon>, label: 'Appearance' },
  { id: 'desktop-dock', icon: <MacIcon color="bg-gray-600"><LayoutGrid size={16} className="text-white" /></MacIcon>, label: 'Desktop & Dock' },
  { id: 'display', icon: <MacIcon color="bg-blue-500"><Monitor size={16} className="text-white" /></MacIcon>, label: 'Displays' },
  { id: 'menu-bar', icon: <MacIcon color="bg-gray-500"><LayoutGrid size={16} className="text-white" /></MacIcon>, label: 'Menu Bar' },
  { id: 'siri', icon: <MacIcon color="bg-gradient-to-br from-purple-500 to-blue-500"><User size={16} className="text-white" /></MacIcon>, label: 'Siri' },
  { id: 'spotlight', icon: <MacIcon color="bg-blue-400"><Search size={16} className="text-white" /></MacIcon>, label: 'Spotlight' },
  { id: 'wallpaper', icon: <MacIcon color="bg-green-400"><ImageIcon size={16} className="text-white" /></MacIcon>, label: 'Wallpaper' },
  { id: 'notifications', icon: <MacIcon color="bg-red-500"><Speaker size={16} className="text-white" /></MacIcon>, label: 'Notifications' },
  { id: 'sound', icon: <MacIcon color="bg-red-500"><Speaker size={16} className="text-white" /></MacIcon>, label: 'Sound' },
];

const DYNAMIC_WALLPAPERS = [
  {
    name: 'macOS Sonoma',
    lightUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Sonoma-light.jpg',
    darkUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Sonoma-dark.jpg',
  },
  {
    name: 'macOS Ventura',
    lightUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Ventura-light.jpg',
    darkUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Ventura-dark.jpg',
  },
  {
    name: 'macOS Monterey',
    lightUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Monterey-light.jpg',
    darkUrl: 'https://raw.githubusercontent.com/vinceliuice/WhiteSur-wallpapers/master/1080p/Monterey-dark.jpg',
  }
];

const TIME_OF_DAY_WALLPAPERS = [
  {
    name: 'Mojave Desert',
    morningUrl: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=1920', // Sunrise/Morning
    afternoonUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920', // Day
    eveningUrl: 'https://images.unsplash.com/photo-1502790671504-542ad42d5189?q=80&w=1920', // Sunset
    nightUrl: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=1920', // Night
  },
  {
    name: 'Catalina Island',
    morningUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920',
    afternoonUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920',
    eveningUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1920',
    nightUrl: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?q=80&w=1920',
  }
];

const STATIC_WALLPAPERS = [
  'https://images.unsplash.com/photo-1531636338146-9e7e77076299?q=80&w=1920',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1920',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920',
  'https://images.unsplash.com/photo-1501854140884-074bf86ee91c?q=80&w=1920',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920',
];

export const Settings: React.FC = () => {
  const { 
    wallpaper, 
    wallpaperConfig,
    setWallpaperConfig, 
    isDarkMode, toggleDarkMode, 
    brightness, setBrightness, 
    volume, setVolume,
    isWifiOn, toggleWifi,
    isBluetoothOn, toggleBluetooth,
    minimizeEffect, setMinimizeEffect,
    magnificationFactor, setMagnificationFactor
  } = useSystem();

  const [selected, setSelected] = useState('general');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<'email' | 'password' | '2fa' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStep === 'email') setLoginStep('password');
    else if (loginStep === 'password') setLoginStep('2fa');
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    if (newCode.every(c => c !== '')) {
      verifyCode();
    }
  };

  const verifyCode = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsLoggedIn(true);
      setLoginStep('success');
    }, 1500);
  };

  return (
    <div className="flex h-full bg-[#1e1e1e]/95 text-white overflow-hidden rounded-b-xl backdrop-blur-2xl">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 border-r border-black/20 flex flex-col pt-12 shrink-0">
        <div className="px-4 mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-black/20 border border-white/10 rounded-md pl-8 pr-3 py-1 text-[12px] outline-none focus:border-blue-500/50 transition-all placeholder:text-white/40"
            />
            <div className="absolute left-2.5 top-1.5 text-white/40">
              <Search size={14} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {SETTINGS_MENU.map((item) => {
            if (item.id === 'apple-id') {
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelected(item.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] transition-all cursor-default group mb-4 ${
                    selected === item.id ? 'bg-blue-500 shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center shrink-0">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate">Sign in</span>
                    <span className="text-[10px] opacity-60 truncate leading-tight">with your Apple Account</span>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-white/20" />
                </div>
              );
            }
            return (
              <div 
                key={item.id} 
                onClick={() => setSelected(item.id)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] transition-all cursor-default group ${
                  selected === item.id ? 'bg-blue-500 shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="flex-1 font-medium truncate">{item.label}</span>
                <ChevronRight size={14} className="text-white/20" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#1e1e1e] relative">
        <AnimatePresence mode="wait">
          {selected === 'apple-id' && (
            <motion.div 
              key="apple-id"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 max-w-2xl mx-auto"
            >
              {!isLoggedIn ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-black flex items-center justify-center mb-6 shadow-2xl border border-white/10">
                    <Apple size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Sign in with your Apple ID</h2>
                  <p className="text-white/60 text-sm mb-8">Access your music, photos, and more across all your devices.</p>

                  <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    {loginStep === 'email' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <input 
                          type="email" 
                          placeholder="Apple ID" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-center"
                          required
                        />
                        <button type="submit" className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                          Continue
                        </button>
                      </motion.div>
                    )}

                    {loginStep === 'password' && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <input 
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-center"
                          required
                          autoFocus
                        />
                        <button type="submit" className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                          Sign In
                        </button>
                      </motion.div>
                    )}

                    {loginStep === '2fa' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col items-center">
                          <Smartphone size={48} className="text-blue-500 mb-4 animate-bounce" />
                          <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
                          <p className="text-sm text-white/40 mt-2">A verification code has been sent to your device.</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          {code.map((digit, i) => (
                            <input
                              key={i}
                              id={`code-${i}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleCodeChange(i, e.target.value)}
                              className="w-10 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold outline-none focus:border-blue-500 transition-all"
                            />
                          ))}
                        </div>
                        {isVerifying && (
                          <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </div>
                        )}
                      </motion.div>
                    )}
                  </form>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-2xl border-4 border-white/10">
                      {email ? email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">John Doe</h2>
                      <p className="text-white/40">{email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-default group">
                      <Lock className="mb-4 text-blue-500 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold mb-1">Password & Security</h4>
                      <p className="text-xs text-white/40">2FA is On</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-default group">
                      <Mail className="mb-4 text-purple-500 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold mb-1">Payment & Shipping</h4>
                      <p className="text-xs text-white/40">Apple Card, Visa</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {selected === 'appearance' && (
            <motion.div 
              key="appearance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-12"
            >
              <h2 className="text-3xl font-bold mb-8">Appearance</h2>
              <div className="space-y-12">
                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">Appearance Mode</h3>
                  <div className="flex gap-12">
                    <div 
                      className="flex flex-col items-center gap-3 group cursor-pointer"
                      onClick={() => isDarkMode && toggleDarkMode()}
                    >
                      <div className={`w-32 h-20 rounded-xl bg-[#f5f5f5] border-4 shadow-2xl transition-transform group-hover:scale-105 relative overflow-hidden ${!isDarkMode ? 'border-blue-500' : 'border-transparent'}`}>
                        <div className="absolute top-2 left-2 w-full h-4 bg-white shadow-sm rounded-sm" />
                        <div className="absolute top-8 left-2 w-16 h-8 bg-blue-500 rounded-md" />
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    <div 
                      className="flex flex-col items-center gap-3 group cursor-pointer"
                      onClick={() => !isDarkMode && toggleDarkMode()}
                    >
                       <div className={`w-32 h-20 rounded-xl bg-[#1e1e1e] border-4 shadow-2xl transition-transform group-hover:scale-105 relative overflow-hidden ${isDarkMode ? 'border-blue-500' : 'border-transparent'}`}>
                        <div className="absolute top-2 left-2 w-full h-4 bg-white/10 rounded-sm" />
                        <div className="absolute top-8 left-2 w-16 h-8 bg-blue-500 rounded-md" />
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group cursor-pointer">
                       <div className="w-32 h-20 rounded-xl bg-gradient-to-r from-[#f5f5f5] to-[#1e1e1e] border-4 border-transparent shadow-2xl transition-transform group-hover:scale-105" />
                      <span className="text-sm font-medium">Auto</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">Accent Color</h3>
                  <div className="flex gap-4">
                    {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-gray-500'].map(color => (
                      <div key={color} className={`w-6 h-6 rounded-full ${color} cursor-pointer hover:scale-125 transition-all shadow-lg ring-2 ring-transparent hover:ring-white/20`} />
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {selected === 'desktop-dock' && (
            <motion.div 
              key="desktop-dock"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-12"
            >
              <h2 className="text-3xl font-bold mb-8">Desktop & Dock</h2>
              <div className="space-y-12">
                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">Dock</h3>
                  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between hover:bg-white/5 cursor-default">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Minimize window animation</span>
                        <span className="text-[10px] text-white/40">Genie effect enables Dock magnification</span>
                      </div>
                      <select 
                        value={minimizeEffect}
                        onChange={(e) => setMinimizeEffect(e.target.value as 'genie' | 'scale')}
                        className="bg-black/20 border border-white/10 rounded-md px-3 py-1 text-sm outline-none focus:border-blue-500/50 text-white"
                      >
                        <option value="genie">Genie Effect</option>
                        <option value="scale">Scale Effect</option>
                      </select>
                    </div>
                    <div className="p-4 flex flex-col gap-4 hover:bg-white/5 cursor-default">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Magnification</span>
                        <span className="text-xs text-white/40">{magnificationFactor.toFixed(1)}x</span>
                      </div>
                      <div className="px-2">
                        <Slider 
                          value={(magnificationFactor - 1) * 100} 
                          onChange={(val) => setMagnificationFactor(1 + (val / 100))} 
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {selected === 'wallpaper' && (
            <motion.div key="wallpaper" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <h2 className="text-3xl font-bold mb-8">Wallpaper</h2>
              
              <div className="space-y-10">
                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Dynamic Wallpapers</h3>
                  <p className="text-xs text-white/50 mb-6">These wallpapers change automatically to match your Appearance setting (Light/Dark).</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {DYNAMIC_WALLPAPERS.map((wp, i) => {
                      const isActive = wallpaperConfig.type === 'dynamic' && wallpaperConfig.lightUrl === wp.lightUrl;
                      return (
                        <div 
                          key={i} 
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${isActive ? 'border-blue-500' : 'border-transparent hover:border-white/50'}`}
                          onClick={() => setWallpaperConfig({ type: 'dynamic', lightUrl: wp.lightUrl, darkUrl: wp.darkUrl })}
                        >
                          <div className="absolute inset-0 flex">
                            <img src={wp.lightUrl} className="w-1/2 h-full object-cover" alt={`${wp.name} Light`} referrerPolicy="no-referrer" />
                            <img src={wp.darkUrl} className="w-1/2 h-full object-cover" alt={`${wp.name} Dark`} referrerPolicy="no-referrer" />
                          </div>
                          {isActive && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 rounded-full p-1">
                                <Check size={16} className="text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium">
                            {wp.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Time of Day Wallpapers</h3>
                  <p className="text-xs text-white/50 mb-6">These wallpapers change automatically based on the time of day.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {TIME_OF_DAY_WALLPAPERS.map((wp, i) => {
                      const isActive = wallpaperConfig.type === 'timeOfDay' && wallpaperConfig.morningUrl === wp.morningUrl;
                      return (
                        <div 
                          key={i} 
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${isActive ? 'border-blue-500' : 'border-transparent hover:border-white/50'}`}
                          onClick={() => setWallpaperConfig({ 
                            type: 'timeOfDay', 
                            morningUrl: wp.morningUrl, 
                            afternoonUrl: wp.afternoonUrl,
                            eveningUrl: wp.eveningUrl,
                            nightUrl: wp.nightUrl
                          })}
                        >
                          <div className="absolute inset-0 flex">
                            <img src={wp.morningUrl} className="w-1/4 h-full object-cover" alt={`${wp.name} Morning`} referrerPolicy="no-referrer" />
                            <img src={wp.afternoonUrl} className="w-1/4 h-full object-cover" alt={`${wp.name} Afternoon`} referrerPolicy="no-referrer" />
                            <img src={wp.eveningUrl} className="w-1/4 h-full object-cover" alt={`${wp.name} Evening`} referrerPolicy="no-referrer" />
                            <img src={wp.nightUrl} className="w-1/4 h-full object-cover" alt={`${wp.name} Night`} referrerPolicy="no-referrer" />
                          </div>
                          {isActive && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 rounded-full p-1">
                                <Check size={16} className="text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium">
                            {wp.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Static Wallpapers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {STATIC_WALLPAPERS.map((url, i) => {
                      const isActive = wallpaperConfig.type === 'static' && wallpaperConfig.url === url;
                      return (
                        <div 
                          key={i} 
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${isActive ? 'border-blue-500' : 'border-transparent hover:border-white/50'}`}
                          onClick={() => setWallpaperConfig({ type: 'static', url })}
                        >
                          <img src={url} className="w-full h-full object-cover" alt={`Wallpaper ${i}`} referrerPolicy="no-referrer" />
                          {isActive && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 rounded-full p-1">
                                <Check size={16} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Custom URL</h3>
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white/10 border border-white/5 rounded-lg px-4 py-2 text-[13px] outline-none focus:border-blue-500/50 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setWallpaperConfig({ type: 'static', url: e.currentTarget.value });
                      }
                    }}
                  />
                </section>
              </div>
            </motion.div>
          )}

          {selected === 'wifi' && (
            <motion.div key="wifi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Wi-Fi</h2>
                <Toggle checked={isWifiOn} onChange={toggleWifi} />
              </div>
              <div className={`bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-opacity ${!isWifiOn ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between hover:bg-white/5 cursor-default">
                  <div className="flex items-center gap-3">
                    <Wifi size={18} className="text-blue-500" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Home-5G</span>
                      <span className="text-xs text-white/40">Connected</span>
                    </div>
                  </div>
                  <Lock size={14} className="text-white/20" />
                </div>
                <div className="p-4 border-b border-white/10 flex items-center justify-between hover:bg-white/5 cursor-default">
                  <div className="flex items-center gap-3">
                    <Wifi size={18} className="text-white/40" />
                    <span className="text-sm font-medium">Starbucks_Free</span>
                  </div>
                  <Wifi size={14} className="text-white/20" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-default">
                  <div className="flex items-center gap-3">
                    <Wifi size={18} className="text-white/40" />
                    <span className="text-sm font-medium">iPhone Hotspot</span>
                  </div>
                  <Lock size={14} className="text-white/20" />
                </div>
              </div>
            </motion.div>
          )}

          {selected === 'bluetooth' && (
            <motion.div key="bluetooth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Bluetooth</h2>
                <Toggle checked={isBluetoothOn} onChange={toggleBluetooth} />
              </div>
              {isBluetoothOn ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-sm text-white/40">Searching for nearby devices...</p>
                  <div className="mt-4 flex justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="mt-8 space-y-2 text-left">
                     <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><Smartphone size={14} /></div>
                           <span>iPhone 16 Pro</span>
                        </div>
                        <button className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">Connect</button>
                     </div>
                     <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"><Speaker size={14} /></div>
                           <span>AirPods Pro</span>
                        </div>
                        <button className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">Connect</button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center text-white/40">
                  <Bluetooth size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Bluetooth is off</p>
                </div>
              )}
            </motion.div>
          )}

          {selected === 'sound' && (
            <motion.div key="sound" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <h2 className="text-3xl font-bold mb-8">Sound</h2>
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Output Volume</h3>
                  <div className="pl-6">
                    <Slider value={volume} onChange={setVolume} icon={<Speaker size={16} />} />
                  </div>
                </section>
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium">MacBook Pro Speakers</span>
                    <span className="text-xs text-white/40">Built-in</span>
                  </div>
                  <div className="p-4 border-b border-white/10 flex items-center justify-between hover:bg-white/5">
                    <span className="text-sm">External Headphones</span>
                    <span className="text-xs text-white/40">Headphone port</span>
                  </div>
                </div>
                <section>
                   <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Alert Sound</h3>
                   <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                      {['Boop', 'Breeze', 'Bubble', 'Crystal', 'Funky', 'Hero'].map(sound => (
                         <div key={sound} className="py-2 px-2 hover:bg-white/10 rounded cursor-pointer text-sm">{sound}</div>
                      ))}
                   </div>
                </section>
              </div>
            </motion.div>
          )}

          {selected === 'battery' && (
            <motion.div key="battery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <h2 className="text-3xl font-bold mb-8">Battery</h2>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                <div className="relative w-48 h-24 border-4 border-white/20 rounded-3xl flex items-center px-2 mb-6">
                  <div className="h-16 w-full bg-green-500 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  <div className="absolute -right-4 w-4 h-8 bg-white/20 rounded-r-lg" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">100%</span>
                </div>
                <p className="text-sm text-white/60">Power Source: Power Adapter</p>
                <p className="text-xs text-white/40 mt-1">Battery is fully charged</p>
                
                <div className="w-full mt-8 space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm">Low Power Mode</span>
                      <Toggle checked={false} onChange={() => {}} />
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm">Battery Health</span>
                      <span className="text-sm text-green-400">Normal (100%)</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {selected === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <h2 className="text-3xl font-bold mb-8">Privacy & Security</h2>
              <div className="space-y-4">
                {['Location Services', 'Contacts', 'Calendars', 'Reminders', 'Photos', 'Microphone', 'Camera', 'Accessibility', 'Input Monitoring', 'Full Disk Access'].map(item => (
                  <div key={item} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-default">
                    <span className="text-sm font-medium">{item}</span>
                    <ChevronRight size={14} className="text-white/20" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selected === 'general' && (
            <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 rounded-2xl bg-gray-500 flex items-center justify-center shadow-2xl border border-white/10 mb-4">
                  <LayoutGrid size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">General</h2>
                <p className="text-[13px] text-white/40 text-center mt-2 max-w-xs leading-relaxed">
                  Manage your overall setup and preferences for Mac, such as software updates, device language, AirDrop, and more.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-8">
                {[
                  { label: 'About', icon: <MacIcon color="bg-gray-500"><Info size={14} className="text-white" /></MacIcon> },
                  { label: 'Software Update', icon: <MacIcon color="bg-gray-500"><LayoutGrid size={14} className="text-white" /></MacIcon> },
                  { label: 'Storage', icon: <MacIcon color="bg-gray-600"><LayoutGrid size={14} className="text-white" /></MacIcon> },
                  { label: 'AppleCare & Warranty', icon: <MacIcon color="bg-red-500"><Apple size={14} className="text-white" /></MacIcon> },
                ].map((item, i) => (
                  <div key={i} className="p-4 border-b border-white/10 last:border-0 flex items-center justify-between hover:bg-white/5 cursor-default group">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-8">
                {[
                  { label: 'AirDrop & Continuity', icon: <MacIcon color="bg-blue-500"><Wifi size={14} className="text-white" /></MacIcon> },
                ].map((item, i) => (
                  <div key={i} className="p-4 border-b border-white/10 last:border-0 flex items-center justify-between hover:bg-white/5 cursor-default group">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-8">
                {[
                  { label: 'AutoFill & Passwords', icon: <MacIcon color="bg-gray-500"><Lock size={14} className="text-white" /></MacIcon> },
                  { label: 'Date & Time', icon: <MacIcon color="bg-blue-500"><LayoutGrid size={14} className="text-white" /></MacIcon> },
                  { label: 'Language & Region', icon: <MacIcon color="bg-blue-500"><LayoutGrid size={14} className="text-white" /></MacIcon> },
                  { label: 'Login Items & Extensions', icon: <MacIcon color="bg-gray-500"><LayoutGrid size={14} className="text-white" /></MacIcon> },
                  { label: 'Sharing', icon: <MacIcon color="bg-blue-500"><Wifi size={14} className="text-white" /></MacIcon> },
                ].map((item, i) => (
                  <div key={i} className="p-4 border-b border-white/10 last:border-0 flex items-center justify-between hover:bg-white/5 cursor-default group">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selected === 'display' && (
            <motion.div key="display" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-12">
              <h2 className="text-3xl font-bold mb-8">Displays</h2>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                <div className="w-64 h-40 bg-gray-800 rounded-xl border-4 border-gray-700 shadow-2xl relative mb-8">
                  <div className="absolute inset-2 bg-blue-500/10 rounded-lg overflow-hidden border border-white/5">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: `url(${wallpaper})` }}
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-700 rounded-b-xl" />
                </div>
                <div className="w-full space-y-6">
                  <section>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Brightness</h3>
                    <div className="pl-6">
                      <Slider value={brightness} onChange={setBrightness} icon={<Monitor size={16} />} />
                    </div>
                  </section>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="text-sm block mb-1 text-white/40">Resolution</span>
                      <span className="text-sm font-medium">Default (Liquid Retina XDR)</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="text-sm block mb-1 text-white/40">Refresh Rate</span>
                      <span className="text-sm font-medium">ProMotion (120Hz)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                     <span className="text-sm">True Tone</span>
                     <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
