import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Power, RefreshCw, Moon, Apple } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onRestart?: () => void;
  onSleep?: () => void;
  onShutDown?: () => void;
  wallpaper: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRestart, onSleep, onShutDown, wallpaper }) => {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin();
      }, 800);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-cover bg-center flex flex-col items-center justify-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 rounded-full bg-gray-200 shadow-2xl overflow-hidden border-4 border-white/10 relative group">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
            alt="User" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white drop-shadow-md mb-1">John Doe</h2>
          
          <motion.form 
            onSubmit={handleSubmit}
            animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative mt-4"
          >
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-48 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm placeholder:text-white/50 outline-none focus:bg-white/30 transition-all text-center shadow-lg"
              autoFocus
              disabled={isLoading}
            />
            
            {password.length > 0 && !isLoading && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowRight size={14} className="text-white/80" />
              </motion.button>
            )}

            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </motion.form>
          
          <p className="text-xs text-white/50 mt-3 font-medium drop-shadow-sm">Touch ID or Enter Password</p>
          
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-full h-[1px] bg-white/10 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-2 text-[10px] text-white/40 uppercase tracking-widest backdrop-blur-md">OR</span>
            </div>
            
            <button 
              onClick={(e) => { e.preventDefault(); handleSubmit(e); }}
              className="flex items-center justify-center gap-2 w-48 bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors shadow-lg"
            >
              <Apple size={16} />
              Sign in with Apple
            </button>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 z-10">
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={onSleep}>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
              <Moon size={18} className="text-white/80" />
            </div>
            <span className="text-[10px] font-medium text-white/60 group-hover:text-white/90">Sleep</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={onRestart}>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
              <RefreshCw size={18} className="text-white/80" />
            </div>
            <span className="text-[10px] font-medium text-white/60 group-hover:text-white/90">Restart</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={onShutDown}>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
              <Power size={18} className="text-white/80" />
            </div>
            <span className="text-[10px] font-medium text-white/60 group-hover:text-white/90">Shut Down</span>
          </div>
        </div>
      </div>
    </div>
  );
};
