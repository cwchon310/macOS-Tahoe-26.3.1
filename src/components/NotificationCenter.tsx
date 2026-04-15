import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    isNotificationCenterOpen, 
    closeNotificationCenter, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <>
          {/* Backdrop for closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotificationCenter}
            className="fixed inset-0 z-[9998]"
          />

          {/* Notification Center Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[320px] md:w-[380px] bg-black/40 backdrop-blur-[50px] border-l border-white/10 z-[9999] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    title="Clear All"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={closeNotificationCenter}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                  <Bell size={48} strokeWidth={1} />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 group relative transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {notification.appIcon ? (
                        <img 
                          src={notification.appIcon} 
                          alt={notification.appName} 
                          className="w-8 h-8 rounded-lg object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                          <Bell size={16} className="text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider truncate">
                            {notification.appName || 'System'}
                          </span>
                          <span className="text-[10px] text-white/40 whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1 truncate">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Widgets Section (Optional, mimicking macOS) */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Widgets</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-red-500 uppercase">Mon</span>
                  <span className="text-2xl font-bold text-white leading-none">9</span>
                </div>
                <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Vilnius</span>
                  <span className="text-2xl font-bold text-white leading-none">47°</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
